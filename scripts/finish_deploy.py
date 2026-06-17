"""Resume polling the Feint deploy tx to terminal, then write deployment.json."""
import json
import os
import sys
import time

sys.path.insert(0, os.path.dirname(__file__))
import patch_status  # noqa: E402
patch_status.apply()
from gl import make_client  # noqa: E402

TX = "0x004a86b92f887be5e6a0ac43cde917a5a5f26b2723af1d1fcddcf1634010c9b9"
ADDR = "0x3DFAE17DAC9cA83d6e070E240E3128572D721D4F"
TERMINAL = {"ACCEPTED", "FINALIZED", "UNDETERMINED", "CANCELED"}


def main():
    client, _ = make_client()
    for i in range(200):
        try:
            t = client.get_transaction(transaction_hash=TX)
        except Exception as e:
            print(f"[{i}] err {e}", flush=True)
            time.sleep(8)
            continue
        name = t.get("status_name") or t.get("status") if isinstance(t, dict) else None
        exec_name = t.get("tx_execution_result_name") if isinstance(t, dict) else None
        print(f"[{i}] status={name} exec={exec_name}", flush=True)
        if str(name) in TERMINAL:
            root = os.path.dirname(os.path.dirname(__file__))
            json.dump({"tx": TX, "address": ADDR}, open(os.path.join(root, "deployment.json"), "w"), indent=2)
            print("wrote deployment.json exec:", exec_name)
            return
        time.sleep(8)
    print("still not terminal")


if __name__ == "__main__":
    main()
