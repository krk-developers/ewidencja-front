<template>
  <div class="workers-list-modal modal-window">
    <close-button></close-button>
    <h2>Lista Pracowników</h2>
    <div class="add-worker">
      <button @click="editWorkerSwitch">{{editWorkerText}}</button>
      <div v-if="editWorkerOn">
        <add-worker-form v-bind:workerData="editWorkerData"></add-worker-form>
      </div>
    </div>
    <form class="search-worker--form">
      <label for="search-worker--input">Wyszukaj - podaj nazwisko, imie, PESEL, lub datę rozpoczęcia/zakończenia umowy</label>
      <input type="search" id="search-worker--input" v-model="workerSearch">
    </form>
    <ul v-if="showList" class="workers-list">
      <li class="worker-item" v-for="worker in workers" :key="worker.pesel">
        <div class="worker-data">
          <div>
            <span class="name-pesel">{{worker.lastname}} {{worker.user.name}}&#8195;({{worker.pesel}})</span>
            <span class="email">{{worker.user.email}}</span>
            <span>wymiar etatu: {{worker.part_time}}</span>
          </div>
          <div>
            <span class="contract">Umowa: {{fixContractFrom(worker)}} - {{fixContractTo(worker)}}</span>
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
    <div v-if="actionShow" class="action-info">
      <h4>{{actionInfo}}</h4>
      <h4 v-show="errorInfo">{{errorInfo1}}</h4>
      <h4 v-show="errorInfo">{{errorInfo2}}</h4>
    </div>
  </div>
</template>

<script>
import closeButton from './modals-elements/closeButton.vue';
import addWorkerForm from './modals-elements/addWorkerForm.vue';
import { eventBus } from '../../main';
import { setTimeout } from 'timers';

export default {
  components:{
    'close-button': closeButton,
    'add-worker-form': addWorkerForm
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
      actionShow: false,
      actionInfo: '',
      errorInfo: false,
      errorInfo1: 'Spróbuj jeszcze raz.',
      errorInfo2: 'Jeśli błąd się powtarza, zgłoś to administratorowi.'
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
        this.$store.dispatch('deleteUser', {userType: 'worker', id: workerId});

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
    }
  },
  watch: {
    // wyszukuje pracownika z listy
    workerSearch(text){
      const pattern = new RegExp(text, 'i');
      const allWorkers = this.$store.getters.getWorkers;
      this.workers = allWorkers.filter(i => {
        if(pattern.test(`${i.lastname} ${i.user.name} ${i.pesel} ${i.contract_from} ${i.contract_to}`)){
          return i;
        }
      });
    }
  },
  created(){

    // zmiany po poprawnym dodaniu/edycji pracownika
    eventBus.$on('workerAction', (actionType) => {

      if(actionType === 'added'){
        this.actionInfo = 'Dodano pracownika';
        this.$nextTick(() => {
          this.workers = this.$store.getters.getWorkers;
          this.editWorkerSwitch();
        })
      }
      else if(actionType === 'edited'){
        this.actionInfo = 'Zapisano zmiany';
        this.$nextTick(() => {
          this.workers = this.$store.getters.getWorkers;
          this.cleanEditWorker(true);
          if(this.workerSearch !== ''){
            this.searchAgain();
          }
        })
      }
      else if(actionType === 'deleted'){
        this.actionInfo = 'Usunięto pracownika';
        this.$nextTick(() => {
          this.workers = this.$store.getters.getWorkers;
        })
      }
      else if(actionType === 'error'){
        this.actionInfo = 'Wystąpił błąd po stronie serwera.'
        this.errorInfo = true;
      }

      this.actionShow = true;
      setTimeout(() => {
        this.actionShow = false;
        this.errorInfo = false;
      },5000);
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
        .contract{
          min-width: 255px;
        }
        .effective{
          min-width: 170px;
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
