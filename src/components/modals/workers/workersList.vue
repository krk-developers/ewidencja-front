<template>
  <div class="workers-list-modal modal-window">
    <close-button></close-button>
    <h2>Lista Pracowników</h2>
    <div class="add-worker">
      <button @click="editWorkerSwitch">{{editWorkerText}}</button>
      <div v-if="editWorkerOn">
        <add-edit-worker-form v-bind:workerData="editWorkerData"></add-edit-worker-form>
      </div>
    </div>
    <form class="search-worker--form">
      <label for="search-worker--input">Wyszukaj - podaj nazwisko, imie lub PESEL</label>
      <input type="search" id="search-worker--input" v-model="workerSearch">
    </form>
    <ul v-if="showList" class="workers-list">
      <li class="worker-item" v-for="worker in workers" :key="worker.pesel">
        <div class="worker-data">
          <div>
            <span class="name-pesel">{{worker.lastname}} {{worker.user.name}}&#8195;({{worker.pesel}})</span>
            <span class="email">{{worker.user.email}}</span>
          </div>
          <div>
            <span class="employers">liczba pracodawców: {{worker.employers.length}}</span>
            <span class="effective">liczba efektywna: {{worker.effective}}</span>
            <span>ekwiwalent: {{worker.equivalent_amount}}</span>
          </div>
        </div>
        <div class="worker-buttons">
          <button @click="editWorker" :data-id="worker.id">edytuj</button>
          <button @click="deleteWorker" :data-id="worker.id">usuń</button>
        </div>
      </li>
    </ul>
    <div v-if="notificationShow">
      <notification :notification="notificationInfo"></notification>
    </div>
  </div>
</template>

<script>
import closeButton from '../modals-elements/closeButton.vue';
import addEditWorkerForm from './addEditWorkerForm.vue';
import notification from '../modals-elements/notification.vue';
import { eventBus } from '../../../main';
import { setTimeout } from 'timers';

export default {
  components:{
    'close-button': closeButton,
    'add-edit-worker-form': addEditWorkerForm,
    notification
  },
  data(){
    return {
      workers: this.$store.getters.getWorkers,
      showList: true,
      workerSearch: '',
      editWorkerOn: false,
      editWorkerTrue: false,
      editWorkerData: {},
      editWorkerText: 'Dodaj pracownika',
      notificationShow: false,
      notificationInfo: {},
    }
  },
  methods: {
    editWorkerSwitch(){
      this.editWorkerOn = !this.editWorkerOn;
      if(this.editWorkerOn){
        this.editWorkerText = 'Zamknij panel';
      }
      else{
        this.editWorkerText = 'Dodaj pracownika';

        if(this.editWorkerTrue){
          this.cleanEditWorker(false);
        }
      }
    },
    editWorker(e){
      const workerId = e.target.attributes['data-id'].value;

      const workerToEdit = this.workers.filter(worker => {
        return worker.id === +workerId;
      })[0];

      if(this.editWorkerOn){
        this.editWorkerSwitch();
        this.editWorkerTrue = true;
        this.editWorkerData = workerToEdit;
        this.$nextTick(() => {
          this.editWorkerSwitch();
        });
      }
      else{
        this.editWorkerTrue = true;
        this.editWorkerData = workerToEdit;
        this.editWorkerSwitch();
      }
    },
    cleanEditWorker(e){
      this.editWorkerTrue = false;
      this.editWorkerData = {};
      if(e){
        this.editWorkerSwitch();
      }
    },
    deleteWorker(e){
      const workerId = e.target.attributes['data-id'].value;
      const workerToDelete = this.workers.filter(worker => {
        return worker.id === +workerId;
      })[0];

      const confirmDelete = confirm(`Usunąć pracownika?\n${workerToDelete.user.name} ${workerToDelete.lastname} (${workerToDelete.pesel})`);

      if(confirmDelete){
        this.$store.dispatch('deleteWorker', workerId);

      }
    },
    fixContractFrom(worker){
      if(worker.contract_from === '2001-01-01'){
        return 'brak';
      }
      else{
        return worker.contract_from;
      }
    },
    fixContractTo(worker){
      if(!worker.contract_to){
        return 'brak';
      }
      else{
        return worker.contract_to;
      }
    },
    searchAgain(){
      const text = this.workerSearch;
      this.workerSearch = '';
      setTimeout(() => {
        this.workerSearch = text;
      }, 0);
    },
    showNotification(action){
      if(action === 'added'){
        this.notificationInfo.message = 'Dodano pracownika';
        this.$nextTick(() => {
          this.workers = this.$store.getters.getWorkers;
          this.editWorkerSwitch();
        })
      }
      else if(action === 'edited'){
        this.notificationInfo.message = 'Zapisano zmiany';
        this.$nextTick(() => {
          this.workers = this.$store.getters.getWorkers;
          this.cleanEditWorker(true);
          if(this.workerSearch !== ''){
            this.searchAgain();
          }
        })
      }
      else if(action === 'deleted'){
        this.notificationInfo.message = 'Usunięto pracownika';
        this.$nextTick(() => {
          this.workers = this.$store.getters.getWorkers;
        })
      }
      else if(action === 'error'){
        this.notificationInfo.message = 'Wystąpił błąd po stronie serwera.'
        this.notificationInfo.error = true;
      }

      this.notificationShow = true;
      setTimeout(() => {
        this.notificationShow = false;
        this.notificationInfo = {};
      },5000);

    }
  },
  watch: {
    // wyszukuje pracownika z listy
    workerSearch(text){
      const pattern = new RegExp(text, 'i');
      const allWorkers = this.$store.getters.getWorkers;
      this.workers = allWorkers.filter(i => {
        if(pattern.test(`${i.lastname} ${i.user.name} ${i.pesel}`)){
          return i;
        }
      });
    }
  },
  created(){

    // zmiany po poprawnym dodaniu/edycji pracownika
    eventBus.$on('workerAction', (action) => {
      this.showNotification(action);
    });
  }
}
</script>

<style scoped lang="scss">
@import "./../../../sass/flexMixins.scss";
@import "./../../../sass/elements.scss";

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


    .worker-item{
      @include flexRow(space-between, center);
      border: 1px solid black;
      background: #fff;
      padding: 4px 10px;
      margin-bottom: 2px;

      .worker-data{

        div:first-child{
          margin-bottom: 3px;
        }

        span{
          display: inline-block;
          border-right: 1px solid #000;
          margin-right: 15px;
          padding-right: 10px;
        }
        .name-pesel{
          min-width: 255px;
        }
        .email{
          min-width: 170px;
        }
        .employers{
          min-width: 180px;
        }
        .effective{
          min-width: 155px;
        }
        div span:last-child{
          border: none;
          padding: 0;
          margin: 0;
        }
      }

      .worker-buttons{

        button{
          @include buttonWhite;
          padding: 3px 6px;
          margin-left: 5px;
          background: rgb(253, 114, 114);
        }
        button:first-child{
          @include buttonWhite;
          margin-left: 20px;
          background: rgb(125, 204, 125);
        }
      }

    }  // .worker-item
  }


  .action-info{
    position: fixed;
    left: 10px;
    top: 200px;
    background: #fff;
    padding: 10px 15px;
  }

}
</style>
