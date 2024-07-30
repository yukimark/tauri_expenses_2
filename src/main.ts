import { createApp } from "vue";
import App from "./App.vue";
import './assets/fontawesome/css/fontawesome.css';
import './assets/fontawesome/css/brands.css';
import './assets/fontawesome/css/solid.css';
import { router } from './router';

createApp(App)
  .use(router)
  .mount("#app");
