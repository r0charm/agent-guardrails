# DynamoDB Policy

Matched by the subcommand after `dynamodb`, so a table named after a verb stays silent.

## Denied: the data itself

| Command | Why |
|---|---|
| `dynamodb delete-table` | The table and everything in it. |

## Denied: the recovery net

| Command | Why |
|---|---|
| `dynamodb delete-backup` | The backup a restore would have needed. |
| `dynamodb update-continuous-backups ... Enabled=false` | Turns off point in time recovery, so nothing before now can be restored. |

Everything asked below is survivable while a backup or point in time recovery holds the old data. These two are what remove it, which is why they are denied like `git reflog expire`.

## Asked: the ones that do not read as destructive

| Command | Why |
|---|---|
| `put-item` | Replaces the whole item rather than merging. Attributes not in the request are dropped. |
| `update-time-to-live` | Deletes items later, unattended, by an attribute nobody reviews again. |

## Asked: data out, writes, access

`export-table-to-point-in-time`; `delete-item`, `batch-write-item`, `update-item`, `transact-write-items`, `update-table`, `restore-table-*`, `import-table`, `update-continuous-backups`; `put-resource-policy`, `delete-resource-policy`.

PartiQL through `execute-statement`, `batch-execute-statement` and `execute-transaction` asks on `DELETE FROM`, `UPDATE ... SET`, `INSERT INTO`, or statements read from a `file://` the guard cannot see. A `SELECT` stays silent.

## Not guarded

`scan`, `query`, `get-item`, `describe-*`, `list-*`, and PartiQL `SELECT`.
