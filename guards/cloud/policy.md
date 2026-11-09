# Cloud Policy

The AWS control plane: what provisions, exposes or destroys infrastructure. Services that hold data have guards of their own.

## Denied

| Command | Why |
|---|---|
| `ec2 terminate-instances` | Instances, and instance storage with them. |
| `cloudformation delete-stack` | Every resource the stack owns. |
| `kms schedule-key-deletion` | After the window, anything the key encrypted is unreadable. |
| `iam create-access-key`, `create-user`, `attach-*-policy`, `put-*-policy`, `delete-*` | Changes who can do what, which is how a small mistake becomes a large one. |
| `eks update-kubeconfig` | The contexts already exist, and without `--alias` it appends duplicate ARN-named entries on every run. |
| `ecr delete-repository --force` | The repository and every image in it, including whatever is deployed. |

## Asked: credentials and role changes

| Command | Why |
|---|---|
| `ecr get-login-password` | Prints a registry credential into the transcript. A `get-` that is not a safe read. |
| `sts assume-role`, `eks get-token` | What follows runs with different permissions than the session started with. |

## Asked: the rollback you did not know you were deleting

| Command | Why |
|---|---|
| `ecr batch-delete-image` | Deletes images. If one is the tag production is running, the rollback is gone, and nothing about the command says so. |
| `ecr put-lifecycle-policy` | Sets rules that delete images later, unattended. |

## Asked: provisioning and exposure

`ec2 run-instances/stop/reboot/modify-*/create-*/delete-*/authorize-*/revoke-*`, `cloudformation create-stack/update-stack/execute-change-set`, `lambda|apigateway|events|ecs|eks create-*/update-*/delete-*/put-*`.

## Not guarded

`describe-*`, `list-*` and the `get-*` calls not named above. The AWS CLI's verb convention makes this allowance cheap and reliable, which is what pays for everything else asking.
