<template>
  <div class="main-container">
    <nav class="nav">
      <button @click="getEvents">Lista Nieobecności</button>
      <button @click="$store.dispatch('showModal', 'add-event')">Dodaj nieobecność</button>
      <button @click="$store.dispatch('showModal', 'workers-list')">Lista pracowników</button>
      <button @click="$store.dispatch('showModal', 'add-holiday')">Zaznacz święto</button>
    </nav>
    <div class="calendar-wrapper">
      <div class="calendar" id="calendar"></div>
    </div>
    <div v-if="$store.getters.getModalVisible === 'add-event'">
      <new-event v-bind:workers="workers"></new-event>
    </div>
    <div v-if="$store.getters.getModalVisible === 'events-list'">
      <events-list v-bind:eventsList="eventsList"></events-list>
    </div>
    <div v-if="$store.getters.getModalVisible === 'workers-list'">
      <workers-list v-bind:workers="workers"></workers-list>
    </div>
    <div v-if="$store.getters.getModalVisible === 'add-holiday'">
      <new-holiday v-bind:workers="workers"></new-holiday>
    </div>
  </div>
</template>

<script>
import {eventBus} from '../main.js';

import newEvent from './modals/newEvent.vue';
import eventsList from './modals/eventsList.vue';
import workersList from './modals/workersList.vue';
import newHoliday from './modals/newHoliday.vue';

import legendData from '../data/legend.js';
import * as secretData from '../secretData.js';
const moment = require('moment');

import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';

import '@fullcalendar/core/main.css';
import '@fullcalendar/daygrid/main.css';
import '@fullcalendar/list/main.css';

export default {
  components: {
    'new-event': newEvent,
    'events-list': eventsList,
    'workers-list': workersList,
    'new-holiday': newHoliday
  },
  data(){
    return {
      calendar: false,
      eventsList: false,
      workers: false
    }
  },
  methods: {
    runCalendar(){
      const vue = this;
      const calendarEl = document.getElementById('calendar');

      const calendar = new Calendar(calendarEl, {
        plugins: [ dayGridPlugin, interactionPlugin, listPlugin ],
        defaultView: 'dayGridMonth',
        locale: 'pl',
        timeZone: 'local',
        // selectable: true,
        eventLimit: true,
        firstDay: 1,
        fixedWeekCount: false,
        width: 1200,
        // weekNumbers: true,
        // weekends: false,
        header: {
          left: 'title',
          right: 'prev,today,next'
        },
        // events: 'https://fullcalendar.io/demo-events.json',
        columnHeaderText(date){
          if(date.getDay() === 1){ return 'Poniedziałek' }
          else if(date.getDay() === 2){ return 'Wtorek' }
          else if(date.getDay() === 3){ return 'Środa' }
          else if(date.getDay() === 4){ return 'Czwartek' }
          else if(date.getDay() === 5){ return 'Piątek' }
          else if(date.getDay() === 6){ return 'Sobota' }
          else if(date.getDay() === 0){ return 'Niedziela' }
        },
        eventClick(e){
          const confirm = window.confirm('Czy na pewno chcesz usunąć nieobecność?');
          if(confirm){
            e.event.remove();
          }
        },
        // select(e){ console.log(e); }
      });

      vue.calendar = calendar;
      calendar.render();
    },
    getLegend(){
      // this.$http.get('https://ewidencja.vipserv.org/backend/public/api/legends')
      //   .then(res => {
      //     console.log(res);
      //   });

      const legend = legendData;

      this.$store.dispatch('setLegend', legend.data);
    },
    getWorkers(){
      const url = secretData.getWorkers;
      this.$http.get(url)
        .then(res => { this.workers = res.body.data })
        .catch(err => { console.log(err); });
    },
    getEvents(){
      const events = this.calendar.getEvents();
      const eventsArray = [];
      // console.log(events);
      events.forEach((e) => {
        // console.log(e.id);
        eventsArray.push({
          id: e.id,
          title: e.title,
          start: moment(e.start).format('DD-MM-YYYY'),
          end: moment(e.end).format('DD-MM-YYYY'),
          allDay: true,
          extendedProps: e.extendedProps
        });
      });

      this.eventsList = eventsArray;
      console.log(eventsArray);

      this.$store.dispatch('showModal', 'events-list');
    }
  },
  created(){
    this.getWorkers();
    this.getLegend();

    eventBus.$on('addEvent', (data) => {
      this.calendar.addEvent(data);
    });
  },
  mounted(){
    this.runCalendar();
  }
}
</script>

<style lang="scss">
@import "../sass/flexMixins.scss";

.nav{
  @include flexRow;
  background: lightblue;
  height: 50px;
  margin-bottom: 5px;

  button{
    padding: 5px 10px;
  }
}

.calendar-wrapper{
  position: relative;

  .calendar{
    max-width: 1000px;
    margin: 0 auto;

    .fc-content{
      cursor: pointer;
    }
  }
}

</style>
