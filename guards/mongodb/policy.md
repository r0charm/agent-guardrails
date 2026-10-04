# MongoDB Policy

Matched by method, `.name(`, so a field or key named after a verb stays silent.

## Denied

| Command | Why |
|---|---|
| `dropDatabase()`, `runCommand({dropDatabase})` | The whole database. |
| `deleteMany({})`, `remove({})` | An empty filter matches every document. |
| `mongorestore --drop`, `mongoimport --drop` | Drops each collection before loading, so a wrong file replaces good data. |

## Asked: the ones that do not read as destructive

| Command | Why |
|---|---|
| `aggregate([... $out \| $merge ...])` | A read that writes its output over a collection. |
| `renameCollection()` | With `dropTarget`, drops the collection it lands on. |

## Asked: data out, writes, access

`mongodump`, `mongoexport`; `drop`, `dropIndex(es)`, `deleteOne/Many`, `remove`, `updateOne/Many`, `insertOne/Many`, `replaceOne`, `findOneAndDelete/Replace/Update`, `findAndModify`, `bulkWrite`, `runCommand`/`adminCommand` with a writing command, `mongoimport`; user and role changes, `shutdownServer`, `fsyncLock`.

## Not guarded

`find`, `findOne`, `countDocuments`, `aggregate` without `$out` or `$merge`, `getIndexes`.

A script passed by file, `mongosh --file wipe.js`, is out of reach for a guard that reads the command alone. It is in `guards/known-leaks`.
