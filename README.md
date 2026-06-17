# Feint

*House rules for the bluff table.*

Welcome to the table. One player sits across from the Interrogator, an AI that
has read more lies than you have told. The house deals you a secret. You spend
the hand pretending you do not have one. These are the rules, in the order you
will need them.

---

## How a hand is dealt

Take a seat and the house deals you, in secret, one of two roles:

- a **Truth-Teller**, handed a claim that happens to be true, or
- a **Deceiver**, handed a claim that happens to be false.

Either way, the same claim is laid face-up on the table, and either way your job
is identical: argue that the claim is true. Only you and the contract know which
role you hold. The role is sealed; no one watching the table, and no view of the
table, can read it while the hand is live. The deal is drawn deterministically
from your address and the hand number, so the house cannot be accused of dealing
you a loser on purpose, yet you cannot peek at the next hand either.

At the table this is the spotlit claim card. The role beneath it is face-down.

## How the hand is played

You write a defense. You argue the claim is true with whatever you have: a
specific memory, a texture of detail, the confidence of someone who lived it.
The Interrogator reads only the claim and your defense. It never sees your role.

It returns one of three reads, with a suspicion score from zero to one hundred:

- **TRUTH** (suspicion 0 to 39): it believes you.
- **UNSURE** (40 to 66): it cannot tell.
- **BLUFF** (67 to 100): it has caught a lie.

## How to win

You win by **concealing your role**, which at this table means one thing: do not
get read as a BLUFF. A read of TRUTH or UNSURE means the hand is **CONCEALED**
and you win. A read of BLUFF means you are **EXPOSED** and you lose. A
Deceiver who writes vividly enough to be believed wins; a Truth-Teller who comes
across as shifty can still be caught. The blood-red stamp falls, and only then
is your hidden role turned face-up.

Win and your **composure streak** climbs by one. Lose and it falls to zero.

## The Tell

The Interrogator is not guessing at random and it cannot be talked out of its
rules. The whole defense reaches it as untrusted text. A defense that tries to
announce its own role, or to instruct the Interrogator how to read it, is itself
the strongest tell of a bluff. Concrete, lived, specific detail reads as truth;
vague, evasive, or over-insistent prose reads as a lie. After it speaks, a
deterministic backstop pins the suspicion score inside the band its read
requires, so a TRUTH verdict can never carry a high suspicion and a BLUFF can
never look mild.

---

## What the house keeps (the contract)

The contract is the whole house; there is no server. Public hand state and the
sealed secret are stored separately, and no view ever returns the secret of a
hand that is still in play.

- `take_seat(alias)` deals a fresh hand and returns only the claim to defend,
  never the role.
- `defend(hand_id, defense)` is the one AI write. It convenes the Interrogator
  under consensus, settles the hand, reveals the role, updates the streak, and
  returns the verdict.
- `get_hands(start)` and `get_hand(id)` read the table. A hand still in play
  exposes only its claim and status; a settled hand also carries the read, the
  suspicion, the outcome, and the now-revealed role.
- `get_streak(player)` and `get_stats()` read the composure streak and the
  house tallies.

### How the Interrogator reaches a verdict

A leader proposes the read, and every validator re-reads the same claim and
defense. They must agree on the categorical read exactly, and on the suspicion
score within a bounded tolerance.

```python
def validator_fn(leaders_res):
    if not isinstance(leaders_res, gl.vm.Return):
        return _handle_leader_error(leaders_res, leader_fn)
    mine = leader_fn()
    theirs = leaders_res.calldata
    if not isinstance(theirs, dict):
        return False
    if mine["read"] != theirs.get("read"):     # TRUTH / BLUFF / UNSURE must match
        return False
    a = int(mine["suspicion"])
    b = int(theirs.get("suspicion", -1))
    return b >= 0 and abs(a - b) <= max(20, (20 * max(a, b)) // 100)

return gl.vm.run_nondet_unsafe(leader_fn, validator_fn)
```

The win is then computed in code by comparing your sealed role against that
public read, so the outcome cannot be argued with after the fact.

## The room (the frontend)

A single-table interrogation kiosk, one hand at a time, no feed and no scrolling.
The claim card sits under a hard drifting spotlight over film grain; the
Interrogator is a thin watching line that narrows as it reads you; the verdict
arrives as a stamp that slams down and turns your role face-up. The look is
high-contrast monochrome noir: near-black and bone-white across a full value
range with a single blood-red accent on the stamp, the suspicion meter, and the
streak. Past hands rest in a slide-over ledger. The table reads the chain
directly; an AI write takes a few minutes, and because the installed client can
raise on the submission receipt while the transaction is still live, the room
confirms a verdict by watching the hand turn SETTLED on-chain rather than
trusting the write to return.

Nothing is wagered and nothing moves but the truth. You pay only the network fee
to sit down.

---

The table is open and verifiable:

- Contract: [`0x3DFAE17DAC9cA83d6e070E240E3128572D721D4F`](https://explorer-bradbury.genlayer.com/address/0x3DFAE17DAC9cA83d6e070E240E3128572D721D4F)
- Deploy transaction: [`0x004a86b92f887be5e6a0ac43cde917a5a5f26b2723af1d1fcddcf1634010c9b9`](https://explorer-bradbury.genlayer.com/tx/0x004a86b92f887be5e6a0ac43cde917a5a5f26b2723af1d1fcddcf1634010c9b9)

The full backend is `contracts/contract.py`.
