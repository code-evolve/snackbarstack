const { test } = require('node:test')
const assert = require('node:assert/strict')
const { install } = require('./setup')

test('writes outlet messages into the outlet and clears them after their duration', t => {
  t.mock.timers.enable({ apis: [ 'setTimeout' ] })
  const stack = install()
  document.body.insertAdjacentHTML('beforeend', '<div id="status"></div>')
  const outlet = document.querySelector('#status')

  stack.show('one', { outlet: '#status', duration: 500 })
  stack.show('two', { outlet: '#status', duration: 500 })
  assert.equal(outlet.innerHTML, 'one')

  t.mock.timers.tick(500)
  assert.equal(outlet.innerHTML, 'two')

  t.mock.timers.tick(500)
  assert.equal(outlet.innerHTML, '')
})

test('logs outlet messages when the outlet is missing', t => {
  const info = t.mock.method(console, 'info', () => {})
  const stack = install()

  stack.show('nowhere', { outlet: '#missing' })
  assert.equal(info.mock.calls[0].arguments[0], 'nowhere')
})
