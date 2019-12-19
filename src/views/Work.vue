<template>
  <div class="work">
    <div v-if="isActive" id="active">
      <div id="reward_grid">
        <div v-for="(rewardSystem, index) in rewardSystems" :key="index">
          <ManualButton v-if="rewardSystem.type === 'manual-button'" :data="rewardSystem"></ManualButton>
        </div>
      </div>
    </div>
    <div v-else id="inactive" @click="startToWork">
      <b>Tap to  get back to work</b>
    </div>
  </div>
</template>

<script lang="ts">
// @ is an alias to /src
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { mutations, Store } from '@/store/index';
import ManualButton from '@/components/rewards/ManualButton.vue';

@Component({
  components: {
    ManualButton
  }
})
export default class WorkView extends Vue {
  @Prop() readonly isActive!: boolean;

  get rewardSystems () {
    const state = this.$store.state as Store;
    return state.rewardSystems;
  }

  @Watch('isActive') onIsActiveChanged () {
    this.$store.commit(mutations.addBreakTime, 1);
  }

  startToWork () {
    this.$store.commit(mutations.stopBreak);
  }
}
</script>

<style scoped>
.work {
  position: relative;
  height: 100%;
  width: 100%;
  background: var(--color-work-bg);
  color: var(--color-text);
  box-sizing: border-box;
  border-top:  5px solid var(--color-black);
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
  position: relative;
  height: 100%;
  width: 100%;
  padding: 0;
  margin: 0;
}
#reward_grid {
  --width : 75vw;
  --padding: 20px;
  position: absolute;
  display: grid;
  box-sizing: border-box;
  margin: 0;
  left: var(--padding);
  right: var(--padding);
  top: var(--padding);
  bottom: var(--padding);
  grid-gap: 20px;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(3, 1fr);
}
#reward_grid > div {
  position: relative;
  border: 3px solid var(--color-black);
  background: var(--color-green);
  border-radius: 20%;
  box-sizing: border-box;
}
</style>
