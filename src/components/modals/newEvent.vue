<template>
  <div class="add-event-modal modal-window">
    <close-button></close-button>
    <h2>Dodaj Nieobecność</h2>
    <form @submit.prevent="addEvent">
      <label class="worker-label" for="workerAddEvent">Pracownik
        <select class="input" id="workerAddEvent" v-model="eWorkerId" required>
          <option v-for="worker in workers" :key="worker.id" :value="worker.id">{{worker.lastname}} {{worker.user.name}} ({{worker.pesel}})</option>
        </select>
      </label>
      <label class="employer-label" for="employerAddEvent">Pracodawca
        <select class="input" id="employerAddEvent" v-model="eEmployerId" required>
          <option v-for="employer in employers" :key="employer.id" :value="employer.id">
            {{employer.company}}</option>
        </select>
      </label>
      <label class="type-label" for="type">Typ nieobecności
        <select class="input" id="type" v-model="legendId" required>
          <option v-for="i in legend" :key="i.id" :value="i.id">{{i.name}}</option>
        </select>
      </label>
      <label for="eStart">Dzień rozpoczęcia
        <input class="input" id="eStart" type="date" v-model="eStart" required>
      </label>
      <label for="eEnd">Dzień zakończenia
        <input class="input" id="eEnd" type="date" v-model="eEnd" required>
      </label>
      <button>Dodaj</button>
    </form>
    <ul class="legend-list">
      <li class="legend-item" v-for="i in legend" :key="i.id">
        <span>{{i.name}}</span>
        <span>{{i.display_name}}</span>
      </li>
    </ul>
    <div v-if="notificationShow">
      <notification :notification="notificationInfo"></notification>
    </div>
  </div>
</template>

<script>
import closeButton from './modals-elements/closeButton.vue';
import notification from './modals-elements/notification.vue';
import { eventBus } from '../../main.js';
import { fixUpEndDate } from '../../store/modules.js';

export default {
  components:{
    'close-button': closeButton,
    notification
  },
  data(){
    return {
      workers: this.$store.getters.getWorkers,
      employers: this.$store.getters.getEmployers,
      legend: this.$store.getters.getLegendLeave,
      eWorkerId: null,
      eEmployerId: null,
      legendId: null,
      eStart: null,
      eEnd: null,
      notificationShow: false,
      notificationInfo: {},
    }
  },
  methods: {
    addEvent(){
      const newEvent = {
        allDay: true,
        workerId: this.eWorkerId,
        employerId: this.eEmployerId,
        start: this.eStart,
      };

      const legendElem = this.legend.find(i => {
        if(i.id == this.legendId){
          return i;
        }
      });
      newEvent.legendId = legendElem.id;

      const worker = this.workers.find(worker => {
        if(worker.id == newEvent.workerId){
          return worker;
        }
      });

      const employer = this.employers.find(employer => {
        if(employer.id == newEvent.employerId){
          return employer;
        }
      });

      newEvent.title = `${legendElem.name} - ${worker.lastname} ${worker.user.name} (${worker.pesel}) - ${employer.company}`;

      newEvent.end = fixUpEndDate(this.eEnd);
      this.$store.dispatch('sendEvent', newEvent);

    },
    showNotification(action){
      if(action === 'added'){
        this.notificationInfo.message = 'Dodano nieobecność.';
        this.eWorkerId = null;
        this.eEmployerId = null;
        this.legendId = null;
        this.eStart = null;
        this.eEnd = null;
      }
      else if(action === 'error'){
        this.notificationInfo.message = 'Wystąpił błąd po stronie serwera.';
        this.notificationInfo.error = true;
      }
      else{
        this.notificationInfo.message = action[0];
      }

      this.notificationShow = true;
      setTimeout(() => {
        this.notificationShow = false;
        this.notificationInfo = {};
      },5000);
    }
  },
  watch: {
    eWorkerId(id){
      if(id){
        const worker = this.workers.find(worker => {
          return worker.id === +id;
        });

        if(worker.employers.length >= 1){
          this.employers = worker.employers;
        }
        else{
          this.employers = [{company: 'Brak pracodawców'}];
        }

      }
      else{
        this.employers = this.$store.getters.getEmployers;
      }
    }
  },
  created(){
    eventBus.$on('newEventAction', (action) => {
      this.showNotification(action);
    });
  }
}
</script>

<style scoped lang="scss">
@import "../../sass/flexMixins.scss";
@import "../../sass/elements.scss";

.add-event-modal{
  @include flexColumn;
  padding-top: 20px;

  form{
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 20px;

    input, select{
      @include inputWhite;
    }

    .input{
      margin: 5px 0 15px 0;
    }

    button{
      @include buttonWhite;
      padding: 5px 10px;
    }

    .worker-label{
      margin-left: 140px;
    }
    .employer-label{
      margin-left: 46px;
    }
    .type-label{
      margin-left: 10px;
    }

  }

  .legend-list{
    height: 40vh;
    margin-top: 50px;
    overflow-y: scroll;
    list-style-type: none;

    .legend-item{
      @include flexRow(flex-start, center);
      border: 1px solid black;
      background: #fff;
      padding: 4px 10px;

      span:first-child{
        width: 120px;
      }
    }
  }
}
</style>
