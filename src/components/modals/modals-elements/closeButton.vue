<template>
  <button class='close-modal-btn' @click="$store.dispatch('toggleModal', false)">X</button>
</template>

<style lang="scss">
@import "../../../sass/elements.scss";

.close-modal-btn{
  @include buttonWhite;
  padding: 5px 15px;
  position: absolute;
  top: 15px;
  right: 20px;
  font-size: 24px;
  font-weight: 600;
}
</style>