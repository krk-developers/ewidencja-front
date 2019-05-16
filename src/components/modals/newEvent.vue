<template>
  <div class="add-event-modal modal-window">
    <close-button></close-button>
    <form @submit.prevent="addEvent">
      <label for="worker">Pracownik</label>
      <select class="mb" id="worker" v-model="eWorkerId" required>
        <option v-for="worker in workers" :key="worker.id" :value="worker.id">{{worker.user.name}} {{worker.lastname}} ({{worker.pesel}})</option>
      </select>
      <label for="type">Typ nieobecności</label>
      <select class="mb" id="type" v-model="legendId" required>
        <option v-for="i in legend" :key="i.id" :value="i.id">{{i.name}}</option>
      </select>
      <label for="eStart">Dzień rozpoczęcia</label>
      <input class="mb" id="eStart" type="date" v-model="eStart" required>
      <label for="eEnd">Dzień zakończenia</label>
      <input class="mb" id="eEnd" type="date" v-model="eEnd" required>
      <button>Dodaj</button>
    </form>
    <ul>
      <li v-for="i in legend" :key="i.id">{{i.name}} - {{i.display_name}}</li>
    </ul>
  </div>
</template>

<script>
import closeButton from './modals-elements/closeButton.vue';
import {eventBus} from '../../main.js';

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

      newEvent.title = `${legendElem.name} - ${worker.user.name} ${worker.lastname} (${worker.pesel})`;

      this.$store.dispatch('fixEndDate', this.eEnd)
        .then(res => {
          newEvent.end = res;

          this.$store.dispatch('addEvent', newEvent);
          this.$store.dispatch('toggleModal', false);
      });
    }
  }
}
</script>

<style scoped lang="scss">
@import "../../sass/flexMixins.scss";
@import "../../sass/elements.scss";

.add-event-modal{
  @include flexColumn;

  form{
    display: flex;
    flex-direction: column;
    align-items: center;

    input, select{
      @include inputWhite;
    }

    .mb{
      margin-bottom: 15px;
    }

    button{
      @include buttonWhite;
      padding: 5px 10px;
    }
  }

  ul{
    margin-top: 50px;
    list-style-type: none;
  }
}
</style>
