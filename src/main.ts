import { createApp } from "vue";
import App from "./App.vue";
import './assets/fontawesome/css/fontawesome.css';
import './assets/fontawesome/css/brands.css';
import './assets/fontawesome/css/solid.css';
import { router } from './router';
import { createPinia } from 'pinia';

const pinia = createPinia();

createApp(App)
  .use(router)
  .use(pinia)
  .mount("#app");
