import test from 'ava'
import utils from '../../src/modules/utils'
import FP from '../../'

test('flatten', t => {
  t.deepEqual(utils.flatten([[1], [2, 3]]), [1, 2, 3])
})

test('isPromiseLike', t => {
  console.log('utils', utils.isPromiseLike({then: () => null}))
  t.truthy(utils.isPromiseLike({then: () => null}) === true)
  t.truthy(utils.isPromiseLike(Promise.resolve()) === true)
})

test('flatten', t => {
  t.truthy(utils.isFunction(() => null))
})
