import Vue from 'vue';
import Vuex from 'vuex';

import {eventBus} from '../main.js';

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    logged: false,
    modalVisible: false
  },
  // ----- getters -------------------------
  getters: {
    checkIfLogged(state){
      return !state.logged;
    },
    getModalVisible(state){
      return state.modalVisible;
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
    }
  }
});
