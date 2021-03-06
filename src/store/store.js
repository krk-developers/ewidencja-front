import Vue from 'vue';
import Vuex from 'vuex';

import {eventBus} from '../main.js';
const moment = require('moment');
import * as secret from '../secretData.js';

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
    provincesArray: [],
    eventsArray: [],
    eventsFixed: false,
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
    getProvinces(state){
      return state.provincesArray;
    },
    getEvents(state){
      return state.eventsArray;
    },
    eventsFixed(state){
      return state.eventsFixed;
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
      // eventBus.$emit('getUserTypes');
    },
    setProvinces(state, data){
      state.provincesArray = data;
    },
    setEvents(state, data){
      state.eventsArray = data;
    },
    setEventsFixed(state, data){
      state.eventsFixed = data;
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
    fetchLegend(context){
      context.state.vue.$http.get(secret.getLegend)
      .then(res => {
        const legend = res.body.data.filter((i) => {
          return i.name !== 'DZUW';
        });
        const sortedLegend = legend.sort((a,b) => {
          return a.name.localeCompare(b.name);
        });
        context.commit('setLegend', sortedLegend);
      })
      .catch(err => { console.log(err); });

    },
    fetchUserTypes(context){
      context.state.vue.$http.get(secret.getUserTypes)
      .then(res => {
        context.commit('setUserTypes', res.body.data);
      })
      .catch(err => { console.log(err); });

    },
    fetchProvinces(context){
      context.state.vue.$http.get(secret.getProvinces)
      .then(res => {
        context.commit('setProvinces', res.body.data);
      })
      .catch(err => { console.log(err); });
    },
    //  events
    fetchEvents(context){
      context.state.vue.$http.get(secret.getEvents)
      .then(res => {
        const events = res.body.data;

        context.state.vue.$http.get(secret.getHolidays)
        .then(res => {
          const holidays = res.body.data;
          events.push(...holidays);
          context.commit('setEvents', events);
          context.commit('setEventsFixed', false);
          context.state.calendar.refetchEvents();
        })
        .catch(err => { console.log(err); });

      })
      .catch(err => { console.log(err); });

    },
    sendEvent(context, newEvent){
      const formatedEvent = {
        start: newEvent.start,
        end: newEvent.end,
        worker_id: newEvent.workerId,
        employer_id: newEvent.employerId,
        legend_id: newEvent.legendId,
        title: newEvent.title
      };

      context.state.vue.$http.post(secret.postEvent, formatedEvent)
      .then(res => {
        context.dispatch('fetchEvents'); 
        eventBus.$emit('newEventAction', 'added');
      })
      .catch(err => {
        console.log(err);
        if(err.body.errors && err.body.errors.legend_id){
          eventBus.$emit('newEventAction', err.body.errors.legend_id);
        }
        else{
          eventBus.$emit('newEventAction', 'error');
        }
      });

    },
    deleteEvent(context, id){
      const url = secret.deleteEvent + id;
      context.state.vue.$http.delete(url)
      .then(res => {
        context.dispatch('fetchEvents');
      })
      .catch(err => { console.log(err); });

    },
    //  workers
    fetchWorkers(context, actionType){
      const url = secret.getWorkers;
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
    addWorker(context, newUser){
      context.state.vue.$http.post(secret.postWorker, newUser)
      .then(res => {
        context.dispatch('fetchWorkers', 'added');
      })
      .catch(err => {
        console.log(err);
        // $on w komponencie workersList
        eventBus.$emit('workerAction', 'error');
      });
      
    },
    editWorker(context, user){
      context.state.vue.$http.put(secret.putWorker+user.id, user)
      .then(res => {
        context.dispatch('fetchWorkers', 'edited'); 
        // $on w komponencie workersList
      })
      .catch(err => {
        console.log(err);
        // $on w komponencie workersList
        eventBus.$emit('workerAction', 'error');
      });

    },
    deleteWorker(context, id){
      context.state.vue.$http.delete(secret.deleteWorker+id)
      .then(res => {
        context.dispatch('fetchWorkers', 'deleted');
      })
      .catch(err => {
        console.log(err);
        eventBus.$emit('workerAction', 'error');
      });

    },
    //  employers
    fetchEmployers(context, actionType){
      const url = secret.getEmployers;
      context.state.vue.$http.get(url)
      .then(res => {
        context.commit('setEmployers', res.body.data);
        // $on w komponencie employersList
        eventBus.$emit('employerAction', actionType);
      })
      .catch(err => { console.log(err); });

    },
    addEmployer(context, newEmployer){
      context.state.vue.$http.post(secret.postEmployer, newEmployer)
      .then(res => {
        context.dispatch('fetchEmployers', 'added');
      })
      .catch(err => {
        console.log(err);
        // $on w komponencie employersList
        eventBus.$emit('employerAction', 'error');
      });
      
    },
    editEmployer(context, employer){
      context.state.vue.$http.put(secret.putEmployer+employer.id, employer)
      .then(res => {
        context.dispatch('fetchEmployers', 'edited'); 
        // $on w komponencie employersList
      })
      .catch(err => {
        console.log(err);
        // $on w komponencie employersList
        eventBus.$emit('employerAction', 'error');
      });

    },
    deleteEmployer(context, id){
      context.state.vue.$http.delete(secret.deleteEmployer+id)
      .then(res => {
        context.dispatch('fetchEmployers', 'deleted');
      })
      .catch(err => {
        console.log(err);
        eventBus.$emit('employerAction', 'error');
      });

    },
    addWorkerToEmployer(context, newContract){
      context.state.vue.$http.post(`${secret.postEmployer}/${newContract.employer_id}/workers`, newContract)
      .then(res => {
        context.dispatch('fetchEmployers', 'workerAdded');
      })
      .catch(err => {
        console.log(err);
        // $on w komponencie employersList
        eventBus.$emit('employerAction', 'error');
      });

    },
    editWorkerToEmployer(context, newContract){
      context.state.vue.$http.put(`${secret.postEmployer}/${newContract.employer_id}/workers`, newContract)
      .then(res => {
        context.dispatch('fetchEmployers', 'workerEdited');
      })
      .catch(err => {
        console.log(err);
        // $on w komponencie employersList
        eventBus.$emit('employerAction', 'error');
      });

    },
    deleteWorkerFromEmployer(context, data){
      context.state.vue.$http.delete(`${secret.deleteEmployer}${data.employerId}/workers/${data.workerId}`)
      .then(res => {
        context.dispatch('fetchEmployers', 'workerDeleted');
      })
      .catch(err => {
        console.log(err);
        eventBus.$emit('employerAction', 'error');
      });

    }
  }
});
