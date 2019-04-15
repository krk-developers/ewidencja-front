import Vue from 'vue';
import Vuex from 'vuex';
import {eventBus} from '../main.js';

const moment = require('moment');
import * as secretData from '../secretData.js';

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    logged: true,
    modalVisible: false,
    calendar: null,
    legendHoliday: [],
    legendLeave: [],
    eventsArray: [],
    workersArray: []
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
      const legendHoliday = data.filter(i => i.type === 'holiday');
      context.commit('setLegendHoliday', legendHoliday);

      const legendLeave = data.filter(i => i.type === 'leave');
      context.commit('setLegendLeave', legendLeave);
    },
    fetchWorkers(context, workers){
      context.commit('setWorkers', workers);
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
    setCalendar(context, calendar){
      context.commit('setCalendar', calendar);
    },
    runFirebase(context){
      firebase.initializeApp(secretData.firebaseConfig);
      context.dispatch('fetchEvents');
    },
    fetchEvents(context){
      firebase.database().ref('events')
      .once('value', (res) => {
        // console.log('fetched from firebase');
        const events = JSON.parse(res.node_.value_);
        context.commit('setEvents', events.data);
        context.state.calendar.refetchEvents();
      });
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
    addEvent(context, event){
      const calendar = context.state.calendar;
      calendar.addEvent(event);
      const events = calendar.getEvents();
      console.log(events);
      context.dispatch('sendEvents', events);
    }
  }
});
