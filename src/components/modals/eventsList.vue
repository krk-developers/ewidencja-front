<template>
  <div class="events-list-modal modal-window">
    <close-button></close-button>
    <form class="search-event--form">
      <label for="search-event--input">Wpisz imię i nazwisko</label>
      <input type="text" id="search-event--input" v-model="workerName">
    </form>
    <ul>
      <li v-for="event in currentEvents" :key="event.id">{{event.title}} | od: {{event.start}} do: {{event.end}}</li>
    </ul>
  </div>
</template>

<script>
import closeButton from './modals-elements/closeButton.vue';
// import {eventBus} from '../../main.js';

export default {
  components:{
    'close-button': closeButton
  },
  data(){
    return {
      leaveEvents: [],
      currentEvents: [],
      workerName: ''
    }
  },
  watch: {
    workerName(text){
      const pattern = new RegExp(text, 'i');
      this.currentEvents = this.leaveEvents.filter(i => {
        if(pattern.test(i.title)){
          return i;
        }
      });
    }
  },
  created(){
    this.leaveEvents = this.$store.getters.getEvents.filter(e => {
      if(e.legend_name !== 'DZUW'){
        return e;
      }
    });

    this.currentEvents = this.leaveEvents;
  }
}
</script>

<style lang="scss">
@import "../../sass/flexMixins.scss";
@import "../../sass/elements.scss";

.events-list-modal{
  @include flexColumn;

  .search-event--form{
    @include flexColumn;
    margin-bottom: 20px;

    input{
      @include inputWhite;
    }
  }
}

</style>
