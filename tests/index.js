const path = require('path')
const test = require('ava')
const FP = require('../src')

test('FP.resolve(true)', t => {
  return FP.resolve(true)
    .then(x => t.truthy(x))
})

test('FP.resolve(false)', t => {
  return FP.resolve(false)
    .then(x => t.falsy(x))
})

test('FP.all(Object)', t => {
  return FP.all({
    one: Promise.resolve(1),
    two: Promise.resolve(2)
  })
  .then(results => t.deepEqual(results, {one: 1, two: 2}))
})

test('FP.all(Array)', t => {
  return FP.all([
    Promise.resolve(1),
    Promise.resolve(2)
  ])
  .then(results => t.deepEqual(results, [1, 2]))
})

test('FP.promisify(fn)', t => {
  const readFile = FP.promisify(require('fs').readFile);
  // now `readFile` will return a promise rather than a cb
  return readFile(path.resolve(__dirname, '../package.json'), 'utf8')
    .then(data => {
      data = typeof data === 'string' ? JSON.parse(data) : data
      t.truthy(data.name)
      t.truthy(data.version)
      t.truthy(data.license === 'MIT')
    })
})

test('FP.promisifyAll(obj)', t => {
  const fs = FP.promisifyAll(require('fs'));
  // now `readFile` will return a promise rather than a cb
  return fs.readFileAsync(path.resolve(__dirname, '../package.json'), 'utf8')
    .then(data => {
      data = typeof data === 'string' ? JSON.parse(data) : data
      t.truthy(data.name)
      t.truthy(data.version)
      t.truthy(data.license === 'MIT')
    })
})

test('FP.unpack() resolve', t => {
  const asyncFunc = () => {
    const { promise, resolve } = FP.unpack()
    Promise.resolve(true)
      .then(x => resolve(x))
    return promise
  }
  return asyncFunc()
    .then(x => t.truthy(x))
    .catch(err => t.fail(err))
})

test('FP.unpack() reject', t => {
  const asyncFunc = () => {
    const { promise, reject } = FP.unpack()
    Promise.resolve('Error!')
      .then(x => reject(x))
    return promise
  }
  return asyncFunc()
    .then(err => t.fail(err))
    .catch(err => t.truthy(err))
})
