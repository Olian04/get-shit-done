<template>
  <div class="work">
    <div v-if="isActive" id="active">Active</div>
    <div v-else id="inactive">
      <button id="work_btn" @click="startToWork">Get back to work</button>
    </div>
  </div>
</template>

<script lang="ts">
// @ is an alias to /src
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { mutations } from '@/store/index';

@Component
export default class WorkView extends Vue {
  @Prop() readonly isActive!: boolean;

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
  color: white;
}
#inactive {
  position: relative;
  text-align: center;
}
#work_btn {
  --height: 50px;
  --width: 150px;

  position: relative;
  height: var(--height);
  width: var(--width);
  margin-top: calc(var(--section-height-closed)/2 - var(--height)/2);
}
</style>
