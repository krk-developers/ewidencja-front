import Vue from 'vue';
import Vuex from 'vuex';

import {eventBus} from '../main.js';
const moment = require('moment');
import * as secretData from '../secretData.js';

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    currentView: 'main-view',
    modalVisible: false,
    calendar: null,
    vue: null,
    legendHoliday: [],
    legendLeave: [],
    userTypes: [],
    eventsArray: [],
    workersArray: [],
    employersArray: [],
    adminsArray: [{id: 1, firstname: 'Mariola', lastname: 'Honkisz', pesel: 84675675647567, email: 'mariola@test.pl'}],
    superAdminsArray: [{id: 1, firstname: 'Monika', lastname: 'Hołymczuk', pesel: 25432634554, email: 'monikaholymczuk@test.pl'}]
  },
  // ----- getters -------------------------
  getters: {
    getCalendar(state){
      return state.calendar;
    },
    getCurrentView(state){
      return state.currentView;
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
    getUserTypes(state){
      return state.userTypes;
    },
    getEvents(state){
      return state.eventsArray;
    },
    getWorkers(state){
      return state.workersArray;
    },
    getEmployers(state){
      return state.employersArray;
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
    setCurrentView(state, data){
      state.currentView = data;
    },
    toggleModal(state, data){
      state.modalVisible = data;
    },
    setVue(state, vue){
      state.vue = vue;
    },
    setLegend(state, data){
      state.legendLeave = data;
    },
    setLegendHoliday(state, data){
      // state.legendHoliday = data;
    },
    setLegendLeave(state, data){
      // state.legendLeave = data;
    },
    setUserTypes(state, data){
      state.userTypes = data;
      eventBus.$emit('getUserTypes');
    },
    setEvents(state, data){
      state.eventsArray = data;
    },
    setWorkers(state, workers){
      state.workersArray = workers;
    },
    setEmployers(state, employers){
      state.employersArray = employers;
    }
  },
  // ----- actions -------------------------
  actions: {
    toggleModal(context, data){
      const html = document.querySelector('html');
      if(!data){
        html.style.overflowX = 'auto';
        context.commit('toggleModal', data);
      }
      else{
        html.style.overflowX = 'hidden';
        context.commit('toggleModal', data);
      }
    },
    setLegend(context, data){
      // const legendHoliday = data.filter(i => i.working_day === 0);
      // context.commit('setLegendHoliday', legendHoliday);

      // const legendLeave = data.filter(i => i.working_day === 1);
      // context.commit('setLegendLeave', legendLeave);
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
    fetchEmployers(context){
      const url = secretData.getEmployers;
      context.state.vue.$http.get(url)
      .then(res => { context.commit('setEmployers', res.body.data) })
      .catch(err => { console.log(err); });

      // const u = '{"data":[{"id":6,"name":"Jan","lastname":"Bąkowski","email":"janek@onet.pl","pesel":763445637456,"role_display_name":"Pracownik"},{"id":7,"name":"Jan","lastname":"Kowalski","email":"kowal@wp.pl","pesel":74030704836,"role_display_name":"Pracownik"},{"id":8,"name":"Edward","lastname":"Nowak","email":"nowak@o2.pl","pesel":995030704555,"role_display_name":"Pracownik"}]}';
      // const workers = JSON.parse(u).data;
      // context.commit('setWorkers', workers);
    },
    fetchLegend(context){
      context.state.vue.$http.get(secretData.getLegend)
      .then(res => {
        // console.log(res);
        context.commit('setLegend', res.body.data);
      });

      // const legend = legendData;
      // context.dispatch('setLegend', legend.data);
    },
    fetchUserTypes(context){
      context.state.vue.$http.get(secretData.getUserTypes)
      .then(res => {
        context.commit('setUserTypes', res.body.data);
      });
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
    fetchEvents(context){

      context.state.vue.$http.get(secretData.getEvents)
      .then(res => {
        const events = res.body.data;

        context.state.vue.$http.get(secretData.getHolidays)
        .then(res => {
          const holidays = res.body.data;
          events.push(...holidays);
          context.commit('setEvents', events);
          context.state.calendar.refetchEvents();
        });

      })
    },
    sendEvent(context, newEvent){
      const formatedEvent = {
        start: newEvent.start,
        end: newEvent.end,
        worker_id: newEvent.workerId,
        legend_id: newEvent.legendId,
        title: newEvent.title
      };

      context.state.vue.$http.post(secretData.postEvent, formatedEvent)
      .then(res => {
        context.dispatch('fetchEvents'); 
      })
      .catch(err => { console.log(err); });
    },
    deleteEvent(context, id){
      const url = secretData.deleteEvent + id;
      context.state.vue.$http.delete(url)
      .then(res => {
        context.dispatch('fetchEvents');
      })
      .catch(err => { console.log(err); });
    },
    sendUser(context, newUser){
      // userType worker
      if(newUser.userType === 'worker'){
        context.state.vue.$http.post('workers', newUser.userData)
        .then(res => {
          context.dispatch('fetchWorkers'); 
          // $on w komponencie workersList
          eventBus.$emit('workerAdd', true, false, newUser.userData);
        })
        .catch(err => {
          console.log(err);
          // $on w komponencie workersList
          eventBus.$emit('workerAdd', false);
        });
      }

      // userType employer
      
    },
    editUser(context, user){
      // userType worker
      if(user.userType === 'worker'){
        context.state.vue.$http.put(`workers/${user.userData.id}`, user.userData)
        .then(res => {
          context.dispatch('fetchWorkers'); 
          // $on w komponencie workersList
          eventBus.$emit('workerAdd', true, true);
        })
        .catch(err => {
          console.log(err);
          // $on w komponencie workersList
          eventBus.$emit('workerAdd', false);
        });
      }

      // userType employer

    },
    deleteUser(context, user){
      // userType worker
      if(user.userType === 'worker'){
        context.state.vue.$http.delete(`workers/${user.id}`)
        .then(res => {
          context.dispatch('fetchWorkers');
          eventBus.$emit('deleteWorkerSuccess', user.id);
        })
        .catch(err => console.log(err));
      }

      // userType employer

    }
  }
});
