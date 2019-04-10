<template>
  <div class="add-holiday-modal">
    <button class='close-modal-btn' @click="$store.dispatch('hideModal')">X</button>
    <form @submit.prevent="addHoliday">
      <label for="holiday">Nazwa święta</label>
      <input class="mb" type="text" name="holidayName" id="holiday" v-model="eName">
      <label for="eStart">Dzień rozpoczęcia</label>
      <input class="mb" id="eStart" type="date" v-model="eStart" required>
      <label for="eEnd">Dzień zakończenia</label>
      <input class="mb" id="eEnd" type="date" v-model="eEnd" required>
      <button>Dodaj</button>
    </form>
  </div>
</template>

<script>
import {eventBus} from '../../main.js';

export default {
  data(){
    return {
      eName: null,
      eStart: null,
      eEnd: null
    }
  },
  methods: {
    addHoliday(){
      const newHoliday = {
        allDay: true,
        id: new Date().getTime(),
        title: this.eName,
        start: this.eStart,
        color: 'red',
        type: 'holiday'
      };

    this.$store.dispatch('fixEndDate', this.eEnd)
    .then(res => {
      newHoliday.end = res;

      eventBus.$emit('addEvent', newHoliday);
      this.$store.dispatch('hideModal');
    });
    }
  }
}
</script>

<style scoped lang="scss">
@import "../../sass/flexMixins.scss";

.add-holiday-modal{
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

  form{
    display: flex;
    flex-direction: column;
    align-items: center;

    .mb{
      margin-bottom: 15px;
    }

    button{
      padding: 5px 10px;
    }
  }

  ul{
    margin-top: 50px;
    list-style-type: none;
  }
}
</style>
