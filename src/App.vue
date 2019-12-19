<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style>
:root {
  /*
  --color-base: #2A363B;
  --color-highlight: #E84A5F;
  --color-pink: #FF847C;
  --color-yellow: #FECEA8;
  --color-green: #99B898;

  --color-work-bg: var(--color-yellow);
  --color-break-bg: var(--color-green);
  */

  --color-black: #2A363B;
  --color-pink-dim: #FC9D9A;
  --color-pink: #FE4365;
  --color-yellow-dim: #F9CDAD;
  --color-green-dim: #C8C8A9;
  --color-green: #83AF9B;

  --color-work-bg: var(--color-yellow-dim);
  --color-break-bg: var(--color-green-dim);
  --color-text: var(--color-black);
}
</style>

<style scoped>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
  width: 100%;
  padding: 0;
  margin: 0;
}
</style>
