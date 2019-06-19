<template>
  <form @submit.prevent="addEmployer" class="add-employer--form">
    <div>
      <label for="employer-name">imię <input id="employer-name" type="text" v-model="employer.name" placeholder="imię pracodawcy" title="imię pracodawcy" required></label>
      <label for="employer-company">nazwa <input id="employer-company" type="text" v-model="employer.company" placeholder="nazwa firmy" title="nazwa firmy" required></label>
      <label for="employer-email">email <input id="employer-email" type="email" v-model="employer.email" placeholder="przykład@test.pl" title="adres email pracodawcy - przykład@test.pl" required></label>
      <label for="employer-email">NIP <input id="employer-nip" type="number" v-model="employer.nip" placeholder="NIP pracodawcy" title="NIP pracodawcy"></label>
      <label for="employer-address">adres <input id="employer-address" type="text" v-model="employer.address" placeholder="ulica i numer" title="ulica i numer"></label>
      <label for="employer-city">miasto <input id="employer-city" type="text" v-model="employer.city" placeholder="miasto" title="miasto"></label>
      <label for="employer-code">kod pocztowy <input id="employer-code" type="text" v-model="employer.code" placeholder="kod pocztowy" title="kod pocztowy"></label>
      <label for="employer-province">województwo
        <select id="employer-province" v-model="employer.provinceId" title="województwo">
          <option v-for="prov in $store.getters.getProvinces" :key="prov.id" :value="prov.id">{{prov.name}}</option>
        </select>
      </label>
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
        provinceId: ''
      },
      newEmployer: {},
      submitBtnText: 'Dodaj pracodawcę'
    }
  },
  methods: {
    addEmployer(){
      const newEmployer = {
        name: this.employer.name,
        company: this.employer.company,
        email: this.employer.email,
        nip: this.employer.nip,
        street: this.employer.address,
        city: this.employer.city,
        zip_code: this.employer.code,
        province_id: this.employer.provinceId
      }

      console.log(newEmployer);

      // edit employer
      if(this.edit){
        newEmployer.id = this.employerData.id;
        // this.$store.dispatch('editEmployer', newEmployer);
      }
      // add employer
      else{
        newEmployer.password = "12345678";
        newEmployer.password_confirmation = "12345678";
        this.$store.dispatch('addEmployer', newEmployer);
      }

    },
    checkIfEdit(){
      if(this.edit){
        this.employer.name = this.employerData.name;
        this.employer.email = this.employerData.email;
        this.employer.company = this.employerData.company;
        this.employer.nip = this.employerData.nip;
        this.employer.address = this.employerData.street;
        this.employer.city = this.employerData.city;
        this.employer.code = this.employerData.zip_code;
        this.employer.provinceId = this.employerData.province_id;

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
