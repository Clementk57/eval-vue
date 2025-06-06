import { createApp } from 'vue'
import { createPinia }  from 'pinia'
import App from './App.vue'
import router from './router'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

import BButton from '@/components/BButton.vue'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.component('BButton', BButton)

app.mount('#app')
