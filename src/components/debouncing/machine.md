```tsx
import { assign, createMachine } from "xstate";

export const debouncingMachine = createMachine(
  {
    id: "Debouncing",
    context: {
      counter: 0,
    },
    initial: "Idle",
    states: {
      Idle: {
        on: {
          click: {
            target: "Debouncing",
          },
          reset: {
            actions: "Reset counter",
          },
        },
      },
      Debouncing: {
        after: {
          "1000": {
            target: "Idle",
            actions: "Increment counter",
          },
        },
        on: {
          click: {
            target: "Debouncing",
            description:
              "Re-enter `Debouncing` state and reinitialize the delayed transition.",
            reenter: true,
          },
        },
      },
    },
    types: {
      events: {} as { type: "click" } | { type: "reset" },
      context: {} as { counter: number },
      actions: {} as { type: "Increment counter" } | { type: "Reset counter" },
    },
  },
  {
    actions: {
      "Increment counter": assign({
        counter: ({ context }) => context.counter + 1,
      }),
      "Reset counter": assign({
        counter: 0,
      }),
    },
  }
);
```