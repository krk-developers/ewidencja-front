<template>
  <button class='close-modal-btn' @click="$store.dispatch('toggleModal', false)">X</button>
</template>

<style lang="scss">
@import "../../../sass/elements.scss";
@import "../../../sass/flexMixins.scss";

.close-modal-btn{
  @include buttonWhite;
  padding: 7px 15px;
  position: absolute;
  top: 15px;
  right: 20px;
  font-size: 24px;
  font-weight: 600;
  line-height: 100%;
}
</style>