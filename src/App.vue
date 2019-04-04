<template>
  <div id="app">
    <nav class="nav">
      <button @click="showEvents">show events</button>
      <button @click="newEventModal = 'add-event'">Dodaj nieobecność</button>
      <button @click="newEventModal = 'workers-list'">Lista pracowników</button>
    </nav>
    <div class="calendar-wrapper">
      <div class="calendar" id="calendar"></div>
    </div>
    <div v-if="newEventModal === 'add-event'">
      <new-event v-bind:workers="workers"></new-event>
    </div>
    <div v-if="newEventModal === 'workers-list'">
      <workers-list v-bind:workers="workers"></workers-list>
    </div>
  </div>
</template>

<script>
import {eventBus} from './main.js';

import newEvent from './components/newEvent.vue';
import workersList from './components/workersList.vue';

import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';

import '@fullcalendar/core/main.css';
import '@fullcalendar/daygrid/main.css';
import '@fullcalendar/list/main.css';

export default {
  name: 'app',
  components: {
    'new-event': newEvent,
    'workers-list': workersList
  },
  data(){
    return {
      calendar: false,
      eventsJSON: false,
      workers: false,
      newEventModal: false
    }
  },
  methods: {
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
    },
    getWorkers: function(){
      const url = 'https://ewidencja.vipserv.org/backend/public/api/workers';
      this.$http.get(url
      // , {headers:{
      //   'Origin': 'https://ewidencja.vipserv.org'
      //   }}
        ).then(res => {
          console.log(res.bodyText);
          return res.body;
        })
        .then(res => {console.log(res)});
    }
  },
  mounted(){
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
      // select(e){
      //   const date = new Date()
      //   // console.log(this);

      //   calendar.addEvent({
      //     title: 'new event',
      //     id: date.getTime(),
      //     allDay: true,
      //     start: e.startStr,
      //     end: e.endStr
      //   });
      // }
    });

    vue.calendar = calendar;
    calendar.render();
  },
  created(){
    this.workers = [{
      id: 1,
      name: 'Kamil',
      lastname: 'Sztefko',
      email: 'kamil@test.pl',
      pesel: 55664422789,
    }, {
      id: 2,
      name: 'Artur',
      lastname: 'Miłkowski',
      email: 'artur@test.pl',
      pesel: 44556677123,
    }];

    this.getWorkers();

    eventBus.$on('closeModal', () => {
      this.newEventModal = false;
    });

    eventBus.$on('addEvent', (data) => {
      const date = new Date();
      data.id = date.getTime();
      data.allDay = true;

      const worker = this.workers.find((w) => {
        if(w.pesel == data.pesel){
          return w;
        }
      });

      data.title = `${data.type} - ${worker.name} ${worker.surname} (${worker.pesel})`;

      console.log(data);
      this.calendar.addEvent(data);
    });
  }
}
</script>

<style lang="scss">
*{
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

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
