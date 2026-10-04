# Infrastructure as Code Policy

Terraform, OpenTofu and Terragrunt. The three share verbs, so one list covers them, and the plan is where the work is reviewed: everything that only plans or reads stays silent.

## Asked

| Command | Why |
|---|---|
| `apply`, `destroy`, `apply -destroy` | Changes or destroys the infrastructure the configuration manages. |
| `import`, `state rm`, `state mv`, `state push`, `state replace-provider` | Rewrites state, which can detach real resources from the plan that manages them, worse than destroying them openly. |
| `force-unlock` | Releases a lock another run may still hold, so two runs can write the state at once. |
| `workspace delete` | Deletes a workspace and its state, orphaning whatever it managed. |

Terragrunt is matched with its own words between binary and verb: `terragrunt run-all apply` and `terragrunt run --all -- apply` ask like `terraform apply`.

## Not guarded

`plan`, `output`, `fmt`, `validate`, `init`, and the reads of `state` and `workspace` (`list`, `show`, `pull`). Planning is where the change is reviewed, so asking there would teach the click-through.
