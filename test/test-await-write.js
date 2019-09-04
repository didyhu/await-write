const stream = require("stream")
const assert = require("assert")
const { awaitWrite, awaitEnd } = require("./..")

describe('test-await-write', () => {
    function* data(circles = 100) {
        for (let i = 0; i < circles; i++) {
            yield Buffer.from(`${i},`)
        }
    }
    async function check(buffers, circles = 100) {
        const result = Buffer.concat(buffers).toString()
        const array = result.split(",")
        assert(array.length == circles + 1)
        array.forEach((value, index) => {
            if (value != "") {
                assert(Number.parseInt(value) == index)
            }
        })
    }
    it("normal-write", async () => {
        const buffers = []
        const consumer = new stream.Writable({
            write(chunk, encoding, callback) {
                setTimeout(() => {
                    buffers.push(chunk)
                    callback()
                }, 10)
            }
        })
        for (const buffer of data()) {
            await awaitWrite(consumer, buffer)
        }
        await awaitEnd(consumer)
        await check(buffers)

    })
    it("fast-write-and-slowly-consuming", async () => {
        const buffers = []
        const consumer = new stream.Writable({
            highWaterMark: 1,
            write(chunk, encoding, callback) {
                setTimeout(() => {
                    buffers.push(chunk)
                    callback()
                }, 10)
            }
        })
        for (const buffer of data()) {
            await awaitWrite(consumer, buffer)
        }
        await awaitEnd(consumer)
        await check(buffers)
    })
    it("error-on-write", async () => {
        const consumer = new stream.Writable({
            highWaterMark: 2,
            write(chunk, encoding, callback) {
                setTimeout(() => {
                    callback("error")
                }, 100)
            }
        })
        try {
            await awaitWrite(consumer, Buffer.from([0]))
            await awaitWrite(consumer, Buffer.from([0]))
            assert(false)
        } catch (e) {
            assert(e == "error")
        }
    })
    it("error-on-end", async () => {
        const consumer = new stream.Writable({
            highWaterMark: 2,
            write(chunk, encoding, callback) {
                setTimeout(() => {
                    callback("error")
                }, 100)
            }
        })
        try {
            await awaitWrite(consumer, Buffer.from([0]))
            await awaitEnd(consumer)
            assert(false)
        } catch (e) {
            assert(e == "error")
        }
    })
    it("not-a-writable", async () => {
        try {
            await awaitWrite({}, Buffer.from([0]))
            assert(false)
        } catch (e) {
            assert(e instanceof TypeError)
        }
        try {
            await awaitEnd({})
            assert(false)
        } catch (e) {
            assert(e instanceof TypeError)
        }
    })
})