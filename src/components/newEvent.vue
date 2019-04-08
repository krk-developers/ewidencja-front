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
        <option v-for="type of types" :key="type" :value="type">{{type}}</option>
      </select>
      <label for="eStart">Dzień rozpoczęcia</label>
      <input class="mb" id="eStart" type="date" v-model="eStart" required>
      <label for="eEnd">Dzień zakończenia</label>
      <input class="mb" id="eEnd" type="date" v-model="eEnd" required>
      <button>Dodaj</button>
    </form>
    <ul>
      <li>UW - Urlop Wypoczynkowy</li>
      <li>UB - Urlop Bezpłatny</li>
      <li>UO - Urlop Okolicznościowy</li>
      <li>CH - Choroba</li>
      <li>OD - Opieka nad Dzieckiem</li>
      <li>OU - Obecność Usprawiedliwiona</li>
      <li>ON - Obecność Nieusprawiedliwiona</li>
      <li>UŻ - Urlop na Żądanie</li>
    </ul>
  </div>
</template>

<script>
import {eventBus} from '../main.js';
const moment = require('moment');

export default {
  props: ['workers'],
  data(){
    return {
      types: ['UW', 'UB', 'UO', 'CH', 'OD', 'OU', 'ON', 'UŻ'],
      ePesel: '',
      eType: '',
      eStart: '',
      eEnd: ''
    }
  },
  methods: {
    makeEndDate(endDate){
      const daysInMonth = moment(endDate.slice(0, 7), 'YYYY-MM').daysInMonth();
      let endDay = +endDate.slice(8);
      let endMonth = +endDate.slice(5, 7);
      let endYear = +endDate.slice(0, 4);

      if(endDay === daysInMonth){
        if(endMonth === 12){
          endYear++;
          endMonth = 1;
          endDay = 1;
        }
        else{
          endMonth++;
          endDay = 1;
        }
      }
      else{
        endDay++;
      }

      endYear = endYear.toString();
      endMonth = endMonth.toString();
      endDay = endDay.toString();
      if(endMonth.length === 1){
        endMonth = `0${endMonth}`;
      }
      if(endDay.length === 1){
        endDay = `0${endDay}`;
      }

      const fixedEnd = `${endYear}-${endMonth}-${endDay}`;
      return fixedEnd;
    },
    addEvent(){
      const newEvent = {
        pesel: this.ePesel,
        type: this.eType,
        start: this.eStart,
        end: this.makeEndDate(this.eEnd)
      };
      console.log(newEvent);
      eventBus.$emit('addEvent', newEvent);
      this.$store.dispatch('hideModal');
    }
  }
}
</script>

<style scoped lang="scss">
.add-event-modal{
  position: fixed;
  left: 0;
  top: 0;
  z-index: 10;
  width: 100vw;
  height: 100vh;
  background: gray;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

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
