<template>
  <div class="workers-list-modal modal-window">
    <close-button></close-button>
    <h2>Lista Pracowników</h2>
    <div class="add-worker">
      <button @click="addWorkerSwitch">{{addWorkerText}}</button>
      <div v-if="addWorkerOn">
        <add-user-form v-bind:userType="'worker'"></add-user-form>
      </div>
    </div>
    <form class="search-worker--form">
      <label for="search-worker--input">Wyszukaj - podaj imię, nazwisko lub PESEL</label>
      <input type="text" id="search-worker--input" v-model="workerSearch">
    </form>
    <ul v-if="showList" class="workers-list">
      <li v-for="worker in workers" :key="worker.pesel">
        <span>{{worker.user.name}} {{worker.lastname}}&#8195;({{worker.pesel}})&#8195;&#8212;&#8195;{{worker.user.email}}</span>
        <div>
          <button @click="editWorker" :data-id="worker.id">edytuj</button>
          <button @click="deleteWorker" :data-id="worker.id">usuń</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import closeButton from './modals-elements/closeButton.vue';
import addUserForm from './modals-elements/addUserForm.vue';
import { eventBus } from '../../main';

export default {
  components:{
    'close-button': closeButton,
    'add-user-form': addUserForm
  },
  data(){
    return {
      workers: this.$store.getters.getWorkers,
      showList: true,
      workerSearch: '',
      addWorkerOn: false,
      addWorkerText: 'Dodaj pracownika'
    }
  },
  methods: {
    addWorkerSwitch(){
      this.addWorkerOn = !this.addWorkerOn;
      if(this.addWorkerOn){
        this.addWorkerText = 'Zamknij panel';
      }
      else{
        this.addWorkerText = 'Dodaj pracownika';
      }
    },
    editWorker(e){
      const workerId = e.target.attributes['data-id'].value;
      console.log(`edit worker: id ${workerId}`);
    },
    deleteWorker(e){
      const workerId = e.target.attributes['data-id'].value;
      // console.log(`delete worker: id ${workerId}`);
      this.$store.dispatch('deleteUser', {userType: 'worker', id: workerId});

      //  usunięcie placownika z listy w obecnym widoku
      const ind = this.workers.findIndex(el => {
        return el.id == workerId;
      });
      this.workers.splice(ind, 1);
    }
  },
  watch: {
    // wyszukuje pracownika z listy
    workerSearch(text){
      const pattern = new RegExp(text, 'i');
      const allWorkers = this.$store.getters.getWorkers;
      this.workers = allWorkers.filter(i => {
        if(pattern.test(`${i.user.name} ${i.lastname} ${i.pesel}`)){
          return i;
        }
      });
    }
  },
  created(){
    // dodaje pracownika do listy widoku po wysłaniu go na serwer
    eventBus.$on('addUserToList', (user) => {
      this.workers.push(user);
    });
  }
}
</script>

<style scoped lang="scss">
@import "../../sass/flexMixins.scss";
@import "../../sass/elements.scss";

.workers-list-modal{
  @include flexColumn(flex-start, center);
  padding-top: 20px;

  .add-worker{
    @include flexColumn;
    margin: 20px 0 30px 0;

    button{
      @include buttonWhite;
      padding: 5px 10px;
      margin-bottom: 20px;
    }
  }

  .search-worker--form{
    @include flexColumn;
    margin-bottom: 20px;

    input{
      @include inputWhite;
      margin-top: 10px;
    }
  }

  .workers-list{


    li{
      @include flexRow(space-between, center);
      border: 1px solid black;
      background: #fff;
      padding: 4px 10px;
      margin-bottom: 2px;

      button{
        @include buttonWhite;
        padding: 1px 6px;
        margin-left: 5px;
        background: rgb(253, 114, 114);
      }
      button:first-child{
        @include buttonWhite;
        margin-left: 30px;
        background: rgb(125, 204, 125);
      }
    }
  }

}
</style>
