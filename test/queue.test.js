const { test } = require('node:test')
const assert = require('node:assert/strict')
const { Vue, install } = require('./setup')

test('shows the first message and applies defaults', async () => {
  const stack = install({ duration: 1234 })
  stack.show('hello')
  await Vue.nextTick()

  assert.equal(stack.isOpen, true)
  assert.equal(stack.message, 'hello')
  assert.equal(stack.messageOptions.duration, 1234)
  assert.equal(stack.messageOptions.closeable, true)
  assert.match(stack.$el.textContent, /hello/)
  assert.match(stack.$el.textContent, /Close/)
})

test('queues messages while one is open and advances on close', async () => {
  const stack = install()
  stack.show('first')
  stack.show('second')
  await Vue.nextTick()

  assert.equal(stack.queue.length, 1)
  assert.match(stack.$el.textContent, /Next/)
  assert.match(stack.$el.textContent, /\(1 more\)/)

  stack.close()
  await Vue.nextTick()
  await Vue.nextTick()
  assert.equal(stack.message, 'second')
  assert.equal(stack.queue.length, 0)
})

test('flushAll discards queued messages', async () => {
  const stack = install()
  stack.show('first')
  stack.show('queued 1')
  stack.show('queued 2')
  stack.show('urgent', { flushAll: true })
  await Vue.nextTick()
  await Vue.nextTick()

  assert.equal(stack.message, 'urgent')
  assert.equal(stack.queue.length, 0)
})

test('flushGroup discards only queued messages of the same group', async () => {
  const stack = install()
  stack.show('first')
  stack.show('saving', { group: 'save' })
  stack.show('other', { group: 'misc' })
  stack.show('saved', { group: 'save', flushGroup: true })

  assert.deepEqual(stack.queue.map(it => it.message), [ 'other', 'saved' ])
})

test('flushOtherGroups keeps only queued messages of the same group', async () => {
  const stack = install()
  stack.show('first')
  stack.show('saving', { group: 'save' })
  stack.show('other', { group: 'misc' })
  stack.show('saved', { group: 'save', flushOtherGroups: true })

  assert.deepEqual(stack.queue.map(it => it.message), [ 'saving', 'saved' ])
})

test('hides the close button when closeable is false', async () => {
  const stack = install()
  stack.show('sticky', { closeable: false, duration: -1 })
  await Vue.nextTick()

  assert.doesNotMatch(stack.$el.textContent, /Close/)
})

test('passes a close api and the options to action handlers', async () => {
  const stack = install()
  let received
  const options = {
    actions: {
      caption: 'Undo',
      handler(api, opts) {
        received = opts
        api.close()
      }
    }
  }
  stack.show('deleted', options)
  await Vue.nextTick()

  const button = [ ...stack.$el.querySelectorAll('button') ].find(b => /Undo/.test(b.textContent))
  assert.ok(button, 'the action button should render')
  button.click()

  assert.equal(received, options)
  assert.equal(stack.isOpen, false)
})

test('converts object messages to strings and tolerates null', async () => {
  const stack = install()
  stack.show({ toString: () => 'from object' })
  await Vue.nextTick()
  assert.equal(stack.message, 'from object')

  stack.close()
  await Vue.nextTick()
  assert.doesNotThrow(() => stack.show(null))
})
