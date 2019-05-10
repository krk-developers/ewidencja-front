<template>
  <div class="superadmins-list-modal modal-window">
    <close-button></close-button>
    <div class="add-superadmin">
      <button @click="addSuperAdminSwitch">{{addSuperAdminText}}</button>
      <div v-if="addSuperAdminOn">
        <add-user-form v-bind:userType="'superadmin'"></add-user-form>
      </div>
    </div>
    <form class="search-superadmin--form">
      <label for="search-superadmin--input">Wpisz imię i nazwisko</label>
      <input type="text" id="search-superadmin--input" v-model="sAdminName">
    </form>
    <ul class="superadmin-list">
      <li v-for="sAdmin in sAdmins" :key="sAdmin.id">
        <span>{{sAdmin.firstname}} {{sAdmin.lastname}}, pesel: {{sAdmin.pesel}}, email: {{sAdmin.email}}</span>
        <button @click="deleteSuperAdmin" :data-id="sAdmin.id">usuń</button>
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
      sAdmins: this.$store.getters.getSuperAdmins,
      sAdminName: '',
      addSuperAdminOn: false,
      addSuperAdminText: 'Dodaj superadmina'
    }
  },
  methods: {
    addSuperAdminSwitch(){
      this.addSuperAdminOn = !this.addSuperAdminOn;
      if(this.addSuperAdminOn){
        this.addSuperAdminText = 'Zamknij panel';
      }
      else{
        this.addSuperAdminText = 'Dodaj superadmina';
      }
    },
    deleteSuperAdmin(e){
      const sAdminId = e.target.attributes['data-id'].value;
      console.log(`delete superadmin: id ${sAdminId}`);
    }
  },
  watch: {
    sAdminName(text){
      const pattern = new RegExp(text, 'i');
      const allSuperAdmins = this.$store.getters.getSuperAdmins;
      this.sAdmins = allSuperAdmins.filter(i => {
        if(pattern.test(`${i.firstname} ${i.lastname}`)){
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

.superadmins-list-modal{
  @include flexColumn(flex-start, center);
  padding-top: 50px;

  .add-superadmin{
    @include flexColumn;
    margin-bottom: 30px;

    button{
      @include buttonWhite;
      padding: 5px 10px;
      margin-bottom: 20px;
    }
  }

  .search-superadmin--form{
    @include flexColumn;
    margin-bottom: 20px;

    input{
      @include inputWhite;
    }
  }

  .superadmin-list{


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
