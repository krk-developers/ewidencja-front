<template>
  <div id="app">
    <div v-if="$store.getters.getCurrentView === 'main-view'">
      <main-view></main-view>
    </div>
    <div v-if="$store.getters.getCurrentView === 'login-view'">
      <login-view></login-view>
    </div>
    <div v-if="$store.getters.getCurrentView === 'register-view'">
      <register-view></register-view>
    </div>
  </div>
</template>

<script>
// import {eventBus} from './main.js';
import loginView from './components/loginView.vue';
import registerView from './components/registerView.vue';

import mainView from './components/mainView.vue';

export default {
  name: 'app',
  components: {
    'login-view': loginView,
    'register-view': registerView,
    'main-view': mainView
  },
  created(){
    this.$store.commit('setVue', this);

    // const cookies = document.cookie;
    // console.log(cookies);
  }
}
</script>

<style lang="scss">
*{
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

html{
  background: rgb(84, 166, 194);
}

body{
  font-family: 'Arial'; 
}


</style>
