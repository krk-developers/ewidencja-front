<template>
  <div class="superadmins-list-modal">
    <button class='close-modal-btn' @click="$store.dispatch('hideModal')">X</button>
    <div class="add-superadmin">
      <button @click="addSuperAdminSwitch">{{addSuperAdminText}}</button>
      <form @submit.prevent="addSuperAdmin" class="add-superadmin--form" v-if="addSuperAdminOn">
        <label for="superadmin-firstname">imię <input id="superadmin-firstname" type="text" v-model="saFirstname" required></label>
        <label for="superadmin-lastname">nazwisko <input id="superadmin-lastname" type="text" v-model="saLastname" required></label>
        <label for="superadmin-pesel">pesel <input id="superadmin-pesel" type="text" v-model="saPesel" required></label>
        <label for="superadmin-email">email <input id="superadmin-email" type="email" v-model="saEmail" required></label>
        <button type="submit">Dodaj</button>
      </form>
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
export default {
  data(){
    return {
      sAdmins: this.$store.getters.getSuperAdmins,
      sAdminName: '',
      addSuperAdminOn: false,
      addSuperAdminText: 'Dodaj superadmina',
      saFirstname: '',
      saLastname: '',
      saPesel: '',
      saEmail: ''
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
    addSuperAdmin(){
      const newSuperAdmin = {
        firstname: this.saFirstname,
        lastname: this.saLastname,
        pesel: this.saPesel,
        email: this.saEmail
      };

      console.log(newSuperAdmin);

      // fetchSuperadmins
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

.superadmins-list-modal{
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

  .add-superadmin{
    @include flexColumn;
    margin-bottom: 30px;

    .add-superadmin--form{
      @include flexColumn;
    }
  }

  .search-superadmin--form{
    @include flexColumn;
    margin-bottom: 20px;
  }

  .superadmin-list{


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
