<template>
  <div class="employers-list-modal modal-window">
    <close-button></close-button>
    <h2>Lista Pracodawców</h2>
    <div class="add-employer">
      <button @click="addEmployerSwitch">{{addEmployerText}}</button>
      <div v-if="addEmployerOn">
        <add-employer-form></add-employer-form>
      </div>
    </div>
    <div v-if="editWorkers" class="workers-to-edit">
      <div class="title-panel">
        <div>
          <h4>{{workersEmployer.company}}</h4>
          <button @click="editWorkers = false">zamknij panel</button>
        </div>
        <label>
          Wyszukaj - podaj nazwisko lub imię
          <input type="search" v-model="workerName">
        </label>
      </div>
      <ul class="workers-list">
        <li v-for="worker in employerWorkers" :key="worker.id">
          <edit-employer-workers-form v-bind:worker="worker" v-bind:employer="workersEmployer"></edit-employer-workers-form>
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
  </div>
</template>

<script>
import closeButton from './modals-elements/closeButton.vue';
import addEmployerForm from './modals-elements/addEmployerForm.vue';
import editEmployerWorkersForm from './modals-elements/editEmployerWorkersForm.vue';

export default {
  components:{
    'close-button': closeButton,
    'add-employer-form': addEmployerForm,
    'edit-employer-workers-form': editEmployerWorkersForm
  },
  data(){
    return {
      employers: this.$store.getters.getEmployers,
      employerName: '',
      addEmployerOn: false,
      addEmployerText: 'Dodaj pracodawcę',
      editWorkers: false,
      workersEmployer: {},
      employerWorkers: [],
      workerName: ''
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
    editEmployerWorkers(e){
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
      console.log(`delete employer: id ${employerId}`);
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
    }
  },
  created(){
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
    // console.log(this.employers);

  }
}
</script>

<style scoped lang="scss">
@import "../../sass/flexMixins.scss";
@import "../../sass/elements.scss";

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

    .title-panel{
      @include flexColumn;
      background: #fff;
      padding: 10px 0 5px 0;
      border-bottom: 1px solid #000;

      div{
        @include flexRow;
        margin-bottom: 10px;

        button{
          @include buttonWhite;
          padding: 5px 10px;
          margin-left: 20px;
        }
      }

      input{
        @include inputWhite;
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
