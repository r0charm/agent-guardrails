# RDS Policy

`aws rds` and the Data API, `aws rds-data`.

## Denied: the database

| Command | Why |
|---|---|
| `delete-db-instance`, `delete-db-cluster` | The database. |

## Denied: the recovery net

| Command | Why |
|---|---|
| `delete-db-snapshot`, `delete-db-cluster-snapshot` | The snapshot a restore would have needed. |
| `delete-db-instance-automated-backup`, `delete-db-cluster-automated-backups` | The same, for automated backups. |
| `modify-db-instance\|cluster --backup-retention-period 0` | Turns off automated backups and deletes the ones that exist. |

Everything asked below is survivable while a snapshot or backup holds the old data. These are what remove it, which is why they are denied like `git reflog expire`.

## Asked

| Command | Why |
|---|---|
| `modify-db-snapshot-attribute` | Changes who can restore the snapshot; `all` makes it public. |
| `generate-db-auth-token` | Prints a database credential into the transcript. |
| `modify-db-*`, `reboot-db-*`, `failover-db-*`, `restore-db-*`, `stop-db-*` | Changes or interrupts the database. |
| `rds-data execute-statement` with `DELETE`, `UPDATE`, `INSERT`, `DROP`, `TRUNCATE`, `ALTER` | SQL that changes data or schema. A `SELECT` stays silent. |

## Not guarded

`describe-*`, `create-db-snapshot`, and Data API reads. Taking a snapshot is the cheapest safety step there is.
