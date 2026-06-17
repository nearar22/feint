"""Take a seat (deterministic deal), then defend (the AI interrogator write).
Confirms the hidden-role mechanic and reveal at settlement."""
import json
import os
import sys
import time

sys.path.insert(0, os.path.dirname(__file__))
import patch_status  # noqa: E402
patch_status.apply()
from gl import make_client, read_view  # noqa: E402

TERMINAL = {"ACCEPTED", "FINALIZED", "UNDETERMINED", "CANCELED"}


def wait(client, tx, label):
    for i in range(160):
        try:
            t = client.get_transaction(transaction_hash=tx)
        except Exception as e:
            print(f"[{label} {i}] err {e}", flush=True)
            time.sleep(8)
            continue
        name = t.get("status_name") or t.get("status") if isinstance(t, dict) else None
        ex = t.get("tx_execution_result_name") if isinstance(t, dict) else None
        print(f"[{label} {i}] status={name} exec={ex}", flush=True)
        if str(name) in TERMINAL:
            return
        time.sleep(8)


def main():
    root = os.path.dirname(os.path.dirname(__file__))
    addr = json.load(open(os.path.join(root, "deployment.json")))["address"]
    client, account = make_client()
    print("addr:", addr)

    try:
        tx = client.write_contract(address=addr, function_name="take_seat", args=["Tester"], value=0)
        print("seat tx:", tx)
        wait(client, tx, "seat")
    except Exception as e:
        print("seat submit note:", e)
    time.sleep(3)

    hands = read_view(client, account, addr, "get_hands", [0])
    hand = hands[0] if hands else {}
    hand_id = hand.get("id")
    print("dealt hand:", hand_id, "claim:", hand.get("claim"), "status:", hand.get("status"), "role-leaked?", hand.get("revealedRole"))

    defense = (
        "Yes. Two winters ago, the night before our mainnet launch, a nil-pointer in the "
        "settlement path showed up only under concurrent load. I traced it at 3am, wrote a "
        "regression test that reproduced it, patched the lock ordering, and we shipped on time. "
        "I still remember the exact commit message because my hands were shaking."
    )
    try:
        tx = client.write_contract(address=addr, function_name="defend", args=[hand_id, defense], value=0)
        print("defend tx:", tx)
        wait(client, tx, "defend")
    except Exception as e:
        print("defend submit note:", e)

    print("\nstats:", json.dumps(read_view(client, account, addr, "get_stats"), default=str))
    settled = read_view(client, account, addr, "get_hand", [hand_id])
    print("read:", settled.get("read"), "suspicion:", settled.get("suspicion"))
    print("outcome:", settled.get("outcome"), "revealedRole:", settled.get("revealedRole"))
    print("tell:", str(settled.get("tell"))[:200])


if __name__ == "__main__":
    main()
