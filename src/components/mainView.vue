<template>
  <div class="main-container">
    <nav class="nav">
      <button @click="$store.dispatch('showModal', 'sadmins-list')">Lista superadminów</button>
      <button @click="$store.dispatch('showModal', 'admins-list')">Lista adminów</button>
      <button @click="$store.dispatch('showModal', 'workers-list')">Lista pracowników</button>
      <button @click="$store.dispatch('showModal', 'events-list')">Lista Nieobecności</button>
      <button @click="$store.dispatch('showModal', 'add-event')">Dodaj nieobecność</button>
      <!-- <button @click="$store.dispatch('showModal', 'add-holiday')">Zaznacz święto</button> -->
    </nav>
    <div class="calendar-wrapper">
      <div class="calendar" id="calendar"></div>
    </div>
    <div v-if="$store.getters.getModalVisible === 'add-event'">
      <new-event></new-event>
    </div>
    <div v-if="$store.getters.getModalVisible === 'events-list'">
      <events-list></events-list>
    </div>
    <div v-if="$store.getters.getModalVisible === 'add-holiday'">
      <new-holiday></new-holiday>
    </div>
    <div v-if="$store.getters.getModalVisible === 'workers-list'">
      <workers-list></workers-list>
    </div>
    <div v-if="$store.getters.getModalVisible === 'admins-list'">
      <admins-list></admins-list>
    </div>
    <div v-if="$store.getters.getModalVisible === 'sadmins-list'">
      <superadmins-list></superadmins-list>
    </div>
  </div>
</template>

<script>
import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import '@fullcalendar/core/main.css';
import '@fullcalendar/daygrid/main.css';
import '@fullcalendar/list/main.css';

// import {eventBus} from '../main.js';
const moment = require('moment');

import newEvent from './modals/newEvent.vue';
import eventsList from './modals/eventsList.vue';
import newHoliday from './modals/newHoliday.vue';
import workersList from './modals/workersList.vue';
import adminsList from './modals/adminsList.vue';
import superadminsList from './modals/superadminsList.vue';

// import * as secretData from '../secretData.js';


export default {
  components: {
    'new-event': newEvent,
    'events-list': eventsList,
    'new-holiday': newHoliday,
    'workers-list': workersList,
    'admins-list': adminsList,
    'superadmins-list': superadminsList
  },
  data(){
    return {
      calendar: null,
      superAdmin: true
    }
  },
  methods: {
    runCalendar(){
      const vue = this;
      const calendarEl = document.getElementById('calendar');

      this.calendar = new Calendar(calendarEl, {
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
        events(info, successCallback, failureCallback){
          if(info){
            successCallback(vue.$store.getters.getEvents);
          }
          else{
            failureCallback();
          }
        },
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
          const confirm = window.confirm(`Czy na pewno chcesz usunąć nieobecność\n${e.event.title}?`);
          if(confirm){
            e.event.remove();
            // vue.$store.dispatch('sendEvents', vue.calendar.getEvents());
            vue.$store.dispatch('deleteEvent', e.event.id);
          }
        },
        eventPositioned(e){
          // console.log(e);

          // if(e.event.extendedProps.grandType === 'holiday'){
          //   e.el.classList.add('holiday-event');
          // }
          let title = '';
          const start = moment(e.event.start).format('DD-MM-YYYY');
          if(e.event.end){
            const end = moment(e.event.end).format('YYYY-MM-DD');
            title = `${e.event.title}\n${start}  -  ${vue.downEndDate(end)}`;
          }
          else{
            title = `${e.event.title}\n${start}`;
          }
          e.el.setAttribute('title', title);

          if(e.event.extendedProps.legend_name === 'DZUW'){
            e.el.classList.add('event-holiday');
          }

          if(e.isStart && !e.isEnd){
            e.el.classList.add('event-start');
          }
          if(!e.isStart && e.isEnd){
            e.el.classList.add('event-end');
          }
        }
        // select(e){ console.log(e); }
      });

      this.calendar.render();
      this.$store.commit('setCalendar', this.calendar);
    },
    downEndDate(endDate){
      const daysInMonth = moment(endDate.slice(0, 7), 'YYYY-MM').daysInMonth();
      let endDay = +endDate.slice(8);
      let endMonth = +endDate.slice(5, 7);
      let endYear = +endDate.slice(0, 4);

      if(endDay === 1){
        if(endMonth === 1){
          endYear--;
          endMonth = 12;
          endDay = 31;
        }
        else{
          endMonth--;
          endDay = daysInMonth;
        }
      }
      else{
        endDay--;
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
      
      const fixedEnd = `${endDay}-${endMonth}-${endYear}`;
      return fixedEnd;
    }
  },
  created(){
    this.$store.commit('setVue', this);
    this.$store.dispatch('fetchWorkers');
    this.$store.dispatch('fetchLegend');
    this.$store.dispatch('fetchEvents');
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

    .event-holiday{
      background: red;
      border: 1px solid red;
    }

    .event-start{
      border-right: 3px solid rgb(54, 235, 54);
    }
    .event-end{
      border-left: 3px solid rgb(54, 235, 54);
    }

  }
}

</style>
