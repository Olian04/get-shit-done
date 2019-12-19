<template>
  <div class="break">
    <div v-if="isActive" id="active">
      <span v-if="breakTime > 0">
        <b>You're on break, do something fun!</b>
        <br>
        {{ Math.floor(breakTime / 60) }}min {{ breakTime % 60 }}sec
      </span>
      <span v-else>
        <b>Break times over!</b>
        <br>
        Get back to work.
      </span>
    </div>
    <div v-else id="inactive" @click="goOnBreak">
      <span v-if="breakTime > 0">
        <b>Tap to take a break</b>
        <br>
        {{ Math.floor(breakTime / 60) }}min {{ breakTime % 60 }}sec
      </span>
      <span v-else>
        Keep working, you can do it!
      </span>
    </div>
  </div>
</template>

<script lang="ts">
// @ is an alias to /src
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { mutations, Store } from '../store';

@Component
export default class BreakView extends Vue {
  @Prop() readonly isActive!: boolean;

  timer: number | undefined = undefined;

  get breakTime () {
    const state = this.$store.state as Store;
    return state.accumulatedBreakTime;
  }

  @Watch('isActive') toggleTimer () {
    if (this.isActive && this.timer === undefined) {
      this.timer = setInterval(() => {
        this.$store.commit(mutations.removeBreakTime, 1);
      }, 1000);
    } else {
      this.cleanupTimer();
    }
  }

  goOnBreak () {
    this.$store.commit(mutations.startBreak);
  }

  cleanupTimer () {
    clearInterval(this.timer);
    this.timer = undefined;
  }

  beforeDestroy () {
    this.cleanupTimer();
  }
}
</script>

<style scoped>
.break {
  position: relative;
  height: 100%;
  width: 100%;
  background: var(--color-break-bg);
  color: var(--color-text);
}
#inactive {
  --font-size: calc(var(--section-height-closed) * 0.2);
  position: relative;
  text-align: center;
  height: 100%;
  width: 100%;
  font-size: var(--font-size);
}
#inactive > * {
  position: relative;
  top: calc(var(--section-height-closed)/2 - var(--font-size));
}
#active {
  --font-size: calc(var(--section-height-closed) * 0.2);
  position: relative;
  text-align: center;
  height: 100%;
  width: 100%;
  font-size: var(--font-size);
}
#active > * {
  position: relative;
  top: calc(var(--section-height-open)/2 + var(--font-size) * 2);
}
</style>
