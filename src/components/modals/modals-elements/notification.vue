<template>
  <div class="notification">
    <h4>{{notification.message}}</h4>
    <h4 v-show="notification.error">{{notificationError1}}</h4>
    <h4 v-show="notification.error">{{notificationError2}}</h4>
  </div>
</template>

<script>
export default {
  props: ['notification'],
  data(){
    return {
      errorInfo: false,
      notificationError1: 'Spróbuj jeszcze raz.',
      notificationError2: 'Jeśli błąd się powtarza, zgłoś to administratorowi.'
    }
  },
  created(){
    if(this.notification.error){
      this.errorInfo = true;
    }
  }
}
</script>

<style lang="scss">
  .notification{
    position: fixed;
    left: 10px;
    top: 200px;
    background: #fff;
    padding: 10px 15px;
  }
</style>
