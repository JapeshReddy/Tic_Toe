# Triage Labels

The skills speak in terms of five canonical triage roles. This file maps those roles to the actual label strings used in this repo's issue tracker.

| Label in mattpocock/skills | Label in our tracker | Meaning                                  |
| -------------------------- | -------------------- | ---------------------------------------- |
| `needs-triage`             | `needs-triage`       | Maintainer needs to evaluate this issue  |
| `needs-info`               | `needs-info`         | Waiting on reporter for more information |
| `ready-for-agent`          | `ready-for-agent`    | Fully specified, ready for an AFK agent  |
| `ready-for-human`          | `ready-for-human`    | Requires human implementation            |
| `wontfix`                  | `wontfix`            | Will not be actioned                     |

When a skill mentions a role (e.g. "apply the AFK-ready triage label"), use the corresponding label string from this table.

Edit the right-hand column to match whatever vocabulary you actually use.

## Additional labels

These are **not** triage roles. `/triage` must never apply or interpret them, and
they say nothing about whether an issue has been triaged.

| Label        | Meaning                                                                                                                                                                                                  |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `sandcastle` | An implementation-routing signal: this issue should be picked up and implemented by the Sandcastle/RALPH agent loop. Applied explicitly by a human, never automatically. Read by `.sandcastle/prompt.md`. |

`sandcastle` is orthogonal to triage state. An issue is normally both
`ready-for-agent` (triage says it is fully specified) and `sandcastle` (a human
has released it for autonomous implementation), but either can appear without
the other.
