<template>
  <form @submit.prevent="addWorker" class="add-worker--form">
    <div>
      <label for="worker-firstname">imię <input id="worker-firstname" type="text" v-model="worker.name" required></label>
      <label for="worker-lastname">nazwisko <input id="worker-lastname" type="text" v-model="worker.lastname" required></label>
      <label for="worker-pesel">PESEL <input id="worker-pesel" type="number"  v-model="worker.pesel" required></label>
      <label for="worker-email">email <input id="worker-email" type="email" v-model="worker.email" required></label>
    </div>
    <button type="submit">{{ submitBtnText }}</button>
    </form>
</template>

<script>
import { eventBus } from '../../../main.js';
import { setTimeout } from 'timers';

export default {
  props: ['edit', 'workerData'],
  data(){
    return{
      worker: {
        name: '',
        lastname: '',
        pesel: '',
        email: '',
        wymiarEtatu: '',
        ekwiwalent: '',
        umowaOd: '',
        umowaDo: '',
        liczbaEfektywna: ''
      },
      newWorker: {},
      submitBtnText: 'Dodaj pracownika'
    }
  },
  methods: {
    addWorker(){
      this.newWorker = {
        lastname: this.worker.lastname,
        pesel: this.worker.pesel,
        name: this.worker.name,
        email: this.worker.email
      }

      // edit worker
      if(this.workerData.pesel){
        this.newWorker.id = this.workerData.id;
        this.$store.dispatch('editUser', {userType: 'worker', userData: this.newWorker});
      }
      // add worker
      else{
        this.newWorker.password = "12345678";
        this.newWorker.password_confirmation = "12345678";
        this.$store.dispatch('sendUser', {userType: 'worker', userData: this.newWorker});
      }

    },
    checkIfEdit(){
      if(this.workerData.pesel){
        this.worker.name = this.workerData.user.name;
        this.worker.lastname = this.workerData.lastname;
        this.worker.pesel = this.workerData.pesel;
        this.worker.email = this.workerData.user.email;
        this.submitBtnText = 'Zapisz zmiany';
      }
    }
  },
  created(){
    this.checkIfEdit();
  }
}
</script>

<style lang="scss">
@import "../../../sass/flexMixins.scss";
@import "../../../sass/elements.scss";

.add-worker--form{
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
