<template>
  <div class="edit-worker-form">
    <div class="name-section">
      <span>{{worker.lastname}} {{worker.user.name}} ({{worker.pesel}})</span>
      <label for="part-time">wymiar etatu
        <select name="partTime" id="part-time" v-model="partTime" :value="worker.part_time" :disabled="editDisabled" title="wymiar etatu pracownika">
          <option value="1">1</option>
          <option value="0.75">0.75</option>
          <option value="0.5">0.5</option>
          <option value="0.25">0.25</option>
        </select>
      </label>
    </div>
    <div class="contract">
      <label for="">umowa od: <input type="text" v-model="contractFrom" value="worker.contract_from" :disabled="editDisabled" title="data rozpoczęcia umowy"></label>
      <label for="">do: <input type="text" v-model="contractTo" value="worker.contract_to" :disabled="editDisabled" title="data zakończenia umowy"></label>
    </div>
    <div class="buttons">
      <button @click="saveWorkerChanges()" :disabled="editDisabled">Zapisz zmiany</button>
      <button @click="editWorker(worker)">{{ editText }}</button>
      <button @click="deleteWorker(worker.id)">zwolnij pracownika</button>
    </div>
  </div>
</template>

<script>
import { eventBus } from '../../../main.js';
// import { setTimeout } from 'timers';

export default {
  props: ['worker', 'employer'],
  data(){
    return{
      // workers: [],
      partTime: '',
      contractFrom: '',
      contractTo: '',
      editDisabled: true,
      editText: 'edytuj umowę pracownika'
    }
  },
  methods: {
    saveWorkerChanges(){
      const editedContract = {
        employer_id: this.employer.id,
        worker_id: this.worker.id,
        part_time: this.partTime,
        contract_from: this.contractFrom,
        contract_to: this.contractTo
      };
      console.log("TCL: saveWorkerChanges -> editedContract", editedContract)

      // this.$store.dispatch('editWorkerToEmployer', editedContract);
    },
    editWorker(){
      const dis = this.editDisabled;
      eventBus.$emit('disableAll');
      this.editDisabled = !dis;
    },
    deleteWorker(id){
      const data = {
        employerId: this.employer.id,
        workerId: id
      }

      const worker = this.$store.getters.getWorkers.filter(worker => {
        if(worker.id === +id){
          return worker;
        }
      })[0];

      const confirmDelete = confirm(`Usunąć pracownika?\n${worker.lastname} ${worker.user.name} (${worker.pesel})\nZatrudnionego u ${this.employer.company}`);

      this.$store.dispatch('deleteWorkerFromEmployer', data);

    }
  },
  created(){
    this.partTime = this.worker.part_time;
    this.contractFrom = this.worker.contract_from;
    this.contract_to = this.worker.contract_to;

    eventBus.$on('disableAll', () => {
      this.editDisabled = true;
    })
  },
  watch: {
    editDisabled(e){
      if(!e){
        this.editText = 'zaniechaj edycję umowy';
      }
      else{
        this.editText = 'edytuj umowę pracownika';
      }
    }
  }
}
</script>

<style lang="scss">
@import "../../../sass/flexMixins.scss";
@import "../../../sass/elements.scss";

.edit-worker-form{
  @include flexColumn;
  margin-bottom: 10px;
  background: #fff;
  min-width: 480px;
  padding: 5px 10px;
  border-top: 1px solid #000;
  border-bottom: 1px solid #000;

  input, select{
    @include inputWhite;

    &:disabled{
      background: lightgray;
      border: 2px solid gray;
      cursor: not-allowed;
    }
  }

  .name-section{
    @include flexRow;

    span{
      margin-right: 20px;
    }

    select{
      min-width: 50px;
    }
  }

  .contract{
    @include flexRow;
    width: 100%;
    margin: 10px 0;

    label:last-child{
      margin-left: 10px;
    }

    input{
      width: 120px;
      min-width: 120px;
    }
  }

  .buttons{
    @include flexRow(space-between, center);
    width: 100%;

    button{
      @include buttonWhite;
      padding: 5px 10px;

      &:disabled{
        background: lightgray;
        border: 2px solid gray;
        cursor: not-allowed;
      }
    }
  }

}

</style>
