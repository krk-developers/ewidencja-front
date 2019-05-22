<template>
  <div class="events-list-modal modal-window">
    <close-button></close-button>
    <h2>Lista Nieobecności</h2>
    <form class="search-event--form">
      <label for="search-event--input">Wyszukaj - podaj imię, nazwisko, pesel lub typ nieobecności</label>
      <input type="text" id="search-event--input" v-model="workerName">
    </form>
    <ul>
      <li class="events-item" v-for="event in currentEvents" :key="event.id">
        <span>
          {{event.title}}
        </span>
        <span>
          {{event.start}}&#8195;&#8212;&#8195;{{fixEndDate(event.end)}}
        </span>
        </li>
    </ul>
  </div>
</template>

<script>
import closeButton from './modals-elements/closeButton.vue';
import { fixDownEndDate } from '../../store/modules.js'

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
  methods: {
    fixEndDate(end){
      const data = fixDownEndDate(end)
      const year = data.substr(6, 7);
      const month = data.substr(3, 2);
      const day = data.substr(0, 2);
      return `${year}-${month}-${day}`;
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
  padding-top: 20px;

  .search-event--form{
    @include flexColumn;
    margin: 20px 0;

    input{
      @include inputWhite;
      margin-top: 10px;
    }
  }

  .events-item{
    @include flexRow(space-between, center);
    border: 1px solid black;
    background: #fff;
    padding: 4px 10px;
    margin-bottom: 2px;

    span:first-child{
      margin-right: 50px;
    }
  }
}

</style>
