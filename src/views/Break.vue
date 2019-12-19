<template>
  <div class="break">
    <div v-if="isActive" id="active">Active</div>
    <div v-else id="inactive">
        <button id="break_btn" @click="goOnBreak">Take a break</button>
    </div>
  </div>
</template>

<script lang="ts">
// @ is an alias to /src
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { mutations } from '../store';

@Component
export default class BreakView extends Vue {
  @Prop() readonly isActive!: boolean;

  goOnBreak () {
    this.$store.commit(mutations.startBreak);
  }
}
</script>

<style scoped>
.break {
  position: relative;
  height: 100%;
  width: 100%;
  background: var(--color-break-bg);
  color: white;
}
#inactive {
  position: relative;
  text-align: center;
}
#break_btn {
  --height: 50px;
  --width: 150px;

  position: relative;
  height: var(--height);
  width: var(--width);
  margin-top: calc(var(--section-height-closed)/2 - var(--height)/2);
}
</style>
