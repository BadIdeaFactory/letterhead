import Vue from 'vue'
import App from './App.vue'
import setRandomBgColor from '@biffud/random-bg-color'

// Import Vue Markdown Editor
import VueMarkdownEditor from '@kangc/v-md-editor/lib/codemirror-editor'
import '@kangc/v-md-editor/lib/style/codemirror-editor.css'
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js'
import enUS from '@kangc/v-md-editor/lib/lang/en-US'

setRandomBgColor('body', { autoTextContrast: true, disallowTransition: true })

// Configure Vue
Vue.config.productionTip = false

// Setup Vue Markdown Editor
VueMarkdownEditor.lang.use('en-US', enUS)
VueMarkdownEditor.lang.add({
  'en-US': {
    italic: {
      toolbar: 'Underline',
      placeholder: 'Underline'
    },
  }
})
VueMarkdownEditor.use(vuepressTheme)
Vue.use(VueMarkdownEditor)

// Initialize Vue
new Vue({
  render: h => h(App),
}).$mount('#app')
