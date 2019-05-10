import Vue from 'vue'
import App from './App.vue'
import VueResource from 'vue-resource';
import {store} from './store/store.js';
// import CryptoJS from 'crypto-js';

Vue.config.productionTip = false

Vue.use(VueResource);

// const allCookies = document.cookie;
// const rectokIndex = allCookies.indexOf('rectok=');
// const rectokEnd = allCookies.indexOf(';', rectokIndex);
// const token = allCookies.slice(rectokIndex+7, rectokEnd);
// // const token = allCookies.slice(rectokIndex+16, rectokEnd);
// console.log(allCookies);

// var myPassword = "myPassword";

// console.log('rectok', token);
// var decrypted = CryptoJS.AES.decrypt(token, myPassword);
// // console.log('odszyfrowany rectok', decrypted.toString(CryptoJS.enc.Utf8));

// // const token = 'NNoP59DgZR4XgaMwRAFuLnLvfodn3ZE0f2cIdHyZ9J3xN36woPwAbNOFXDes';

// var myString   = "NNoP59DgZR4XgaMwRAFuLnLvfodn3ZE0f2cIdHyZ9J3xN36woPwAbNOFXDes";

// var myencrypted = CryptoJS.AES.encrypt(myString, myPassword);
// var mydecrypted = CryptoJS.AES.decrypt(myencrypted, myPassword);
// console.log('mój szyfrowany token', myencrypted.toString());
// console.log('mój token', mydecrypted.toString(CryptoJS.enc.Utf8));



Vue.http.options.root = 'https://ewidencja.vipserv.org/backend/public/api/';
// Vue.http.headers.common['Authorization'] = 'Bearer ' + myencrypted.toString();

export const eventBus = new Vue();

new Vue({
  render: h => h(App),
  store
}).$mount('#app')
