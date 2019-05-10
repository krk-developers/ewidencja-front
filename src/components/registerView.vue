<template>
  <div class="register-container">
    <form @submit.prevent="doRegister">
      <label for="register-userType">Pracownik</label>
      <select class="mb" id="register-userType" v-model="userType" required>
        <option v-for="t in userTypes" :key="t.id" :value="t.id">{{t.display_name}}</option>
      </select>
      <label for="register-email">email</label>
      <input id="register-email" type="email" v-model="email">
      <label for="register-pass">hasło</label>
      <input id="register-pass" type="password" v-model="pass">
      <button type="submit">Zarejestruj</button>
    </form>
  </div>
</template>

<script>
import {eventBus} from '../main.js';

export default {
  data(){
    return {
      userTypes: [],
      userType:'',
      email: '',
      pass: ''
    }
  },
  methods: {
    doRegister(){
      const data = {
        email: this.email,
        password: this.pass
      };
      // console.log(data);

      // this.$store.commit('setCurrentView', 'main-view');
      this.$store.commit('setCurrentView', 'main-view');
    }
  },
  created(){
    this.$store.dispatch('fetchUserTypes');

    eventBus.$on('getUserTypes', () => {
      this.userTypes = this.$store.getters.getUserTypes;
    });
  }
}
</script>

<style scoped lang="scss">
@import "../sass/flexMixins.scss";

  .register-container{
    @include flexColumn;
    width: 100vw;
    height: 100vh;
    background: gray;

    form{
      width: 200px;
      height: 200px;
      display: flex;
      flex-direction: column;

      label{
        text-align: center;
      }

      input{
        margin-bottom: 20px;
        text-align: center;
      }

      button{
        padding: 10px 20px;
      }

      p{
        text-align: center;
        margin-top: 10px;
      }
    }
  }

</style>

