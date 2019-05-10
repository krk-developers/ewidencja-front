<template>
  <div class="workers-list-modal modal-window">
    <close-button></close-button>
    <div class="add-worker">
      <button @click="addWorkerSwitch">{{addWorkerText}}</button>
      <div v-if="addWorkerOn">
        <add-user-form v-bind:userType="'worker'"></add-user-form>
      </div>
    </div>
    <form class="search-worker--form">
      <label for="search-worker--input">Wpisz imię i nazwisko</label>
      <input type="text" id="search-worker--input" v-model="workerName">
    </form>
    <ul class="workers-list">
      <li v-for="worker in workers" :key="worker.pesel">
        <span>{{worker.firstname}} {{worker.lastname}}, pesel: {{worker.pesel}}, email: {{worker.email}}</span>
        <button @click="deleteWorker" :data-id="worker.id">usuń</button>
      </li>
    </ul>
  </div>
</template>

<script>
import closeButton from './modals-elements/closeButton.vue';
import addUserForm from './modals-elements/addUserForm.vue';

export default {
  components:{
    'close-button': closeButton,
    'add-user-form': addUserForm
  },
  data(){
    return {
      workers: this.$store.getters.getWorkers,
      workerName: '',
      addWorkerOn: false,
      addWorkerText: 'Dodaj pracownika'
    }
  },
  methods: {
    addWorkerSwitch(){
      this.addWorkerOn = !this.addWorkerOn;
      if(this.addWorkerOn){
        this.addWorkerText = 'Zamknij panel';
      }
      else{
        this.addWorkerText = 'Dodaj pracownika';
      }
    },
    deleteWorker(e){
      const workerId = e.target.attributes['data-id'].value;
      console.log(`delete worker: id ${workerId}`);
    }
  },
  watch: {
    workerName(text){
      const pattern = new RegExp(text, 'i');
      const allWorkers = this.$store.getters.getWorkers;
      this.workers = allWorkers.filter(i => {
        if(pattern.test(`${i.firstname} ${i.lastname}`)){
          return i;
        }
      });
    }
  }
}
</script>

<style scoped lang="scss">
@import "../../sass/flexMixins.scss";
@import "../../sass/elements.scss";

.workers-list-modal{
  @include flexColumn(flex-start, center);
  padding-top: 50px;

  .add-worker{
    @include flexColumn;
    margin-bottom: 30px;

    button{
      @include buttonWhite;
      padding: 5px 10px;
      margin-bottom: 20px;
    }
  }

  .search-worker--form{
    @include flexColumn;
    margin-bottom: 20px;

    input{
      @include inputWhite;
    }
  }

  .workers-list{


    li{
      margin-bottom: 10px;

      button{
        @include buttonWhite;
        padding: 1px 6px;
        margin-left: 20px;
      }
    }
  }

}
</style>
