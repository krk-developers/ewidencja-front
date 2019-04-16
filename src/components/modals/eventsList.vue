<template>
  <div class="events-list-modal">
    <button class='close-modal-btn' @click="$store.dispatch('hideModal')">X</button>
    <form class="search-event--form">
      <label for="search-event--input">Wpisz imię i nazwisko</label>
      <input type="text" id="search-event--input" v-model="workerName">
    </form>
    <ul>
      <li v-for="event in leaveEvents" :key="event.id">{{event.title}} | od: {{event.start}} do: {{event.end}}</li>
    </ul>
  </div>
</template>

<script>
// import {eventBus} from '../../main.js';

export default {
  data(){
    return {
      leaveEvents: this.$store.getters.getEvents.filter(e => e.extendedProps.grandType === 'leave'),
      workerName: ''
    }
  },
  watch: {
    workerName(text){
      const pattern = new RegExp(text, 'i');
      const allEvents = this.$store.getters.getEvents.filter(e => e.extendedProps.grandType === 'leave');
      this.leaveEvents = allEvents.filter(i => {
        if(pattern.test(i.title)){
          return i;
        }
      });
    }
  }
}
</script>

<style lang="scss">
@import "../../sass/flexMixins.scss";

.events-list-modal{
  @include flexColumn;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 10;
  width: 100vw;
  height: 100vh;
  background: gray;
  
  
  .close-modal-btn{
    padding: 10px 20px;
    position: fixed;
    top: 10px;
    right: 10px;
  }

  .search-event--form{
    @include flexColumn;
    margin-bottom: 20px;
  }
}

</style>
