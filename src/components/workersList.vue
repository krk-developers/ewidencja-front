<template>
  <div class="workers-list-modal">
    <button class='close-modal-btn' @click="$store.dispatch('hideModal')">X</button>
    <ul>
      <li v-for="worker in workers" :key="worker.pesel">
        {{worker.name}} {{worker.lastname}}, pesel: {{worker.pesel}}, email: {{worker.email}}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: ['workers']
}
</script>

<style scoped lang="scss">
.workers-list-modal{
  position: fixed;
  left: 0;
  top: 0;
  z-index: 10;
  width: 100vw;
  height: 100vh;
  background: gray;
  display: flex;
  justify-content: center;
  align-items: center;

  .close-modal-btn{
    padding: 10px 20px;
    position: fixed;
    top: 10px;
    right: 10px;
  }

  li{
    margin-bottom: 10px;
  }

}
</style>
