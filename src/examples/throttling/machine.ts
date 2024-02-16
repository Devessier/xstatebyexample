import { assign, setup } from "xstate";

export const throttlingMachine = setup({
  types: {
    events: {} as { type: "click" } | { type: "reset" },
    context: {} as { counter: number },
  },
  actions: {
    "Increment counter": assign({
      counter: ({ context }) => context.counter + 1,
    }),
    "Reset counter": assign({
      counter: 0,
    }),
  },
}).createMachine({
  id: "Throttling",
  context: {
    counter: 0,
  },
  initial: "Idle",
  states: {
    Idle: {
      on: {
        click: {
          target: "Throttling",
          actions: "Increment counter",
        },
        reset: {
          actions: "Reset counter",
        },
      },
    },
    Throttling: {
      after: {
        500: {
          target: "Idle",
        }
      }
    }
  },
});
