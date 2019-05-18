<template>
  <div>
    <form @submit.prevent="addUser" class="add-user--form">
      <div>
        <label for="user-firstname">imię <input id="user-firstname" type="text" v-model="userFirstname" required></label>
        <label for="user-lastname">nazwisko <input id="user-lastname" type="text" v-model="userLastname" required></label>
        <label for="user-pesel">PESEL <input id="user-pesel" type="number"  v-model="userPesel" required></label>
        <label for="user-email">email <input id="user-email" type="email" v-model="userEmail" required></label>
      </div>
      <button type="submit">Dodaj</button>
    </form>
    <div v-if="actionShow" class="action-info">
      <h4>{{actionInfo}}</h4>
    </div>
  </div>
</template>

<script>
import {eventBus} from '../../../main.js';
import { setTimeout } from 'timers';

export default {
  props: ['userType'],
  data(){
    return{
      userFirstname: '',
      userLastname: '',
      userPesel: '',
      userEmail: '',
      actionShow: false,
      actionInfo: '',
      userToAdd: {}
    }
  },
  methods: {
    addUser(){
      const newUser = {
        name: this.userFirstname,
        lastname: this.userLastname,
        pesel: this.userPesel,
        email: this.userEmail
      };

      this.userToAdd = {
        lastname: this.userLastname,
        pesel: this.userPesel,
        user: {
          name: this.userFirstname,
          email: this.userEmail
        }
      }

      newUser.password = "12345678";
      newUser.password_confirmation = "12345678";

      // console.log(this.userType, newUser);

      this.$store.dispatch('sendUser', {userType: this.userType, userData: newUser});
      // this.$store.dispatch('toggleModal', false);
    }
  },
  created(){
    eventBus.$on('workerAdd', (data) => {
      if(data){
        this.actionInfo = 'Dodano pracownika';
        // czyszczenie formularza po wysłaniu na server
        this.userFirstname = '';
        this.userLastname = '';
        this.userPesel = '';
        this.userEmail = '';
        // emituje event dodania pracownika do listy widoku
        eventBus.$emit('addUserToList', this.userToAdd);
      }
      else{
        this.actionInfo = 'Błąd dodawania, spróbuj jeszcze raz'
      }
      // pokazuje komunikat po dodaniu workera
      this.actionShow = true;
      setTimeout(() => {
        this.actionShow = false;        
      },5000);
    })
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

.action-info{
  position: fixed;
  left: 10px;
  top: 200px;
  background: #fff;
  padding: 10px 15px;
}

</style>
