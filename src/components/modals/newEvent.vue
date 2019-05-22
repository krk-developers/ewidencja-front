<template>
  <div class="add-event-modal modal-window">
    <close-button></close-button>
    <h2>Dodaj Nieobecność</h2>
    <form @submit.prevent="addEvent">
      <label for="worker">Pracownik</label>
      <select class="input" id="worker" v-model="eWorkerId" required>
        <option v-for="worker in workers" :key="worker.id" :value="worker.id">{{worker.lastname}} {{worker.user.name}} ({{worker.pesel}})</option>
      </select>
      <label for="type">Typ nieobecności</label>
      <select class="input" id="type" v-model="legendId" required>
        <option v-for="i in legend" :key="i.id" :value="i.id">{{i.name}}</option>
      </select>
      <label for="eStart">Dzień rozpoczęcia</label>
      <input class="input" id="eStart" type="date" v-model="eStart" required>
      <label for="eEnd">Dzień zakończenia</label>
      <input class="input" id="eEnd" type="date" v-model="eEnd" required>
      <button>Dodaj</button>
    </form>
    <ul class="legend-list">
      <li class="legend-item" v-for="i in legend" :key="i.id">
        <span>{{i.name}}</span>
        <span>{{i.display_name}}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import closeButton from './modals-elements/closeButton.vue';
import { eventBus } from '../../main.js';
import { fixUpEndDate } from '../../store/modules.js';

export default {
  components:{
    'close-button': closeButton
  },
  data(){
    return {
      workers: this.$store.getters.getWorkers,
      legend: this.$store.getters.getLegendLeave,
      eWorkerId: null,
      legendId: null,
      eStart: null,
      eEnd: null
    }
  },
  methods: {
    addEvent(){
      const newEvent = {
        allDay: true,
        workerId: this.eWorkerId,
        start: this.eStart,
        // classNames: ['leave-event'],
        // grandType: 'leave'
      };

      // console.log(this.legend);

      const legendElem = this.legend.find(i => {
        if(i.id == this.legendId){
          return i;
        }
      });
      newEvent.legendId = legendElem.id;

      const worker = this.workers.find(w => {
        if(w.id == newEvent.workerId){
          return w;
        }
      });

      newEvent.title = `${legendElem.name} - ${worker.lastname} ${worker.user.name} (${worker.pesel})`;

      newEvent.end = fixUpEndDate(this.eEnd);
      this.$store.dispatch('sendEvent', newEvent);
      this.$store.dispatch('toggleModal', false);

    }
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
