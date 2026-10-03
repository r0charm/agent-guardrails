# Kubernetes Policy

Names no cluster and detects no environment. See the reasoning in `../setup.md`.

## Denied

| Command | Why |
|---|---|
| `delete namespace` / `delete ns` | Takes every workload, secret and volume in it. |
| `delete pvc`, `delete pv` | Deletes storage, and the data on it. |
| `delete crd` | Deletes every custom resource of that kind, cluster-wide. |
| `delete --all` | A bulk delete whose blast radius is not visible in the command. |
| `delete --force --grace-period=0` | Skips graceful termination, so in-flight work is lost. |

## Asked: capability grants

The tier most lists miss. These change nothing themselves. They hand over the means to change things, somewhere no later kubectl command records it.

| Command | Why |
|---|---|
| `exec`, `attach` | A shell inside the pod. Nothing that follows is visible to the guard. |
| `port-forward` | A tunnel past the ingress and past any auth in front of the service. `port-forward svc/postgres 5432` followed by `psql -h localhost` is a full production database session, and not one kubectl command in it is destructive. |
| `proxy` | Exposes the API server locally. |
| `cp` | Writes files into a running pod. |
| `debug` | Attaches a debug container with elevated access. |

## Asked: reads that yield secrets

`kubectl get secret -o yaml` is syntactically identical to `kubectl get pods` and prints credentials into a transcript that keeps them. Carved out of the read allowance for that reason.

## Asked: state changes

`apply`, `create`, `delete`, `patch`, `replace`, `edit`, `scale`, `annotate`, `label`, `taint`, `drain`, `cordon`, `uncordon`, `rollout *`, `set image/env/resources`, `helm install/upgrade/rollback/uninstall`.

`config use-context` is here too. It changes nothing by itself, and it redirects every later bare command in the session to another cluster without naming it.

## Not guarded

`get`, `describe`, `logs`, `top`, `events`, `explain`, `diff`, `auth can-i`, `config view`, `config current-context`. Reads are where the noise would be, and a silent read path is what keeps the asks credible.
