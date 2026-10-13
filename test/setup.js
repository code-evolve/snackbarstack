// Browser globals must exist before Vue and the bundle are loaded:
// Vue detects the browser at import time and style-loader injects into <head>.
const { afterEach } = require('node:test')
const { JSDOM } = require('jsdom')

const dom = new JSDOM('<!doctype html><html><head></head><body></body></html>')
global.window = dom.window
global.document = dom.window.document
global.navigator = dom.window.navigator
global.HTMLElement = dom.window.HTMLElement

const Vue = require('vue')
Vue.config.productionTip = false
Vue.config.devtools = false

// Minimal stand-ins for the Vuetify components the template uses.
Vue.component('v-snackbar', {
  props: [ 'value', 'timeout' ],
  render(h) {
    return h('div', { class: 'v-snack' }, this.value ? this.$slots.default : [])
  }
})
Vue.component('v-progress-linear', {
  props: [ 'value' ],
  render(h) {
    return h('div', { class: 'v-progress-linear' })
  }
})
Vue.component('v-btn', {
  render(h) {
    return h('button', { on: { click: e => this.$emit('click', e) } }, this.$slots.default)
  }
})
Vue.component('v-icon', {
  render(h) {
    return h('i', this.$slots.default)
  }
})

const { default: SnackbarStackPlugin } = require('../dist/index.node.js')

// Install into a fresh Vuetify-shaped container; the mount is synchronous.
function install(options) {
  document.body.innerHTML = '<div class="v-application"></div>'
  SnackbarStackPlugin.install(Vue, options)
  return Vue.$snackbar
}

// An open message keeps its progress interval running; close it so the
// test process can exit.
afterEach(() => {
  if (Vue.$snackbar) {
    Vue.$snackbar.queue.length = 0
    Vue.$snackbar.close()
  }
})

module.exports = { Vue, SnackbarStackPlugin, install }
