# Data Policy

Anything holding data: DynamoDB, S3, MongoDB, RDS. Split from cloud by what breaks rather than by vendor. `aws dynamodb delete-table` and `db.collection.drop()` fail the same way, and neither is undone by re-running anything.

## Denied

| Command | Why |
|---|---|
| `dynamodb delete-table` | The table and everything in it. |
| `s3 rb`, `delete-bucket` | The bucket. |
| `rds delete-db-instance`, `delete-db-cluster` | The database. |
| `dropDatabase()` | The whole database. |
| `mongorestore --drop` | Drops each collection before restoring, so a wrong dump replaces good data with old data. |
| `deleteMany({})`, `remove({})` | An empty filter matches every document. |

## Asked: the ones that do not read as destructive

The reason this domain has its own file. Each of these looks routine.

| Command | Why |
|---|---|
| `s3 sync --delete` | Deletes at the destination whatever is missing from the source. Run in the wrong direction it empties the bucket, and the word "delete" is a flag rather than the verb. |
| `dynamodb put-item` | Replaces the whole item rather than merging. Attributes not in the request are dropped. |
| `s3 mv` | A copy followed by a delete at the source. |

## Asked: reads that move data or yield secrets

| Command | Why |
|---|---|
| `secretsmanager get-secret-value` | Prints the secret into a transcript that keeps it. |
| `ssm get-parameter --with-decryption` | The same, decrypted. |
| `mongodump` | Copies the data out to disk. |
| `s3 cp s3://...` to a local path | Copies data out of the bucket. |

## Asked: ordinary writes

`dynamodb delete-item/batch-write-item/update-item/update-table`, `s3 rm/put-object/delete-object/sync`, `put-bucket-policy` and the other access-changing puts, `drop/deleteMany/deleteOne/updateMany/insertMany/replaceOne`, `rds modify/reboot/failover/restore`.

## Not guarded

`dynamodb scan/query/get-item/describe-table/list-tables`, `s3 ls`, `find`, `aggregate`, `countDocuments`, `describe-db-instances`.
