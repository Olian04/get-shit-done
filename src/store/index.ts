import Vue from 'vue';
import Vuex, { StoreOptions, MutationTree } from 'vuex';
import VuexPersist from 'vuex-persist';
import { RewardSystem } from './rewards';

Vue.use(Vuex);

const vuexPersist = new VuexPersist({
  key: 'get-shit-done',
  storage: window.localStorage
});

const initialState = {
  accumulatedBreakTime: 0,
  onBreak: false,
  rewardSystems: [] as RewardSystem[]
};

// FIXME: DEMO CALL!
initialState.rewardSystems.push({
  type: 'manual-button',
  title: 'Completed a task',
  worth: 60,
  cooldown: 0
});

export type Store = typeof initialState;

const mutators = {
  addBreakTime (state: Store, amount: number) {
    state.accumulatedBreakTime += amount;
  },
  removeBreakTime (state: Store, amount: number) {
    state.accumulatedBreakTime -= amount;
    if (state.accumulatedBreakTime < 0) {
      state.accumulatedBreakTime = 0;
    }
  },
  startBreak (state: Store) {
    state.onBreak = true;
  },
  stopBreak (state: Store) {
    state.onBreak = false;
  }
};

export const mutations = Object.keys(mutators)
  .reduce((res, k) => ({ ...res, [k]: k }), {}) as { [k in keyof typeof mutators]: k };

export default new Vuex.Store<Store>({
  state: {
    ...initialState
  },
  mutations: {
    ...mutators
  },
  actions: {
  },
  modules: {
  },
  // @ts-ignore
  plugins: [
    vuexPersist.plugin
  ]
});
