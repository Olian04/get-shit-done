import Vue from 'vue';
import Vuex, { StoreOptions, MutationTree } from 'vuex';
import VuexPersist from 'vuex-persist';

Vue.use(Vuex);

const vuexPersist = new VuexPersist({
  key: 'get-shit-done',
  storage: window.localStorage
});

const initialState = {
  accumulatedBreakTime: 0,
  onBreak: false
};

export type Store = typeof initialState;

const mutators = {
  addBreakTime (state: Store, amount: number) {
    state.accumulatedBreakTime += amount;
  },
  removeBreakTime (state: Store, amount: number) {
    state.accumulatedBreakTime -= amount;
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
