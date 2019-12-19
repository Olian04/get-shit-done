# get-shit-done

A timekeeping webb app that helps you get shit done. Inspired by pomodoro, It allows you to define your own rewardsystem, where the reward is break time.
Ex:
• gain 5 min break time every 20 min of work (regular pomodoro)
• continously gain 5% of time spent working as break time
• gain 1 min break time every time you press a button
• gain 5 min break time every 3rd time you press a button

The app UI consists of 2 vertical segments. Break time, and work time. Break time (at the top of the screen) shows you a button that says take a break, along with a clock indicating how much break time you have earned.
Work time (the lower segment) shows a grid of the reward systems currently in use. One might be a timer, one could be a button, another might be a continuous counting number with a % converted to break time.

Once you click take a break, the lower half of the screen shrinks and the top half grows to almost fill the entire screen. It then starts counting down the break timer, showing the text "Enjoy your break", while the lower haf shows "Get back to work?".

Creating your own reward system:
The edit page allows the user to have between 1 and 9 simultaneous reward systems at once. It also allows the user to place the systems in a 3x3 grid. Once placed the grid shrinks to the smallest it can be while still accommodating all of the systems the user placed in it, and respecting their placements.
Ex:
1 0 0                     1 0
0 1 0  shrinks to 0 1
0 0 0

1 1 0
0 0 0  doesn't shrink
1 0 1

The shrinkage only happens from right to left and from bottom to top.

Dev notes:
Pages needed:

- main page (houses menu button, split segments for work page & break page)
- work page
- break page
- edit reward systems & layout
- config one reward system

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Run your unit tests

```
npm run test:unit
```

### Lints and fixes files

```
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
