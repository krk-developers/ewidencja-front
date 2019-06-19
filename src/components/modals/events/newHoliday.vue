<template>
  <div class="add-holiday-modal modal-window">
    <close-button></close-button>
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
import closeButton from '../modals-elements/closeButton.vue';

import {eventBus} from '../../../main.js';

export default {
  components:{
    'close-button': closeButton
  },
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
        grandType: 'holiday'
      };

      this.$store.dispatch('fixEndDate', this.eEnd)
      .then(res => {
        newHoliday.end = res;

        // eventBus.$emit('addEvent', newHoliday);
        this.$store.dispatch('addEvent', newHoliday);
        this.$store.dispatch('toggleModal', false);
      });
    }
  }
}
</script>

<style scoped lang="scss">
@import "../../../sass/flexMixins.scss";
@import "../../../sass/elements.scss";

.add-holiday-modal{
  @include flexColumn;

  form{
    display: flex;
    flex-direction: column;
    align-items: center;

    input{
      @include inputWhite;
    }

    .mb{
      margin-bottom: 15px;
    }

    button{
      @include buttonWhite;
      padding: 5px 10px;
    }
  }

  ul{
    margin-top: 50px;
    list-style-type: none;
  }
}
</style>
