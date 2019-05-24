<template>
  <form @submit.prevent="addEmployer" class="add-employer--form">
    <div>
      <label for="employer-name">imię <input id="employer-name" type="text" v-model="employer.name" placeholder="imię pracodawcy" title="imię pracodawcy" required></label>
      <label for="employer-company">nazwa <input id="employer-company" type="text" v-model="employer.company" placeholder="nazwa firmy" title="nazwa firmy" required></label>
      <label for="employer-email">email <input id="employer-email" type="email" v-model="employer.email" placeholder="przykład@test.pl" title="adres email pracodawcy - przykład@test.pl" required></label>
      <label for="employer-email">NIP <input id="employer-nip" type="number" v-model="employer.nip" placeholder="NIP pracodawcy" title="NIP pracodawcy" required></label>
      <label for="employer-address">adres <input id="employer-address" type="text" v-model="employer.address" placeholder="ulica i numer" title="ulica i numer"></label>
      <label for="employer-city">miasto <input id="employer-city" type="text" v-model="employer.city" placeholder="miasto" title="miasto"></label>
      <label for="employer-code">kod pocztowy <input id="employer-code" type="text" v-model="employer.code" placeholder="kod pocztowy" title="kod pocztowy"></label>
      <label for="employer-voivodeship">województwo <input id="employer-voivodeship" type="text" v-model="employer.voivodeship" placeholder="województwo" title="województwo"></label>

      <!-- <label for="employer-partTime">wymiar etatu
        <select name="partTime" id="employer-partTime" v-model="employer.partTime" title="wymiar etatu pracownika">
          <option value="1" selected>1</option>
          <option value="0.75">0.75</option>
          <option value="0.5">0.5</option>
          <option value="0.25">0.25</option>
        </select>
      </label> -->
    </div>
    <button type="submit">{{ submitBtnText }}</button>
  </form>
</template>

<script>
import { eventBus } from '../../../main.js';
import { setTimeout } from 'timers';

export default {
  props: ['edit', 'employerData'],
  data(){
    return{
      employer: {
        name: '',
        company: '',
        email: '',
        nip: '',
        address: '',
        city: '',
        code: '',
        voivodeship: ''
      },
      newEmployer: {},
      submitBtnText: 'Dodaj pracodawcę'
    }
  },
  methods: {
    addEmployer(){
      this.newEmployer = {
        company: this.employer.name,
        email: this.employer.email,
        // address: this.employer.address,
        // city: this.employer.city,
        // code: this.employer.code,
        // voivodeship: this.employer.voivodeship
      }


      // edit employer
      if(this.employerData.pesel){
        this.newemployer.id = this.employerData.id;
        // this.$store.dispatch('editUser', {userType: 'employer', userData: this.newemployer});
      }
      // add employer
      else{
        this.newEmployer.password = "12345678";
        this.newEmployer.password_confirmation = "12345678";
        // this.$store.dispatch('sendUser', {userType: 'employer', userData: this.newemployer});
      }

    },
    checkIfEdit(){
      if(this.employerData){
        this.employer.name = this.employerData.user.name;
        this.employer.lastname = this.employerData.lastname;
        this.employer.pesel = this.employerData.pesel;
        this.employer.email = this.employerData.user.email;

        if(this.employerData.contract_from !== '2001-01-01'){
          this.employer.contractFrom = this.employerData.contract_from;
        }
        if(this.employerData.contract_to){
          this.employer.contractTo = this.employerData.contract_to;
        }
        if(this.employerData.part_time){
          this.employer.partTime = this.employerData.part_time;
        }
        if(!this.employerData.equivalent_amount || this.employerData.equivalent_amount === '0.00'){
          this.employer.equivalent = '0';
        }
        else{
          this.employer.equivalent = this.employerData.equivalent_amount;
        }
        if(this.employerData.effective){
          this.employer.effective = this.employerData.effective;
        }

        this.submitBtnText = 'Zapisz zmiany';
      }
    }
  },
  created(){
    // this.checkIfEdit();
  }
}
</script>

<style lang="scss">
@import "../../../sass/flexMixins.scss";
@import "../../../sass/elements.scss";

.add-employer--form{
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
