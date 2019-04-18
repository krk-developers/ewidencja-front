import Vue from 'vue';
import Vuex from 'vuex';

const moment = require('moment');
import * as secretData from '../secretData.js';

import {eventBus} from '../main.js';
import legendData from '../data/legend.js';

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    logged: true,
    modalVisible: false,
    calendar: null,
    vue: null,
    legendHoliday: [],
    legendLeave: [],
    eventsArray: [],
    workersArray: [],
    adminsArray: [{id: 1, firstname: 'Mariola', lastname: 'Honkisz', pesel: 84675675647567, email: 'mariola@test.pl'}],
    superAdminsArray: [{id: 1, firstname: 'Monika', lastname: 'Hołymczuk', pesel: 25432634554, email: 'monikaholymczuk@test.pl'}]
  },
  // ----- getters -------------------------
  getters: {
    getCalendar(state){
      return state.calendar;
    },
    checkIfLogged(state){
      return !state.logged;
    },
    getModalVisible(state){
      return state.modalVisible;
    },
    getLegendHoliday(state){
      return state.legendHoliday;
    },
    getLegendLeave(state){
      return state.legendLeave;
    },
    getEvents(state){
      return state.eventsArray;
    },
    getWorkers(state){
      return state.workersArray;
    },
    getAdmins(state){
      return state.adminsArray;
    },
    getSuperAdmins(state){
      return state.superAdminsArray;
    }
  },
  // ----- mutations -------------------------
  mutations: {
    setCalendar(state, calendar){
      state.calendar = calendar;
    },
    userLoggedTrue(state){
      state.logged = true;
    },
    showModal(state, data){
      state.modalVisible = data;
    },
    hideModal(state){
      state.modalVisible = false;
    },
    setVue(state, vue){
      state.vue = vue;
    },
    setLegendHoliday(state, data){
      state.legendHoliday = data;
    },
    setLegendLeave(state, data){
      state.legendLeave = data;
    },
    setEvents(state, data){
      state.eventsArray = data;
    },
    setWorkers(state, workers){
      state.workersArray = workers;
    }
  },
  // ----- actions -------------------------
  actions: {
    userLogged(context){
      context.commit('userLoggedTrue');
    },
    showModal(context, data){
      context.commit('showModal', data);
    },
    hideModal(context){
      context.commit('hideModal');
    },
    setLegend(context, data){
      const legendHoliday = data.filter(i => i.working_day === 0);
      context.commit('setLegendHoliday', legendHoliday);

      const legendLeave = data.filter(i => i.working_day === 1);
      context.commit('setLegendLeave', legendLeave);
    },
    fetchWorkers(context){
      const url = secretData.getWorkers;
      context.state.vue.$http.get(url)
      .then(res => { context.commit('setWorkers', res.body.data) })
      .catch(err => { console.log(err); });

      // const u = '{"data":[{"id":6,"name":"Jan","lastname":"Bąkowski","email":"janek@onet.pl","pesel":763445637456,"role_display_name":"Pracownik"},{"id":7,"name":"Jan","lastname":"Kowalski","email":"kowal@wp.pl","pesel":74030704836,"role_display_name":"Pracownik"},{"id":8,"name":"Edward","lastname":"Nowak","email":"nowak@o2.pl","pesel":995030704555,"role_display_name":"Pracownik"}]}';
      // const workers = JSON.parse(u).data;
      // context.commit('setWorkers', workers);
    },
    fetchLegend(context){
      context.state.vue.$http.get(secretData.getLegend)
      .then(res => {
        // console.log(res);
        context.dispatch('setLegend', res.body.data);
      });

      // const legend = legendData;
      // context.dispatch('setLegend', legend.data);
    },
    fixEndDate(context, endDate){
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
    setVue(context, vue){
      context.commit('setVue', vue);
    },
    setCalendar(context, calendar){
      context.commit('setCalendar', calendar);
    },
    runFirebase(context){
      firebase.initializeApp(secretData.firebaseConfig);
      context.dispatch('fetchEvents');
    },
    fetchEvents(context){
      // firebase.database().ref('events')
      // .once('value', (res) => {
      //   // console.log('fetched from firebase');
      //   const events = JSON.parse(res.node_.value_);
      //   context.commit('setEvents', events.data);
      //   context.state.calendar.refetchEvents();
      // });

      context.state.vue.$http.get(secretData.getEvents)
      .then(res => {
        console.log(res.body.data);
          context.commit('setEvents', res.body.data);
          context.state.calendar.refetchEvents();
      })
    },
    sendEvents(context, events){
      const eventsArray = [];

      events.forEach((e) => {
        eventsArray.push({
          id: e.id,
          title: e.title,
          start: moment(e.start).format('YYYY-MM-DD'),
          end: moment(e.end).format('YYYY-MM-DD'),
          allDay: true,
          extendedProps: e.extendedProps
        });
      });

      const data = {data: eventsArray};
      firebase.database().ref('events').set(JSON.stringify(data));
    },
    addEvent(context, newEvent){
      const calendar = context.state.calendar;
      calendar.addEvent(newEvent);
      // const events = calendar.getEvents();
      // console.log(events);
      context.dispatch('sendEvent', newEvent);
    },
    sendEvent(context, newEvent){
      console.log(newEvent);
      const formatedEvent = {
        start: newEvent.start,
        end: newEvent.end,
        worker_id: newEvent.workerId,
        legend_id: newEvent.legendId,
        title: newEvent.title
      };

      context.state.vue.$http.post(secretData.postEvent, formatedEvent)
      .then(res => { console.log(res); })
      .catch(err => { console.log(err); });
    }
  }
});
