/*
 * Copyright (c) 2018-present Steven Spungin
 * SPDX-License-Identifier: MIT
 */
import SnackbarStack from './components/SnackbarStack'

const SnackbarStackPlugin = {
  install(Vue, options) {
    const { duration = 6000 } = options || {}
    let tries = 0

    const Constructor = Vue.extend(SnackbarStack)
    let instance = new Constructor({
      propsData: {
        duration
      }
    })

    // Extend Vue components
    Vue.prototype.$snackbar = instance
    // Extend Vue
    Vue.$snackbar = instance

    function tryInstall() {
      // Install component inside of existing Vuetify application wrapper
      // Vuetify 1.x
      let container = document.querySelector('.application--wrap')
      if (!container) {
        // Vuetify 2.x
        container = document.querySelector('.v-application')
      }
      if (!container) {
        // Keep polling, but warn only once
        if (++tries === 10) {
          console.warn('Could not install snackbarstack: CSS container not found')
        }
        return false
      }
      instance.$mount()
      container.appendChild(instance.$el)
      return true
    }

    if (!tryInstall()) {
      const id = setInterval(() => {
        if (tryInstall()) {
          clearInterval(id)
        }
      }, 100)
    }
  }
}

export default SnackbarStackPlugin
