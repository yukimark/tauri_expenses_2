import { createApp } from "vue";
import App from "./App.vue";
import './assets/fontawesome/css/fontawesome.css';
import './assets/fontawesome/css/brands.css';
import './assets/fontawesome/css/solid.css';
import { router } from './router';
import { createPinia } from 'pinia';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

const pinia = createPinia();

createApp(App)
  .component('VueDatePicker', VueDatePicker)
  .use(router)
  .use(pinia)
  .mount("#app");
