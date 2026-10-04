# Secrets Policy

Credentials: the stores that hand them out, and the files that hold them. A secret printed once sits in the session transcript from then on, so reads ask here even though they change nothing.

## Denied

| Command | Why |
|---|---|
| `secretsmanager delete-secret --force-delete-without-recovery` | Skips the recovery window, which is the net for a deleted secret. Whatever authenticates with it breaks for good. |

## Asked: reads that print a credential

| Command | Why |
|---|---|
| `secretsmanager get-secret-value`, `batch-get-secret-value` | Prints the secret. |
| `ssm get-parameter(s) ... --with-decryption` | Prints the decrypted value. |
| `kms decrypt` | Prints plaintext. |
| `aws configure get <secret or key>`, `aws configure export-credentials` | Prints AWS credentials. |
| `cat`, `grep`, `cp`, `curl` and the like on a credential file | `~/.aws/credentials`, private keys in `~/.ssh`, `.netrc`, `.git-credentials`, `.npmrc`, `.pgpass`, `~/.docker/config.json`, `.env` and its environment variants. |

## Asked: changes to what everything else authenticates with

`secretsmanager delete-secret`, `put-secret-value`, `update-secret`, `rotate-secret`, and its resource policies; `ssm put-parameter`, `delete-parameter(s)`.

## Not guarded

`list-secrets`, `describe-secret`, `ssm get-parameter` without decryption, `aws configure get region`. A public key (`.pub`), `.env.example`, `source .env` and `ssh -i key` use or describe a credential without printing it.
