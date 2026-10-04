# NoSQL Policy

MongoDB and DynamoDB. Mongo is matched by method, `.name(`, so a field or key named after a verb stays silent; DynamoDB by the subcommand after `dynamodb`.

## Denied: the data itself

| Command | Why |
|---|---|
| `dynamodb delete-table` | The table and everything in it. |
| `dropDatabase()`, `runCommand({dropDatabase})` | The whole database. |
| `deleteMany({})`, `remove({})` | An empty filter matches every document. |
| `mongorestore --drop`, `mongoimport --drop` | Drops each collection before loading, so a wrong file replaces good data. |

## Denied: the recovery net

| Command | Why |
|---|---|
| `dynamodb delete-backup` | The backup a restore would have needed. |
| `dynamodb update-continuous-backups ... Enabled=false` | Turns off point in time recovery, so nothing before now can be restored. |

Everything asked below is survivable while a backup or point in time recovery holds the old data. These two are what remove it, which is why they are denied like `git reflog expire`.

## Asked: the ones that do not read as destructive

| Command | Why |
|---|---|
| `dynamodb put-item` | Replaces the whole item rather than merging. Attributes not in the request are dropped. |
| `dynamodb update-time-to-live` | Deletes items later, unattended, by an attribute nobody reviews again. |
| `aggregate([... $out \| $merge ...])` | A read that writes its output over a collection. |
| `renameCollection()` | With `dropTarget`, drops the collection it lands on. |

## Asked: data out

`mongodump`, `mongoexport`, `dynamodb export-table-to-point-in-time`.

## Asked: writes

Mongo: `drop`, `dropIndex(es)`, `deleteOne/Many`, `remove`, `updateOne/Many`, `insertOne/Many`, `replaceOne`, `findOneAndDelete/Replace/Update`, `findAndModify`, `bulkWrite`, `runCommand`/`adminCommand` with a writing command, `mongoimport`.

DynamoDB: `delete-item`, `batch-write-item`, `update-item`, `transact-write-items`, `update-table`, `restore-table-*`, `import-table`, `update-continuous-backups`. PartiQL through `execute-statement`, `batch-execute-statement` and `execute-transaction` asks on `DELETE FROM`, `UPDATE ... SET`, `INSERT INTO`, or statements read from a `file://` the guard cannot see; a `SELECT` stays silent.

## Asked: access and the server

Mongo user and role changes (`createUser`, `dropUser`, `dropAllUsers`, `grantRolesToUser` and the rest), `shutdownServer`, `fsyncLock`, `adminCommand({shutdown})`. DynamoDB `put-resource-policy` and `delete-resource-policy`.

## Not guarded

`find`, `findOne`, `countDocuments`, `aggregate` without `$out` or `$merge`, `getIndexes`; `dynamodb scan`, `query`, `get-item`, `describe-*`, `list-*`, and PartiQL `SELECT`.

A script passed by file, `mongosh --file wipe.js` or `mongosh wipe.js`, is out of reach for a guard that reads the command alone. It is in `guards/known-leaks`.
