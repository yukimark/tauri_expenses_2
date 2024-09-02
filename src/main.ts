import { createApp } from 'vue';
import App from './App.vue';
import './assets/fontawesome/css/fontawesome.css';
import './assets/fontawesome/css/brands.css';
import './assets/fontawesome/css/solid.css';
import { router } from './router';
import { createPinia } from 'pinia';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import Vue3EasyDataTable from 'vue3-easy-data-table';
import 'vue3-easy-data-table/dist/style.css';
import './assets/css/styles.css';

const pinia = createPinia();

createApp(App).component('VueDatePicker', VueDatePicker).component('EasyDataTable', Vue3EasyDataTable).use(router).use(pinia).mount('#app');
