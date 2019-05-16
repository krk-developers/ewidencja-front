<template>
  <div class="main-container">
    <nav class="nav">
      <div class="inner-nav">
        <button @click="$store.commit('showModal', 'sadmins-list')">Lista Superadminów</button>
        <button @click="$store.commit('showModal', 'admins-list')">Lista Adminów</button>
        <button @click="$store.commit('showModal', 'workers-list')">Lista Pracowników</button>
        <button @click="$store.commit('showModal', 'events-list')">Lista Nieobecności</button>
        <button @click="$store.commit('showModal', 'add-event')">Dodaj Nieobecność</button>
        <!-- <button @click="$store.commit('showModal', 'add-holiday')">Zaznacz święto</button> -->
      </div>
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

          e.el.classList.add(`event-id-${e.event.id}`);

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
        },
        eventMouseEnter(e){
          const events = Array.from(document.querySelectorAll(`.event-id-${e.event.id}`));
          events.map(el => {
            el.classList.add('event-hovered')
          });
        },
        eventMouseLeave(e){
          const events = Array.from(document.querySelectorAll(`.event-id-${e.event.id}`));
          events.map(el => {
            el.classList.remove('event-hovered')
          });
        }
        // select(e){ console.log(e); }
      });

      this.calendar.render();
      this.$store.commit('setCalendar', this.calendar);
      // this.eventsHover();
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
    },
    eventsHover(){
      const events = Array.from(document.querySelectorAll('a.fc-event'));
      
      console.log(events);
    }
  },
  created(){
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
@import "../sass/elements.scss";

.main-container{
  height: inherit;
  background: linear-gradient(lightblue, rgb(84, 166, 194));

  .modal-window{
    position: fixed;
    left: 0;
    top: 0;
    z-index: 10;
    width: 100vw;
    height: 100vh;
    background: linear-gradient(lightblue, rgb(84, 166, 194));
  }
}

// all lists styles
ul{
  list-style-type: none;
}


.nav{
  @include flexRow;
  // background: skyblue;
  height: 60px;

  .inner-nav{
    max-width: 1000px;
    min-width: 800px;
    @include flexRow(space-between, center);

    button{
      @include buttonWhite;
      padding: 5px 10px;
    }
  }
}

.calendar-wrapper{
  position: relative;

  .calendar{
    max-width: 1000px;
    margin: 0 auto;
    background: #fff;

    .fc-left{
      margin: 5px 0 0 15px;
    }
    .fc-right{
      margin: 5px 5px 0 0;
    }

    .fc-content{
      cursor: pointer;
    }

    .event-holiday{
      background: red;
      border: 1px solid red;
    }

    .event-hovered{
      background: rgb(49, 131, 49);
      border: 1px solid rgb(49, 131, 49);
    }

  }
}

</style>
