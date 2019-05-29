<template>
  <div class="main-container">
    <nav class="nav">
      <div class="inner-nav">
        <button @click="$store.dispatch('toggleModal', 'sadmins-list')">Superadministratorzy</button>
        <button @click="$store.dispatch('toggleModal', 'admins-list')">Administratorzy</button>
        <button @click="$store.dispatch('toggleModal', 'employers-list')">Pracodawcy</button>
        <button @click="$store.dispatch('toggleModal', 'workers-list')">Pracownicy</button>
        <button @click="$store.dispatch('toggleModal', 'events-list')">Nieobecności</button>
        <button @click="$store.dispatch('toggleModal', 'add-event')">Dodaj Nieobecność</button>
        <!-- <button @click="$store.dispatch('toggleModal', 'add-holiday')">Zaznacz święto</button> -->
      </div>
    </nav>
    <div v-show="!$store.getters.getModalVisible" class="calendar-wrapper">
      <div class="calendar" id="calendar"></div>
    </div>
    <div class="modal-wrapper" v-if="$store.getters.getModalVisible === 'add-event'">
      <new-event></new-event>
    </div>
    <div class="modal-wrapper" v-if="$store.getters.getModalVisible === 'events-list'">
      <events-list></events-list>
    </div>
    <div class="modal-wrapper" v-if="$store.getters.getModalVisible === 'add-holiday'">
      <new-holiday></new-holiday>
    </div>
    <div class="modal-wrapper" v-if="$store.getters.getModalVisible === 'workers-list'">
      <workers-list></workers-list>
    </div>
    <div class="modal-wrapper" v-if="$store.getters.getModalVisible === 'employers-list'">
      <employers-list></employers-list>
    </div>
    <div class="modal-wrapper" v-if="$store.getters.getModalVisible === 'admins-list'">
      <admins-list></admins-list>
    </div>
    <div class="modal-wrapper" v-if="$store.getters.getModalVisible === 'sadmins-list'">
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
import { fixDownEndDate, fixUpEndDate } from '../store/modules.js'

import newEvent from './modals/newEvent.vue';
import eventsList from './modals/eventsList.vue';
import newHoliday from './modals/newHoliday.vue';
import workersList from './modals/workersList.vue';
import employersList from './modals/employersList.vue';
import adminsList from './modals/adminsList.vue';
import superadminsList from './modals/superadminsList.vue';


export default {
  components: {
    'new-event': newEvent,
    'events-list': eventsList,
    'new-holiday': newHoliday,
    'workers-list': workersList,
    'employers-list': employersList,
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
            const endDatesFixedForCalendar = vue.$store.getters.getEvents.map(event => {
              if(event.legend_name !== 'DZUW'){
                event.end = fixUpEndDate(event.end);
              }
              return event;
            });

            successCallback(endDatesFixedForCalendar);
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
          const confirm = window.confirm(`Usunąć nieobecność?\n${e.event.title}`);
          if(confirm){
            vue.$store.dispatch('deleteEvent', e.event.id);
          }
        },
        eventPositioned(e){
          e.el.classList.add(`event-id-${e.event.id}`);

          let title = '';
          const start = moment(e.event.start).format('DD-MM-YYYY');
          if(e.event.end){
            const end = moment(e.event.end).format('YYYY-MM-DD');
            title = `${e.event.title}\n${start}  -  ${fixDownEndDate(end)}`;
          }
          else{
            title = `${e.event.title}\n${start}`;
          }

          if(e.event.extendedProps.legend_name === 'DZUW'){
            e.el.classList.add('event-holiday');
          }

          e.el.setAttribute('title', title);
          
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
        },
        // select(e){ console.log(e); }
      });

      this.calendar.render();
      this.$store.commit('setCalendar', this.calendar);
    }
  },
  created(){
    this.$store.dispatch('fetchEvents');
    this.$store.dispatch('fetchLegend');
    this.$store.dispatch('fetchWorkers');
    this.$store.dispatch('fetchEmployers');
    this.$store.dispatch('fetchProvinces');
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
  min-width: 1000px;
  background: linear-gradient(lightblue, rgb(84, 166, 194));
  position: relative;

  .modal-wrapper{
    @include flexColumn(flex-start, center);
    position: absolute;
    z-index: 10;
    left: 0;
    top: 0;
    height: 800px;
    width: 100vw;
    background: linear-gradient(lightblue, rgb(84, 166, 194));

    .modal-window{
      width: 800px;
    }
  }

}

// all lists styles
ul{
  list-style-type: none;
}


.nav{
  @include flexRow;
  height: 60px;
  min-width: 1000px;

  .inner-nav{
    width: 1000px;
    @include flexRow;

    button{
      @include buttonWhite;
      padding: 5px 10px;
      margin: 0 10px;
    }
  }
}

.calendar-wrapper{
  position: relative;
  padding-bottom: 10px;

  .calendar{
    width: 1000px;
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
