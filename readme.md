# Overview
The SnackbarStack plugin for Vue and Vuetify adds features
on top of the existing Vuetify snackbar

# Features
* Queues pending snackbar messages
* Adds a $snackbar object to every component
* Shows a progress bar until the message times out
* Shows an indicator if additional messages are queued
* Provides a next/close button
* Support for multiple message outlets
* Message queue flushing

Source and issues: [github.com/code-evolve/snackbarstack](https://github.com/code-evolve/snackbarstack)

# Requirements
* Vue 2.6 or later 2.x
* Vuetify 2.3 or later 2.x

Version 1.x of this package supports Vuetify 1

# Install
```sh
npm install snackbarstack
```

# Demo
[View Demo On Codepen](https://codepen.io/Flamenco/full/ZoRvLw/)
# Usage
```js
import SnackbarStackPlugin from 'snackbarstack'
Vue.use(SnackbarStackPlugin)
// Or change defaults
// Vue.use(SnackbarStackPlugin, {duration:4000})

new Vue({
  el:'#app'
})

```

Show snackbars using this.$snackbar.show('the message')
```javascript
onButtonPress() {
    this.$snackbar.show("You pressed the button")
    this.$snackbar.show("This message was queued")
}
```

You can also call $snackbar on the Vue instance.  This is
helpful when posting a message from outside of a component.
```javascript
Vue.$snackbar.show("You pressed the button")

```

Or use options
```vue
onButtonPress() {
    this.$snackbar.show("Press the button to continue.", {
        duration: -1,
        closeable: false,
        actions: [{
            caption:'Close Me',
            handler(snackbar, options){
                snackbar.close()
            }
        }]
    })
}
```

This example hides the default close button, and adds a custom action
that does the closing

# Notable changes
* Message queues can be flushed
* Message groups (used for removing messages of a certain type)

# API

## Plugin options
### duration
type: number [optional]\
default: 6000

The duration of each snackbar message in milliseconds.
This is used for messages that do not specify their own duration.

## show(message, options)
Shows or queues a snackbar message

The message is rendered as HTML, both in the snackbar and in outlets.
Escape any text that comes from users or other untrusted sources
before passing it to `show()`.
### options.duration
type: number [optional] \
default: undefined

The duration of the snackbar message in milliseconds.
-1 to show until user presses _Close_.
If not set, the plugin's duration setting is used.

### options.closeable
type: boolean [optional]\
default: true  

Determines if a close button appears with the snackbar message

### options.template
type: boolean [optional]\
default: false

If this is set, the message will be interpreted as an x-template.
(x-template names must start with '#')

```html
<script type="text/x-template" id="my-x-template">
  <div>
    <h2 style="display: inline-block">Hello</h2>
    <h3 style="display: inline-block">X-Template</h3>
  </div>
</script>
```
```javascript
this.$snackbar.show('#my-x-template', {template:true})
```

### options.actions
type: object [optional]\
default: undefined

Actions to be added to the snackbar message.
Can be an object or an array of objects.
```js
var action = {
    caption: '',
    icon: '',
    handler: function(api, options){}
}
```
The handler api object has 1 function, close(), to close the snackbar.
The options object is the object passed in to the show() call.

### options.outlet
type: string [optional]\
default: undefined

The selector for the outlet to display the message

If undefined, the default snackbar is used

If found, the innerHTML will be set.
If the outlet element is not found, the message will be sent to the console as an info message.

The only option currently implemented when specifying outlets is _duration_

### options.flushAll
type: boolean [optional]\
default: false

Remove all other messages before displaying the message

### options.flushGroup
type: boolean [optional]\
default: false

Remove all other messages of the same group before displaying the message

### options.flushOtherGroups
type: boolean [optional]\
default: false

Remove all other messages not matching the message group before displaying the message

### options.group
type: string [optional]\
default: undefined

The message id or group


# Tasks
- [ ] Custom size, color, font for message
- [X] Allow x-template content
- [X] Custom duration per message
- [X] Custom actions
- [X] Option to not timeout
- [X] Options for show()
- [X] Online demo

# Tasks (outlets)
- [ ] HTML flag
- [ ] Transitions
- [X] Replace messages
- [X] Flush queue
- [X] Groups
- [X] Flush groups
- [ ] Show pending message indicator in outlet
- [ ] Message group styling

# Development
```sh
npm install
npm run build   # writes dist/index.node.js (package entry) and dist/index.js (script tag)
npm test        # builds, then runs the tests
```

Open `demo/index.html` in a browser after building to try the plugin

# License
MIT. Versions before 2.0.0 were published under the ISC license.
