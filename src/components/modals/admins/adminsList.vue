<template>
  <div class="admins-list-modal modal-window">
    <close-button></close-button>
    <div class="add-admin">
      <button @click="addAdminSwitch">{{addAdminText}}</button>
      <div v-if="addAdminOn">
        <add-user-form v-bind:userType="'admin'"></add-user-form>
      </div>
    </div>
    <form class="search-admin--form">
      <label for="search-admin--input">Wpisz imię i nazwisko</label>
      <input type="text" id="search-admin--input" v-model="adminName">
    </form>
    <ul class="admin-list">
      <li v-for="admin in admins" :key="admin.id">
        <span>{{admin.firstname}} {{admin.lastname}}, pesel: {{admin.pesel}}, email: {{admin.email}}</span>
        <button @click="deleteAdmin" :data-id="admin.id">usuń</button>
      </li>
    </ul>
  </div>
</template>

<script>
import closeButton from '../modals-elements/closeButton.vue';
import addUserForm from '../modals-elements/addUserForm.vue';

export default {
  components:{
    'close-button': closeButton,
    'add-user-form': addUserForm
  },
  data(){
    return {
      admins: this.$store.getters.getAdmins,
      adminName: '',
      addAdminOn: false,
      addAdminText: 'Dodaj admina'
    }
  },
  methods: {
    addAdminSwitch(){
      this.addAdminOn = !this.addAdminOn;
      if(this.addAdminOn){
        this.addAdminText = 'Zamknij panel';
      }
      else{
        this.addAdminText = 'Dodaj admina';
      }
    },
    deleteAdmin(e){
      const adminId = e.target.attributes['data-id'].value;
      console.log(`delete admin: id ${adminId}`);
    }
  },
  watch: {
    adminName(text){
      const pattern = new RegExp(text, 'i');
      const allAdmins = this.$store.getters.getAdmins;
      this.admins = allAdmins.filter(i => {
        if(pattern.test(`${i.firstname} ${i.lastname}`)){
          return i;
        }
      });
    }
  }
}
</script>

<style scoped lang="scss">
@import "../../../sass/flexMixins.scss";
@import "../../../sass/elements.scss";

.admins-list-modal{
  @include flexColumn(flex-start, center);
  padding-top: 50px;

  .add-admin{
    @include flexColumn;
    margin-bottom: 30px;

    button{
      @include buttonWhite;
      padding: 5px 10px;
      margin-bottom: 20px;
    }
  }

  .search-admin--form{
    @include flexColumn;
    margin-bottom: 20px;

    input{
      @include inputWhite;
    }
  }

  .admin-list{


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
