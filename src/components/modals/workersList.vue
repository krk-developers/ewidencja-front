<template>
  <div class="workers-list-modal">
    <button class='close-modal-btn' @click="$store.dispatch('hideModal')">X</button>
    <form class="search-worker--form">
      <label for="search-worker--input">Wpisz imię i nazwisko</label>
      <input type="text" id="search-worker--input" v-model="workerName">
    </form>
    <ul>
      <li v-for="worker in workers" :key="worker.pesel">
        {{worker.firstname}} {{worker.lastname}}, pesel: {{worker.pesel}}, email: {{worker.email}}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data(){
    return {
      workers: this.$store.getters.getWorkers,
      workerName: ''
    }
  },
  watch: {
    workerName(text){
      const pattern = new RegExp(text, 'i');
      const allWorkers = this.$store.getters.getWorkers;
      this.workers = allWorkers.filter(i => {
        if(pattern.test(`${i.name} ${i.lastname}`)){
          return i;
        }
      });
    }
  }
}
</script>

<style scoped lang="scss">
@import "../../sass/flexMixins.scss";

.workers-list-modal{
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

  .search-worker--form{
    @include flexColumn;
    margin-bottom: 20px;
  }

  li{
    margin-bottom: 10px;
  }

}
</style>
