<template>
  <div class="employers-list-modal modal-window">
    <close-button></close-button>
    <div class="add-employer">
      <button @click="addEmployerSwitch">{{addEmployerText}}</button>
      <div v-if="addEmployerOn">
        <add-user-form v-bind:userType="'employer'"></add-user-form>
      </div>
    </div>
    <form class="search-employer--form">
      <label for="search-employer--input">Wpisz imię i nazwisko</label>
      <input type="text" id="search-employer--input" v-model="employerName">
    </form>
    <ul class="employer-list">
      <li v-for="employer in employers" :key="employer.id">
        <span>{{employer.firstname}} {{employer.company}}, email: {{employer.email}}</span>
        <button @click="deleteEmployer" :data-id="employer.id">usuń</button>
      </li>
    </ul>
  </div>
</template>

<script>
import closeButton from './modals-elements/closeButton.vue';
import addUserForm from './modals-elements/addUserForm.vue';

export default {
  components:{
    'close-button': closeButton,
    'add-user-form': addUserForm
  },
  data(){
    return {
      employers: this.$store.getters.getEmployers,
      employerName: '',
      addEmployerOn: false,
      addEmployerText: 'Dodaj pracodawcę'
    }
  },
  methods: {
    addEmployerSwitch(){
      this.addEmployerOn = !this.addEmployerOn;
      if(this.addEmployerOn){
        this.addEmployerText = 'Zamknij panel';
      }
      else{
        this.addEmployerText = 'Dodaj pracodawcę';
      }
    },
    deleteEmployer(e){
      const employerId = e.target.attributes['data-id'].value;
      console.log(`delete employer: id ${employerId}`);
    }
  },
  watch: {
    employerName(text){
      const pattern = new RegExp(text, 'i');
      const allEmployers = this.$store.getters.getEmployers;
      this.employers = allEmployers.filter(i => {
        if(pattern.test(`${i.firstname} ${i.company}`)){
          return i;
        }
      });
    }
  }
}
</script>

<style scoped lang="scss">
@import "../../sass/flexMixins.scss";
@import "../../sass/elements.scss";

.employers-list-modal{
  @include flexColumn(flex-start, center);
  padding-top: 50px;

  .add-employer{
    @include flexColumn;
    margin-bottom: 30px;

    button{
      @include buttonWhite;
      padding: 5px 10px;
      margin-bottom: 20px;
    }
  }

  .search-employer--form{
    @include flexColumn;
    margin-bottom: 20px;

    input{
      @include inputWhite;
    }
  }

  .employer-list{


    li{
      margin-bottom: 10px;

      button{
        @include buttonWhite;
        padding: 1px 6px;
        margin-left: 20px;
      }
    }
  }

}
</style>
