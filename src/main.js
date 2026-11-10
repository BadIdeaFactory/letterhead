import { createApp } from 'vue'
import App from './App.vue'
import setRandomBgColor from '@biffud/random-bg-color'

setRandomBgColor('body', { autoTextContrast: true, disallowTransition: true })

createApp(App).mount('#app')
