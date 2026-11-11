import { mount } from 'svelte'
import App from './App.svelte'
import setRandomBgColor from '@biffud/random-bg-color'

setRandomBgColor('body', { autoTextContrast: true, disallowTransition: true })

mount(App, { target: document.getElementById('app') })
