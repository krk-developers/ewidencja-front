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
  </div>
</template>

<script>
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
      console.log(data);

      this.$store.dispatch('userLogged');
    }
  }
}
</script>

<style scoped lang="scss">
@import "../sass/flexMixins.scss";

  .login-container{
    @include flexRow;
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

