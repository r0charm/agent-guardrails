# S3 Policy

`aws s3` and `aws s3api`. Verbs are anchored after the service, and the bucket deletes at the end too, since `delete-bucket` is a prefix of `delete-bucket-policy`.

## Denied

| Command | Why |
|---|---|
| `s3 rb`, `s3api delete-bucket` | The bucket. |
| `s3api put-bucket-versioning ... Status=Suspended` | The recovery net. With versioning on, an overwrite or delete keeps the old version; suspended, every later one is final. |

## Asked: the ones that do not read as destructive

| Command | Why |
|---|---|
| `s3 sync --delete` | Deletes at the destination whatever is missing from the source. Run in the wrong direction it empties the bucket, and the word "delete" is a flag rather than the verb. |
| `s3 mv` | A copy followed by a delete at the source. |
| `s3api put-bucket-lifecycle-configuration` | Deletes objects later, unattended, by rules nobody reviews again. |
| `s3api delete-object(s) --version-id` | Deletes a version permanently, past what versioning would recover. |

## Asked: data out

`s3 cp s3://...` to a local path, and `s3 presign`, which hands the object to anyone holding the URL.

## Asked: writes, access and configuration

`s3 rm`, `s3api delete-object(s)`, `s3 cp` into a bucket, `s3api put-object`, `s3 sync`; any `put-*` or `delete-*` of bucket policy, ACLs, public access block and the rest of the bucket configuration; object retention, legal hold and lock.

## Not guarded

`s3 ls`, `s3api head-object`, `get-*`, `list-*`.
