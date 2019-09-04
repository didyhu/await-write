# await-write

Await node writable's `write()` and `end()` methods as promises.

## awaitWrite

```awaitWrite(writeable,buffer)```

* writeable `{stream.Writable}`
* buffer `{Buffer}`

The function returns when the `writable` object is drain.

## awaitEnd

```awaitEnd(writeable)```

* writeable `{stream.Writable}`

The function returns when the `writable` object is finished.

## Example

```javascript
const { awaitWrite, awaitEnd } = require("await-write")

// ...

try{
    await awaitWrite(writable,Buffer.from("hello "))
    await awaitWrite(writable,Buffer.from("world!"))
    await awaitEnd(writeable)
}catch(e){
    // handle error
}
```
