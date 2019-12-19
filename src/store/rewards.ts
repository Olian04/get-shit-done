interface Reward {
  type: string;
  worth: number;
  title: string;
}

export interface ManualButtonReward extends Reward {
  type: 'manual-button',
  cooldown: number;
}

export interface AccumulativeButtonReward extends Reward {
  type: 'accumulative-button',
  triggersNeeded: number;
}

export interface ReoccurringTimerReward extends Reward {
  type: 'reoccurring-timer',
  interval: number;
}

export interface CountdownTimerReward extends Reward {
  type: 'countdown-timer',
  countdown: number;
}

export type RewardSystem =
  ManualButtonReward |
  AccumulativeButtonReward |
  ReoccurringTimerReward |
  CountdownTimerReward;
