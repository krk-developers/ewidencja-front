<template>
  <button class='close-modal-btn' @click="$store.commit('hideModal')">X</button>
</template>

<style lang="scss">
@import "../../../sass/elements.scss";

.close-modal-btn{
  @include buttonWhite;
  padding: 5px 15px;
  position: fixed;
  top: 15px;
  right: 15px;
  font-size: 24px;
  font-weight: 600;
}
</style>