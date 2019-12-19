<template>
  <div class="main">
    <div class="break section" :class="isOnBreak ? 'active' : '' ">
      <Break :isActive="isOnBreak"></Break>
    </div>
    <div class="work section" :class="!isOnBreak ? 'active' : '' ">
      <Work :isActive="!isOnBreak"></Work>
    </div>
  </div>
</template>

<script lang="ts">
// @ is an alias to /src
import { Vue, Component } from 'vue-property-decorator';
import Work from '@/views/Work.vue';
import Break from '@/views/Break.vue';
import { Store } from '@/store';

@Component({
  components: {
    Work, Break
  }
})
export default class MainView extends Vue {
  get isOnBreak () {
    const state = this.$store.state as Store;
    return state.onBreak;
  }
}
</script>

<style scoped>
.main {
  --section-height-closed: 70px;
  --section-height-open: calc(100% - var(--section-height-closed));

  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

.section {
  position: relative;
  width: 100%;
  height: var(--section-height-closed);
  transition: height 0.5s ease-out;
}
.section.active {
  height: var(--section-height-open);
}
</style>
