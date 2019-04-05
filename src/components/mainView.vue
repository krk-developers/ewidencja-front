<template>
  <div class="main-container">
    <nav class="nav">
      <button @click="showEvents">show events</button>
      <button @click="$store.dispatch('showModal', 'add-event')">Dodaj nieobecność</button>
      <button @click="$store.dispatch('showModal', 'workers-list')">Lista pracowników</button>
    </nav>
    <div class="calendar-wrapper">
      <div class="calendar" id="calendar"></div>
    </div>
    <div v-if="$store.getters.getModalVisible === 'add-event'">
      <new-event v-bind:workers="workers"></new-event>
    </div>
    <div v-if="$store.getters.getModalVisible === 'workers-list'">
      <workers-list v-bind:workers="workers"></workers-list>
    </div>
  </div>
</template>

<script>
import {eventBus} from '../main.js';

import newEvent from './newEvent.vue';
import workersList from './workersList.vue';

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
    'workers-list': workersList
  },
  data(){
    return {
      calendar: false,
      eventsJSON: false,
      workers: false,
      modalVisible: false
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
        // selectable: true,
        eventLimit: true,
        firstDay: 1,
        fixedWeekCount: false,
        width: 1200,
        // weekNumbers: true,
        // weekends: false,
        header: {
          left: 'listMonth,dayGridMonth',
          center: 'title',
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
          // console.log(e);
          e.event.remove();
        },
        // select(e){}
      });

      vue.calendar = calendar;
      calendar.render();
    },
    getWorkers: function(){
      // const url = 'https://ewidencja.vipserv.org/backend/public/api/workers';
      // this.$http.get(url
      // // , {headers:{
      // //   'Origin': 'https://ewidencja.vipserv.org'
      // //   }}
      //   ).then(res => {
      //     console.log(res.bodyText);
      //     return res.body;
      //   })
      //   .then(res => {console.log(res)});

      const workersJSON = '{"data":[{"id":4,"name":"Jan","lastname":"Kowalski","email":"janek@onet.pl","pesel":62040404835,"role_display_name":"Pracownik"},{"id":5,"name":"Jan","lastname":"Kowalski","email":"kowal@wp.pl","pesel":74030704836,"role_display_name":"Pracownik"},{"id":6,"name":"Edward","lastname":"Nowak","email":"nowak@o2.pl","pesel":995030704555,"role_display_name":"Pracownik"}]}';

      this.workers = JSON.parse(workersJSON).data;
    },
    addEvent(data){
      const date = new Date();
      data.id = new Date().getTime();
      data.allDay = true;

      const worker = this.workers.find((w) => {
        if(w.pesel == data.pesel){
          return w;
        }
      });

      data.title = `${data.type} - ${worker.name} ${worker.lastname} (${worker.pesel})`;

      // console.log(data);
      this.calendar.addEvent(data);
    },
    showEvents(){
      const events = this.calendar.getEvents();
      const je = [];
      // console.log(events);
      events.forEach((e) => {
        // console.log(e.id);
        je.push({
          id: e.id,
          title: e.title,
          start: e.start,
          end: e.end,
          allDay: true
        });
      });

      this.eventsJSON = JSON.stringify(je);
      console.log(this.eventsJSON);
    }
  },
  created(){
    this.getWorkers();

    eventBus.$on('addEvent', (data) => {
      this.addEvent(data);
    });
  },
  mounted(){
    this.runCalendar();
  }
}
</script>

<style lang="scss">

.nav{
  background: lightblue;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
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
