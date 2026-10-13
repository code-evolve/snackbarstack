# 2.0.0
- Require Vuetify 2.3 or later; Vuetify 1 is supported by 1.x
- License under MIT
- Fix component CSS never being applied when loaded through the package entry point
- Fix queued messages getting stuck when a flush follows a show in the same tick
- Fix action buttons using the Vuetify 1 `flat` prop
- Fix show(null) throwing
- Warn once, instead of repeatedly, when no Vuetify application element is found
- Update the demo to Vuetify 2
- Build with webpack 5 and add tests
# 1.0.19
- Add vuetify and vue to peer dependencies
- Add support for Vuetify 2.0 (still needs CSS tweaks)
- Update dependency versions
- Refactor package.json
- Log warning if unable to install
- Update documentation
# 1.0.18
- Add option to flush message queue and/or replace other messages
- Add group option
- Update demo
- Update documentation
# 1.0.17
- Use default object for options
# 1.0.16
- Update readme
- Add outlet option
- Update demo
# 1.0.15
- Convert messages that are objects to strings
# 1.0.14
- Allow calling Vue.$snackbar before the plugin is added to the DOM
# 1.0.13
- Add $snackbar to the Vue instance
# 1.0.12
- Update documentation
# 1.0.11
# 1.0.10
- Add support for x-template content
# 1.0.9
- Remove restriction that plugin must be loaded after creating Vue instance
# 1.0.8
- Update documentation
- Supply snackbarstack interface to action callback
- Add closeable parameter
# 1.0.7
- Update documentation
- Use explicit keys
- Put outlet directly under application--wrap to support standard Vuetify app layouts
# 1.0.6
- Update documentation
- Add actions option
# 1.0.5
- Update documentation
- Add duration option for show()
- Allow duration of -1 to keep open
- Update demo
# 1.0.4
- Add Vuetify prefix to CSS
# 1.0.3
- Fix issue when no options are provided
- Fix CSS Issues
- Update documentation
# 1.0.2
- Use production build
# 1.0.1
- Update documentation
# 1.0.0
- Initial Release
