<template>
  <div class="add-event-modal">
    <button class='close-modal-btn' @click="$store.dispatch('hideModal')">X</button>
    <form @submit.prevent="addEvent">
      <label for="worker">Pracownik</label>
      <select class="mb" id="worker" v-model="ePesel" required>
        <option v-for="worker in workers" :key="worker.pesel" :value="worker.pesel">{{worker.name}} {{worker.lastname}} ({{worker.pesel}})</option>
      </select>
      <label for="type">Typ nieobecności</label>
      <select class="mb" id="type" v-model="eType" required>
        <option v-for="i in legend" :key="i.id" :value="i.name">{{i.name}}</option>
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
import {eventBus} from '../../main.js';

export default {
  props: ['workers'],
  data(){
    return {
      legend: null,
      ePesel: null,
      eType: null,
      eStart: null,
      eEnd: null
    }
  },
  methods: {
    addEvent(){
      const newEvent = {
        allDay: true,
        id: new Date().getTime(),
        pesel: this.ePesel,
        type: this.eType,
        start: this.eStart,
        type: 'leave'
      };

      const worker = this.workers.find((w) => {
        if(w.pesel == newEvent.pesel){
          return w;
        }
      });

      newEvent.title = `${newEvent.type} - ${worker.name} ${worker.lastname} (${worker.pesel})`;

      this.$store.dispatch('fixEndDate', this.eEnd)
        .then(res => {
          newEvent.end = res;

          eventBus.$emit('addEvent', newEvent);
          this.$store.dispatch('hideModal');
      });
    }
  },
  beforeMount(){
    this.legend = this.$store.getters.getLegendLeave;
  }
}
</script>

<style scoped lang="scss">
@import "../../sass/flexMixins.scss";

.add-event-modal{
  @include flexColumn;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 10;
  width: 100vw;
  height: 100vh;
  background: gray;

  .close-modal-btn{
    padding: 10px 20px;
    position: fixed;
    top: 10px;
    right: 10px;
  }

  form{
    display: flex;
    flex-direction: column;
    align-items: center;

    .mb{
      margin-bottom: 15px;
    }

    button{
      padding: 5px 10px;
    }
  }

  ul{
    margin-top: 50px;
    list-style-type: none;
  }
}
</style>
