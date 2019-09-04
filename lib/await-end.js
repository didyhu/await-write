const stream = require("stream")

"use strict"

/**
 *
 * @param {stream.Writable} writable
 * @returns {Promise}
 */
function awaitEnd(writable) {
    return new Promise((resolve, reject) => {
        try {
            const onFinish = () => {
                writable.removeListener("finish", onFinish)
                writable.removeListener("error", onError)
                process.nextTick(resolve)
            }
            const onError = (e) => {
                writable.removeListener("finish", onFinish)
                writable.removeListener("error", onError)
                process.nextTick(() => reject(e))
            }
            writable.once("finish", onFinish)
            writable.once("error", onError)
            writable.end()
        } catch (e) {
            process.nextTick(() => reject(e))
        }
    })
}

module.exports = awaitEnd