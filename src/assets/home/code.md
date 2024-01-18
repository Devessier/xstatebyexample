```tsx title="search-as-you-type.ts"
import { setup } from 'xstate';

const searchAsYouTypeMachine = setup({
  /** ... */
}).createMachine({
  id: "Search as you type",

  initial: "Inactive",

  states: {
    Inactive: { /** ... */ },

    Active: {
      entry: "Reset active item index into context",

      initial: "Checking if initial fetching is required",

      states: {
        "Checking if initial fetching is required": {
          /** ... */
        },
        Idle: {},
        Debouncing: { /** ... */ },
        Fetching: { /** ... */ },
      },

      on: { /** ... */ },
    },
  },
});
```
