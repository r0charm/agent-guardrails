# Data Policy

Data held in AWS: S3, RDS, and the stores that hand out secrets. Split from cloud by what breaks rather than by vendor: a deleted bucket and a deleted database fail the same way, and neither is undone by re-running anything.

## Denied

| Command | Why |
|---|---|
| `s3 rb`, `delete-bucket` | The bucket. |
| `rds delete-db-instance`, `delete-db-cluster` | The database. |

## Asked: the ones that do not read as destructive

The reason this domain has its own file. Each of these looks routine.

| Command | Why |
|---|---|
| `s3 sync --delete` | Deletes at the destination whatever is missing from the source. Run in the wrong direction it empties the bucket, and the word "delete" is a flag rather than the verb. |
| `s3 mv` | A copy followed by a delete at the source. |

## Asked: reads that move data or yield secrets

| Command | Why |
|---|---|
| `secretsmanager get-secret-value` | Prints the secret into a transcript that keeps it. |
| `ssm get-parameter --with-decryption` | The same, decrypted. |
| `s3 cp s3://...` to a local path | Copies data out of the bucket. |

## Asked: ordinary writes

`s3 rm/put-object/delete-object/sync`, `put-bucket-policy` and the other access-changing puts, `rds modify/reboot/failover/restore`.

## Not guarded

`s3 ls`, `s3api head-object`, `describe-db-instances`.
