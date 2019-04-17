<template>
  <div class="workers-list-modal">
    <button class='close-modal-btn' @click="$store.dispatch('hideModal')">X</button>
    <div class="add-worker">
      <button @click="addWorkerSwitch">{{addWorkerText}}</button>
      <form @submit.prevent="addWorker" class="add-worker--form" v-if="addWorkerOn">
        <label for="worker-firstname">imię <input id="worker-firstname" type="text" v-model="wFirstname" required></label>
        <label for="worker-lastname">nazwisko <input id="worker-lastname" type="text" v-model="wLastname" required></label>
        <label for="worker-pesel">pesel <input id="worker-pesel" type="text" v-model="wPesel" required></label>
        <label for="worker-email">email <input id="worker-email" type="email" v-model="wEmail" required></label>
        <button type="submit">Dodaj</button>
      </form>
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
export default {
  data(){
    return {
      workers: this.$store.getters.getWorkers,
      workerName: '',
      addWorkerOn: false,
      addWorkerText: 'Dodaj pracownika',
      wFirstname: '',
      wLastname: '',
      wPesel: '',
      wEmail: ''
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
    addWorker(){
      const newWorker = {
        firstname: this.wFirstname,
        lastname: this.wLastname,
        pesel: this.wPesel,
        email: this.wEmail
      };

      console.log(newWorker);

      // fetchWorkers
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
  @include flexColumn(start, center);
  position: fixed;
  left: 0;
  top: 0;
  z-index: 10;
  width: 100vw;
  height: 100vh;
  padding-top: 50px;
  background: gray;

  .close-modal-btn{
    padding: 10px 20px;
    position: fixed;
    top: 10px;
    right: 10px;
  }

  .add-worker{
    @include flexColumn;
    margin-bottom: 30px;

    .add-worker--form{
      @include flexColumn;
    }
  }

  .search-worker--form{
    @include flexColumn;
    margin-bottom: 20px;
  }

  .workers-list{


    li{
      margin-bottom: 10px;

      button{
        padding: 1px 6px;
        margin-left: 20px;
      }
    }
  }

}
</style>
