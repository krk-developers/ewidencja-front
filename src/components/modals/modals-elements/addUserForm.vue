<template>
  <form @submit.prevent="addUser" class="add-user--form">
    <div>
      <label for="user-firstname">imię <input id="user-firstname" type="text" v-model="userFirstname" required></label>
      <label for="user-lastname">nazwisko <input id="user-lastname" type="text" v-model="userLastname" required></label>
      <label for="user-pesel">pesel <input id="user-pesel" type="text" v-model="userPesel" required></label>
      <label for="user-email">email <input id="user-email" type="email" v-model="userEmail" required></label>
    </div>
    <button type="submit">Dodaj</button>
  </form>
</template>

<script>
export default {
  props: ['userType'],
  data(){
    return{
      userFirstname: '',
      userLastname: '',
      userPesel: '',
      userEmail: ''
    }
  },
  methods: {
    addUser(){
      const newUser = {
        firstname: this.userFirstname,
        lastname: this.userLastname,
        pesel: this.userPesel,
        email: this.userEmail
      };

      console.log(this.userType, newUser);

      // fetchSuperadmins
    }
  }
}
</script>

<style lang="scss">
@import "../../../sass/flexMixins.scss";
@import "../../../sass/elements.scss";

.add-user--form{
  @include flexColumn;

  div{
    @include flexColumn(center, flex-end);
    padding-right: 40px;

    label{
      margin-bottom: 5px;

      input{
        @include inputWhite;
      }
    }
  }

  button{
    @include buttonWhite;
    padding: 5px 10px;
  }
}
</style>
