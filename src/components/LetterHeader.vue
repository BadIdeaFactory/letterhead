<template>
  <header>
    <img src="../assets/bif_logo.svg" alt="" draggable="false" />
  </header>
</template>

<style scoped>
header {
  margin-bottom: 20%;
  margin-top: 5%;
}

/* todo: this is seal, convert or delete */
header img {
  position: absolute;
  top: 8%; /* Percentage is based on height in this case, so we can use a fixed amount */
  right: var(--side-margin);
  width: calc(9.75 / 6 * 72 / 612 * 100%);
  height: auto;
  user-select: none;
  pointer-events: none;
}
</style>
