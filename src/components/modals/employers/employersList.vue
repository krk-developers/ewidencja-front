<template>
  <div class="employers-list-modal modal-window">
    <close-button></close-button>
    <h2>Lista Pracodawców</h2>
    <div v-if="!editWorkers" class="add-employer">
      <button @click="addEmployerSwitch">{{addEmployerText}}</button>
      <div v-if="addEmployerOn">
        <add-edit-employer-form :edit="editEmployerFlag" :employerData="employerToEdit"></add-edit-employer-form>
      </div>
    </div>
    <div v-if="editWorkers" class="workers-to-edit">
      <div class="title-panel">
        <div>
          <h4>{{workersEmployer.company}}</h4>
          <button @click="editWorkersClose">Zamknij panel</button>
          <button @click="addWorkerSwitch">{{addNewWorkerText}}</button>
        </div>
        <label>
          Wyszukaj - podaj nazwisko lub imię 
          <input v-if="!addNewWorker" type="search" v-model="workerName">
          <input v-else type="search" v-model="workerNameNew">
        </label>
      </div>
      <ul v-if="addNewWorker" class="new-workers-list">
        <form v-if="addNewWorkerForm" @submit.prevent="addWorker">
          <div class="name-section">
            <span>{{newContract.lastname}} {{newContract.name}} ({{newContract.pesel}})</span>
            <label for="part-time">wymiar etatu
              <select name="partTime" id="part-time" v-model="newContract.partTime" title="wymiar etatu pracownika">
                <option value="1">1</option>
                <option value="0.75">0.75</option>
                <option value="0.5">0.5</option>
                <option value="0.25">0.25</option>
              </select>
            </label>
          </div>
          <div class="contract">
            <label for="">umowa od: <input type="text" v-model="newContract.contractFrom" placeholder="RRRR-MM-DD" title="data w formacie RRRR-MM-DD - np. 2012-12-30"></label>
            <label for="">do: <input type="text" v-model="newContract.contractTo"  placeholder="RRRR-MM-DD" title="data w formacie RRRR-MM-DD - np. 2012-12-30"></label>
            <button type="submit">Dodaj pracownika</button>
          </div>
        </form>
        <div>
          <li v-for="worker in workersList" :key="worker.id">
            <span>{{worker.lastname}} {{worker.user.name}} ({{worker.pesel}})</span>
            <button @click="selectWorker(worker)">zaznacz</button>
          </li>
        </div>
      </ul>
      <ul v-if="!addNewWorker" class="workers-list">
        <li v-for="worker in employerWorkers" :key="worker.id">
          <add-edit-employer-workers-form v-bind:worker="worker" v-bind:employer="workersEmployer"></add-edit-employer-workers-form>
        </li>
      </ul>
    </div>
    <form class="search-employer--form">
      <label for="search-employer--input">Wyszukaj - podaj nazwę pracodawcy</label>
      <input type="search" id="search-employer--input" v-model="employerName">
    </form>
    <ul class="employer-list">
      <li class="list-item" v-for="employer in employers" :key="employer.id">
        <div class="employer-info">
          <div>
            <span>{{employer.firstname}}</span><span>|</span><span>{{employer.company}}</span><span>|</span>
            <span>{{employer.email}}</span><span>|</span><span>NIP</span>
          </div>
          <div>
            <span>adres</span><span>|</span><span>miasto</span><span>|</span>
            <span>kod pocztowy</span><span>|</span><span>województwo</span>
          </div>
          <select class="employer-workers">
            <option class="employer-worker" v-for="worker in employer.workers" :key="worker.id">
              <span class="name">{{worker.lastname}} {{worker.user.name}} ({{worker.pesel}})&#8195;|</span>
              <span class="contract">&#8195;umowa: {{worker.contract_from}} - {{worker.contract_to}}&#8195;|&#8195;wymiar etatu: 1</span>
            </option>
          </select>
        </div>
        <div class="buttons">
          <button @click="editEmployer" :data-id="employer.id">edytuj</button>
          <button @click="deleteEmployer" :data-id="employer.id">usuń</button>
          <button @click="editEmployerWorkers" :data-id="employer.id">edytuj pracowników</button>
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
import addEditEmployerForm from './addEditEmployerForm.vue';
import addEditEmployerWorkersForm from './addEditEmployerWorkersForm.vue';
import notification from '../modals-elements/notification.vue';
import { eventBus } from '../../../main';

export default {
  components:{
    'close-button': closeButton,
    'add-edit-employer-form': addEditEmployerForm,
    'add-edit-employer-workers-form': addEditEmployerWorkersForm,
    notification
  },
  data(){
    return {
      employers: this.$store.getters.getEmployers,
      employerName: '',
      addEmployerOn: false,
      addEmployerText: 'Dodaj pracodawcę',
      employerToEdit: {},
      editEmployerFlag: false,
      editWorkers: false,
      addNewWorker: false,
      addNewWorkerForm: false,
      addNewWorkerText: 'Dodaj pracownika',
      workersEmployer: {},
      employerWorkers: [],
      workerName: '',
      workersList: [],
      freeWorkers: [],
      workerNameNew: '',
      newContract: {
        employerId: '',
        workerId: '',
        partTime: '',
        contractFrom: '',
        contractTo: ''
      },
      notificationShow: false,
      notificationInfo: {},
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
    editEmployer(e){
      const employerId = e.target.attributes['data-id'].value;
      const employer = this.employers.find(emp => {
        return emp.id === +employerId;
      });
      console.log(employer);
    },
    editWorkersClose(){
      this.editWorkers = false;
      this.addNewWorker = false;
      this.addNewWorkerForm = false;
      this.workerName = '';
      this.workerNameNew = '';
    },
    editEmployerWorkers(e){
      this.editWorkersClose();
      const employerId = e.target.attributes['data-id'].value;
      const employer = this.employers.find(emp => {
        return emp.id === +employerId;
      });
      // console.log(employer);
      this.workersEmployer = employer;
      this.employerWorkers = employer.workers;
      this.editWorkers = !this.editWorkers;
    },
    deleteEmployer(e){
      const employerId = e.target.attributes['data-id'].value;
      const employerToDelete = this.employers.filter(employer => {
        return employer.id === +employerId;
      })[0];
      
      const confirmDelete = confirm(`Usunąć pracodawcę?\n
      ${employerToDelete.name} - ${employerToDelete.company} (${employerToDelete.nip}) - ${employerToDelete.email}`);

      if(confirmDelete){
        this.$store.dispatch('deleteEmployer', employerId);
      }

    },
    addWorkerSwitch(){
      if(this.addNewWorker){
        this.addNewWorker = false;
        this.addNewWorkerText = 'Dodaj pracownika';
      }
      else{
        this.addNewWorker = true;
        this.addNewWorkerText = 'Pokaż pracowników';

        this.freeWorkers = this.$store.getters.getWorkers.filter(worker => {
          let exist = false;
          for(const w of this.workersEmployer.workers){
            if(worker.id === w.id){
              exist = true
            }
          }
          if(!exist){
            return worker;
          }
        });
        this.workersList = this.freeWorkers;
      }

      this.addNewWorkerForm = false;
      this.newContract = {
        name: '',
        lastname: '',
        pesel: '',
        employerId: '',
        workerId: '',
        partTime: '',
        contractFrom: '',
        contractTo: ''
      };
    },
    selectWorker(worker){
      this.newContract.name = worker.user.name;
      this.newContract.lastname = worker.lastname;
      this.newContract.pesel = worker.pesel;
      this.newContract.employerId = this.workersEmployer.id;
      this.newContract.workerId = worker.id;
      this.addNewWorkerForm = true;
    },
    addWorker(){
      const newContract = {
        employer_id: this.newContract.employerId,
        worker_id: this.newContract.workerId,
        part_time: this.newContract.partTime,
        contract_from: this.newContract.contractFrom,
        contract_to: this.newContract.contractTo
      };

      this.$store.dispatch('addWorkerToEmployer', newContract);

    },
    addWorkersToEmployer(){
      const workers = this.$store.getters.getWorkers;

      const employersFull = this.employers.map(emp => {
        const works = [];
        for(let w of workers){
          for(let we of w.employers){
            if(emp.id === we.id){
              if(!w.contract_to){
                w.contract_to = 'brak';
              }
              works.push(w);
            }
          }

        }
        emp.workers = works;
        return emp;
      });
      this.employers = employersFull;

    },
    showNotification(action){
      console.log(action);
      if(action === 'error'){
        this.notificationInfo.message = 'Wystąpił błąd po stronie serwera.';
        this.notificationInfo.error = true;
      }
      else{
        this.employers = this.$store.getters.getEmployers;
        this.addWorkersToEmployer();

        if(action === 'added'){
          this.notificationInfo.message = 'Dodano pracodawcę.';
          this.addEmployerOn = false;
        }
        else if(action === 'edited'){
          this.notificationInfo.message = 'Zapisano zmiany.';
          this.addEmployerOn = false;
        }
        else if(action === 'deleted'){
          this.notificationInfo.message = 'Usunięto pracodawcę.';
        }
        else if(action === 'workerAdded'){
          this.notificationInfo.message = 'Dodano pracownika do pracodawcy.';
        }
        else if(action === 'workerEdited'){
          this.notificationInfo.message = 'Zmieniono umowę pracownika.';
          eventBus.$emit('disableAll');
        }
        else if(action === 'workerDeleted'){
          this.notificationInfo.message = 'Zwolniono pracownika.';
        }

      }

      this.notificationShow = true;
      setTimeout(() => {
        this.notificationShow = false;
        this.notificationInfo = {};
      },5000);

    }
  },
  watch: {
    employerName(text){
      const pattern = new RegExp(text, 'i');
      const allEmployers = this.$store.getters.getEmployers;
      this.employers = allEmployers.filter(i => {
        if(pattern.test(`${i.company}`)){
          return i;
        }
      });
    },
    workerName(text){
      const pattern = new RegExp(text, 'i');
      const allWorkers = this.workersEmployer.workers;
      this.employerWorkers = allWorkers.filter(i => {
        if(pattern.test(`${i.lastname} ${i.user.name}`)){
          return i;
        }
      });
    },
    workerNameNew(text){
      const pattern = new RegExp(text, 'i');
      const allWorkers = this.freeWorkers;
      this.workersList = allWorkers.filter(i => {
        if(pattern.test(`${i.lastname} ${i.user.name}`)){
          return i;
        }
      });
    }
  },
  created(){
    this.addWorkersToEmployer();

    eventBus.$on('employerAction', (action) => {
      this.showNotification(action);
    });
  }
}
</script>

<style scoped lang="scss">
@import "../../../sass/flexMixins.scss";
@import "../../../sass/elements.scss";

.employers-list-modal{
  @include flexColumn(flex-start, center);
  padding-top: 20px;

  .add-employer{
    @include flexColumn;
    margin: 20px 0 30px 0;

    button{
      @include buttonWhite;
      padding: 5px 10px;
      margin-bottom: 20px;
    }
  }

  .workers-to-edit{
    border: 1px solid black;
    margin: 20px 0;

    .title-panel{
      @include flexColumn;
      background: #fff;
      padding: 10px 0;
      border-bottom: 1px solid #000;
      min-width: 500px; 

      div{
        @include flexRow(space-between, center);
        width: 100%;
        margin-bottom: 10px;
        padding: 0 30px;

        h4{
          min-width: 130px;
        }

        button{
          @include buttonWhite;
          padding: 5px 10px;
        }
      }

      input{
        @include inputWhite;
      }

    }

    .new-workers-list{

      button{
        @include buttonWhite;
        padding: 3px 6px;
      }

      form{
        padding: 8px;
        background: #fff;
        border-bottom: 1px solid #000;

        input, select{
          @include inputWhite;
          min-width: 50px;
        }
        input{
          width: 105px;
          min-width: 105px;
        }

        &>*{
          @include flexRow(space-between, center);
          width: 100%;
        }

        .name-section{
          padding: 0 30px 0 20px;
          margin-bottom: 5px;
        }
      }

      &>div{
        max-height: 300px;
        overflow-y: auto;
      }

      li{
        @include flexRow(space-between, center);
        background: #fff;
        margin-top: 5px;
        padding: 5px 20px;
        border-top: 1px solid #000;
        border-bottom: 1px solid #000;
      }
    }

    .workers-list{
      max-height: 360px;
      overflow-y: auto;
      margin-top: 10px;

      li:last-child div{
        margin-bottom: 0;
      }
    }
  }

  .search-employer--form{
    @include flexColumn;
    margin-bottom: 20px;

    input{
      @include inputWhite;
      margin-top: 10px;
    }
  }

  .employer-list{

    .list-item{
      @include flexRow(space-between, center);
      margin-bottom: 5px;
      background: #fff;
      border: 1px solid #000;
      padding: 5px;

      .employer-info{
        @include flexColumn;

        div{
          @include flexRow(space-between, center);
          width: 550px;
          margin-bottom: 5px;
        }
      }

      .employer-workers{
        @include inputWhite;
        min-width: 600px;
        cursor: pointer;
      }

      .buttons{
        @include flexRow(space-around, center);
        flex-wrap: wrap;
        width: 150px;
        margin-left: 10px;

        button{
          @include buttonWhite;
          padding: 2px 8px;
          background: rgb(125, 204, 125);

          &:nth-child(2){
            background: rgb(253, 114, 114);
          }

          &:last-child{
            margin-top: 20px;
          }
        }
      }
    }
  }

}
</style>
