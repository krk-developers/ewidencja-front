import Vue from 'vue';
import Vuex from 'vuex';

const moment = require('moment');

Vue.use(Vuex);


export const store = new Vuex.Store({
  state: {
    logged: true,
    modalVisible: false,
    legendHoliday: [],
    legendLeave: []
  },
  // ----- getters -------------------------
  getters: {
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
    }
  },
  // ----- mutations -------------------------
  mutations: {
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
    }
  }
});
