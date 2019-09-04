const stream = require("stream")

"use strict"

/**
 *
 * @param {stream.Writable} writable
 * @param {Buffer} buffer
 * @returns {Promise}
 */
function awaitWrite(writable, buffer) {
    return new Promise((resolve, reject) => {
        const onError = (e) => {
            writable.removeListener("drain", onDrain)
            writable.removeListener("error", onError)
            process.nextTick(() => reject(e))
        }
        const onDrain = () => {
            writable.removeListener("drain", onDrain)
            writable.removeListener("error", onError)
            process.nextTick(resolve)
        }
        try {
            writable.once("error", onError)
            const drain = writable.write(buffer)
            if (drain) {
                onDrain()
            } else {
                writable.once("drain", onDrain)
            }
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = awaitWrite