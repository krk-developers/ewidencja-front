<template>
  <div class="events-list-modal">
    <button class='close-modal-btn' @click="$store.dispatch('hideModal')">X</button>
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
      leaveEvents: []
    }
  },
  beforeMount(){
    const events = this.$store.getters.getEvents;
    this.leaveEvents = events.filter(e => e.extendedProps.grandType === 'leave');
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
}

</style>
