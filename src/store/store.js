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
    fetchWorkers(context, actionType){
      const url = secretData.getWorkers;
      context.state.vue.$http.get(url)
      .then(res => { 
        // sortowanie pracowników wg nazwiska
        const sortedWorkers = res.body.data.sort((a, b) => {
          return a.lastname.localeCompare(b.lastname);
        });
        context.commit('setWorkers', sortedWorkers);
        // $on w komponencie workersList
        eventBus.$emit('workerAction', actionType);
      })
      .catch(err => { console.log(err); });

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
        const legend = res.body.data.filter((i) => {
          return i.name !== 'DZUW';
        });
        const sortedLegend = legend.sort((a,b) => {
          return a.name.localeCompare(b.name);
        });
        context.commit('setLegend', sortedLegend);
      });
    },
    fetchUserTypes(context){
      context.state.vue.$http.get(secretData.getUserTypes)
      .then(res => {
        context.commit('setUserTypes', res.body.data);
      });
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
          context.dispatch('fetchWorkers', 'added');
        })
        .catch(err => {
          console.log(err);
          // $on w komponencie workersList
          eventBus.$emit('workerAction', 'error');
        });
      }

      // userType employer
      
    },
    editUser(context, user){
      // userType worker
      if(user.userType === 'worker'){
        context.state.vue.$http.put(`workers/${user.userData.id}`, user.userData)
        .then(res => {
          context.dispatch('fetchWorkers', 'edited'); 
          // $on w komponencie workersList
        })
        .catch(err => {
          console.log(err);
          // $on w komponencie workersList
          eventBus.$emit('workerAction', 'error');
        });
      }

      // userType employer

    },
    deleteUser(context, user){
      // userType worker
      if(user.userType === 'worker'){
        context.state.vue.$http.delete(`workers/${user.id}`)
        .then(res => {
          context.dispatch('fetchWorkers', 'deleted');
        })
        .catch(err => {
          console.log(err);
          eventBus.$emit('workerAction', 'error');
        });
      }

      // userType employer

    }
  }
});
