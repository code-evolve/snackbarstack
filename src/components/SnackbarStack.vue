<template>
  <v-snackbar ref="snackbar" :timeout="messageDuration" v-model="isOpen" class="snack_with_progress" absolute>
    <div class="content">
      <v-progress-linear v-show="messageOptions.duration !== -1" v-model="value" :height="3" class="mb-2"/>
      <div>
        <component v-if="component" :is="component"></component>
        <span v-else v-html="message"></span>

        <v-btn v-if="messageOptions.closeable" class="btn" text dark @click="isOpen=false">{{buttonCaption}}
          <span v-if="queue.length > 0" style="white-space: pre"> ({{queue.length}} more)</span>
        </v-btn>
        <span v-else-if="queue.length > 0">({{queue.length}} more)</span>
        <v-btn v-for="(action,index) in actions" :key="index" class="btn" text dark @click="()=>onActionClick(action)">
          {{action.caption}}
          <v-icon v-if="action.icon">{{action.icon}}</v-icon>
        </v-btn>
      </div>
    </div>
  </v-snackbar>
</template>

<script>
  import Vue from 'vue'

  export default {
    name: 'SnackbarStack',
    data: function () {
      return {
        isOpen: false,
        message: '',
        messageOptions: {},
        messageDuration: -1,
        value: 0,
        pollFreq: 50,
        queue: [],
        advancing: false,
        component: undefined,

        // A outlet selector to list:Context
        outlets: {}
      }
    },
    props: {
      duration: {
        type: Number,
        default: 6000
      },
    },
    methods: {
      startOutletTimer: function (list, options) {
        if (options.flushAll) {
          while (list.length > 1) {
            list.shift()
          }
          if (list.$thread) {
            clearInterval(list.$thread)
            list.$thread = undefined
          }
        } else if (options.flushGroup) {
          let i = list.length - 1 // start at second to last item
          while (i--) {
            if (options.group === list[i].options.group) {
              list.splice(i, 1)
            }
          }
          if (list.length === 1) {
            if (list.$thread) {
              clearInterval(list.$thread)
              list.$thread = undefined
            }
          }
        } else if (options.flushOtherGroups) {
          let i = list.length - 1 // start at second to last item
          while (i--) {
            if (options.group !== list[i].options.group) {
              list.splice(i, 1)
            }
          }
          if (list.length === 1) {
            if (list.$thread) {
              clearInterval(list.$thread)
              list.$thread = undefined
            }
          }
        }

        if (list.length > 1) {
          return
        }

        let current = list[0]

        const showMessage = (context) => {
          current.ele = document.querySelector(context.options.outlet)
          if (context.ele) {
            current.ele.innerHTML = context.message
          } else {
            console.info(context.message)
          }
        }

        const timeoutHandler = () => {
          list.shift()
          if (list.length === 0) {
            if (current.ele) {
              current.ele.innerHTML = ''
            }
          } else {
            current = list[0]
            list.$thread = setTimeout(timeoutHandler, current.options.duration || 4000)
            showMessage(current)
          }
        }
        list.$thread = setTimeout(timeoutHandler, current.options.duration || 4000)
        showMessage(current)

      },
      /*
        options.duration
        options.closeable
        options.outlet

        options.flushAll
        options.group
        options.flushGroup
        options.flushOtherGroups
      */
      show(message, options = {}) {
        if (options.outlet) {
          let list = this.outlets[options.outlet]
          if (!list) {
            list = []
            this.outlets[options.outlet] = list
          }
          list.push({
            message,
            options,
            running: false
          })
          this.startOutletTimer(list, options)
        } else {
          options.duration = options.duration || this.duration
          options.closeable = typeof options.closeable === 'boolean' ? options.closeable : true

          if (this.isOpen) {
            if (options.flushAll) {
              this.queue.length = 0
              this.queue.push({
                message,
                options
              })
              this.close()
            } else if (options.flushGroup) {
              let i = this.queue.length
              while (i--) {
                if (options.group === this.queue[i].options.group) {
                  this.queue.splice(i, 1)
                }
              }
              this.queue.push({
                message,
                options
              })
              if (this.queue.length === 1) {
                if (this.messageOptions) {
                  if (options.group === this.messageOptions.group) {
                    this.close()
                  }
                } else {
                  this.close()
                }
              }
            } else if (options.flushOtherGroups) {
              let i = this.queue.length
              while (i--) {
                if (options.group !== this.queue[i].options.group) {
                  this.queue.splice(i, 1)
                }
              }
              this.queue.push({
                message,
                options
              })
              if (this.queue.length === 1) {
                if (this.messageOptions) {
                  if (options.group !== this.messageOptions.group) {
                    this.close()
                  }
                } else {
                  this.close()
                }
              }
            } else {
              this.queue.push({
                message,
                options
              })
            }
          } else {
            this._show(message, options)
          }
        }
      },
      _show(message, options) {
        if (message !== null && typeof message === 'object' && message.toString) {
          message = message.toString()
        }
        this.message = message
        this.messageOptions = options

        this.value = 0

        clearInterval(this.reg)
        if (options.duration !== -1) {
          let stamp = new Date()
          this.reg = setInterval(() => {
            this.value = (new Date() - stamp) * 100 / (this.messageDuration * .93)
          }, this.pollFreq)

        }

        if (options.template) {
          let component
          if (message.startsWith('#')) {
            component = Vue.component('snackbar-template-component', {
              template: message
            })
          } else {
            component = undefined
          }
          this.component = component
        } else {
          this.component = undefined
        }
        this.messageDuration = options.duration === -1 ? 99999999 : options.duration
        this.isOpen = true
      },
      onActionClick(action) {
        const that = this
        const api = {
          close() {
            that.close()
          }
        }
        action.handler(api, this.messageOptions)
      },
      /**
       * Close the current snackbar
       */
      close() {
        this.isOpen = false
        this.advance()
      },
      /**
       * Show the next queued message once the current one has closed.
       * Called from both close() and the isOpen watcher, because the watcher
       * does not fire when a message opens and closes within one tick.
       */
      advance() {
        clearInterval(this.reg)
        if (this.advancing || this.queue.length === 0) {
          return
        }
        this.advancing = true
        // Wait a tick so v-snackbar sees the close and restarts its timeout
        this.$nextTick(() => {
          this.advancing = false
          if (!this.isOpen && this.queue.length > 0) {
            const info = this.queue.shift()
            this._show(info.message, info.options)
          }
        })
      }
    },
    computed: {
      buttonCaption() {
        if (this.queue.length > 0) {
          return 'Next'
        } else {
          return 'Close'
        }
      },
      actions: function () {
        let ret = this.messageOptions.actions || []
        if (!Array.isArray(ret)) {
          ret = [ ret ]
        }

        return ret
      }
    },
    watch: {
      isOpen: function (value) {
        if (!value) {
          this.advance()
        }
      }
    }
  }
</script>

<style scoped>
  .content {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }

  .btn {
    float: right;
  }
</style>

<style>
  /* ensure this is in front of dialogs  */
  .v-snack--absolute.snack_with_progress {
    z-index: 999;
  }
  /* The default snackbar height is 48px.  Add the progress bar height */
  .snack_with_progress .snack__content,
  .snack_with_progress .v-snack__content {
    height: 100px;
  }
</style>
