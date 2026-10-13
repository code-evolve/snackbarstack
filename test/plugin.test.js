const { test } = require('node:test')
const assert = require('node:assert/strict')
const { Vue, SnackbarStackPlugin, install } = require('./setup')

test('exposes the stack on Vue and on every component', () => {
  const stack = install()
  assert.equal(Vue.prototype.$snackbar, stack)
  assert.ok(stack, 'Vue.$snackbar should be set by install')
})

test('mounts inside the Vuetify 2 application element', () => {
  const stack = install()
  const container = document.querySelector('.v-application')
  assert.equal(stack.$el.parentNode, container)
})

test('mounts inside the Vuetify 1 application wrapper', () => {
  document.body.innerHTML = '<div class="application--wrap"></div>'
  SnackbarStackPlugin.install(Vue)
  assert.equal(Vue.$snackbar.$el.parentNode, document.querySelector('.application--wrap'))
})

test('waits for the container and warns once if it never appears', t => {
  t.mock.timers.enable({ apis: [ 'setInterval' ] })
  const warn = t.mock.method(console, 'warn', () => {})
  document.body.innerHTML = ''

  SnackbarStackPlugin.install(Vue)
  t.mock.timers.tick(100 * 30)
  assert.equal(warn.mock.callCount(), 1)

  document.body.innerHTML = '<div class="v-application"></div>'
  t.mock.timers.tick(100)
  assert.equal(Vue.$snackbar.$el.parentNode, document.querySelector('.v-application'))
})

test('injects the component styles into the document', () => {
  const css = [ ...document.head.querySelectorAll('style') ].map(s => s.textContent).join('\n')
  assert.match(css, /snack_with_progress/)
})
