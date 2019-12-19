<template>
  <div class="manual_button" @click="onClick">
    <b>{{ this.data.title }}</b>
    <br>
    <span>Add <span v-if="Math.floor(this.data.worth / 60) > 0">{{ Math.floor(this.data.worth / 60) }}min</span> <span v-if="this.data.worth % 60 > 0"> {{ this.data.worth % 60 }}sec</span></span>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { ManualButtonReward } from '@/store/rewards';
import { mutations } from '@/store/index';

@Component
export default class HelloWorld extends Vue {
  @Prop() data!: ManualButtonReward;

  onClick () {
    this.$store.commit(mutations.addBreakTime, this.data.worth);
  }
}
</script>

<style scoped>
.manual_button {
  --font-size: calc(var(--section-height-closed) * 0.2);
  position: relative;
  width: 100%;
  height: 100%;
  color: var(--color-text);
  text-align: center;
  font-size: var(--font-size);
}
.manual_button > * {
  position: relative;
  top: calc(50% - var(--font-size) * 1.8);
}
</style>
