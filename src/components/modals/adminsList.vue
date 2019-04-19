<template>
  <div class="admins-list-modal">
    <button class='close-modal-btn' @click="$store.dispatch('hideModal')">X</button>
    <div class="add-admin">
      <button @click="addAdminSwitch">{{addAdminText}}</button>
      <form @submit.prevent="addAdmin" class="add-admin--form" v-if="addAdminOn">
        <label for="admin-firstname">imię <input id="admin-firstname" type="text" v-model="aFirstname" required></label>
        <label for="admin-lastname">nazwisko <input id="admin-lastname" type="text" v-model="aLastname" required></label>
        <label for="admin-pesel">pesel <input id="admin-pesel" type="text" v-model="aPesel" required></label>
        <label for="admin-email">email <input id="admin-email" type="email" v-model="aEmail" required></label>
        <button type="submit">Dodaj</button>
      </form>
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
export default {
  data(){
    return {
      admins: this.$store.getters.getAdmins,
      adminName: '',
      addAdminOn: false,
      addAdminText: 'Dodaj admina',
      aFirstname: '',
      aLastname: '',
      aPesel: '',
      aEmail: ''
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
    addAdmin(){
      const newAdmin = {
        firstname: this.aFirstname,
        lastname: this.aLastname,
        pesel: this.aPesel,
        email: this.aEmail
      };

      console.log(newAdmin);

      // fetchSuperadmins
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
@import "../../sass/flexMixins.scss";

.admins-list-modal{
  @include flexColumn(flex-start, center);
  position: fixed;
  left: 0;
  top: 0;
  z-index: 10;
  width: 100vw;
  height: 100vh;
  padding-top: 50px;
  background: gray;

  .close-modal-btn{
    padding: 10px 20px;
    position: fixed;
    top: 10px;
    right: 10px;
  }

  .add-admin{
    @include flexColumn;
    margin-bottom: 30px;

    .add-admin--form{
      @include flexColumn;
    }
  }

  .search-admin--form{
    @include flexColumn;
    margin-bottom: 20px;
  }

  .admin-list{


    li{
      margin-bottom: 10px;

      button{
        padding: 1px 6px;
        margin-left: 20px;
      }
    }
  }

}
</style>
