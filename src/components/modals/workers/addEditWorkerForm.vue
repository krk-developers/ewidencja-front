<template>
  <form @submit.prevent="addWorker" class="add-worker--form">
    <div>
      <label for="worker-firstname">imię <input id="worker-firstname" type="text" v-model="worker.name" placeholder="imię" title="imię" required></label>
      <label for="worker-lastname">nazwisko <input id="worker-lastname" type="text" v-model="worker.lastname" placeholder="nazwisko" title="nazwisko" required></label>
      <label for="worker-pesel">PESEL <input id="worker-pesel" type="number"  v-model="worker.pesel" placeholder="11 cyfer" title="pesel musi mieć 11 cyfer" required></label>
      <label for="worker-email">email <input id="worker-email" type="email" v-model="worker.email" placeholder="przykład@test.pl" title="przykład@test.pl" required></label>
      <label for="worker-effective">liczba efektywna
        <select name="effective" id="worker-effective" v-model="worker.effective" title="liczba efektywna pracownika">
          <option value="1" selected>1</option>
          <option value="3">3</option>
          <option value="4">4</option>
        </select>
      </label>
      <label for="worker-equivalent">ekwiwalent <input id="worker-equivalent" type="number" step="0.01" v-model="worker.equivalent" placeholder="0 oznacza brak" title="0 oznacza brak"></label>
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
        equivalent: '',
        effective: ''
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
        email: this.worker.email,
        effective: this.worker.effective,
      }

      if(this.worker.equivalent === '0' || this.worker.equivalent === ''){
        this.newWorker.equivalent = '0';
        this.newWorker.equivalent_amount = '0';
      }
      else{
        this.newWorker.equivalent = '1';
        this.newWorker.equivalent_amount = this.worker.equivalent;
      }

      // edit worker
      if(this.workerData.pesel){
        this.newWorker.id = this.workerData.id;
        this.$store.dispatch('editWorker', this.newWorker);
      }
      // add worker
      else{
        this.newWorker.password = "12345678";
        this.newWorker.password_confirmation = "12345678";
        this.$store.dispatch('addWorker', this.newWorker);
      }

    },
    checkIfEdit(){
      if(this.workerData.pesel){
        this.worker.name = this.workerData.user.name;
        this.worker.lastname = this.workerData.lastname;
        this.worker.pesel = this.workerData.pesel;
        this.worker.email = this.workerData.user.email;

        if(!this.workerData.equivalent_amount || this.workerData.equivalent_amount === '0.00'){
          this.worker.equivalent = '0';
        }
        else{
          this.worker.equivalent = this.workerData.equivalent_amount;
        }
        if(this.workerData.effective){
          this.worker.effective = this.workerData.effective;
        }

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

      input, select{
        @include inputWhite;
      }
    }
  }

  button{
    @include buttonWhite;
    padding: 5px 10px;
    margin-top: 10px;
  }
}

</style>
