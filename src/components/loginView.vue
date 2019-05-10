<template>
  <div class="login-container">
    <form @submit.prevent="logIn">
      <label for="login-email">email</label>
      <input id="login-email" type="email" v-model="email">
      <label for="login-pass">hasło</label>
      <input id="login-pass" type="password" v-model="pass">
      <button type="submit">Zaloguj</button>
      <p>kliknij "Zaloguj"</p>
    </form>
    <br>
    <button class="goToRegister-button" @click="goToRegister">Rejestracja</button>
  </div>
</template>

<script>
import {eventBus} from '../main.js';

export default {
  data(){
    return {
      email: '',
      pass: ''
    }
  },
  methods: {
    logIn(){
      const data = {
        email: this.email,
        password: this.pass
      };
      // console.log(data);

      this.$store.commit('setCurrentView', 'main-view');
    },
    goToRegister(){
      this.$store.commit('setCurrentView', 'register-view');
    }
  }
}
</script>

<style scoped lang="scss">
@import "../sass/flexMixins.scss";

.login-container{
  @include flexColumn;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(lightblue, rgb(84, 166, 194));

  form{
    width: 200px;
    height: 200px;
    display: flex;
    flex-direction: column;

    label{
      text-align: center;
    }

    input{
      height: 24px;
      margin-bottom: 20px;
      text-align: center;
      border-radius: 5px;
      border: 2px solid black;

      &:focus{
        border: 2px solid orange;
      }
    }

    button{
      padding: 5px 20px;
      border-radius: 5px;
      border: 2px solid black;
      background: #fff;
      font-size: 24px;
      cursor: pointer;
      transition: all .2s linear;

      &:focus{
        border: 2px solid orange;
      }
      &:hover{
        background: rgb(236, 236, 236);
      }
    }

    p{
      text-align: center;
      margin-top: 10px;
    }
  }

  .goToRegister-button{
    padding: 5px 20px;
    border-radius: 5px;
    border: 2px solid black;
    background: #fff;
    font-size: 16px;
    cursor: pointer;
    transition: all .2s linear;

    &:focus{
      border: 2px solid orange;
    }
    &:hover{
      background: rgb(236, 236, 236);
    }
  }
}

</style>

