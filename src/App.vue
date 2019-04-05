<template>
  <div id="app">
    <login-view v-if="$store.getters.checkIfLogged"></login-view>
    <main-view v-else></main-view>
  </div>
</template>

<script>
import loginView from './components/loginView.vue';
import mainView from './components/mainView.vue';

export default {
  name: 'app',
  components: {
    'login-view': loginView,
    'main-view': mainView
  }
}
</script>

<style lang="scss">
*{
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

</style>
