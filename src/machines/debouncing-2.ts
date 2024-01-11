import { createMachine } from "xstate";

export const machine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QBEwCMD2BXAdgYwEscoACAJgDpVNdDiBiAD1gBcBDFsCtgM04CcAFAEYADOICU9atnxFSlGbXkBtUQF1EoAA4ZYBFgQw4tIRogAsFiqIBsVgKwWAHFYCcZMqLe2ANCABPRGErCgcyBwBmC2FhN2FIqOcAdgBfVP8lOWJyCgBJCAAbMHo8QoI8AGs1TSQQXX1DY1NzBGEHYQpIsQ8HW1tkj0TnfyCEMkiKN2dhZ2dbNw7In1Fk53TM9Fk6BSot5QYyiuqNUwaDIxM61tjnGzdIyNFohwc5vrdRxABaWLcp2yzSJkWx9R4OQbpDIgHAYCBwUxZHbkM56C7Na4-SK2CheCyeJbLJzTL4IX7TCgWBzxUSvBzeZL2DYgJHyXIFYqoxqXFrBTqDCHJFz9URU0RkUmeMJCsizZIOZmsnKKfbZKBc9FXUCtMg+CiM1YWYGGw2SygQ-FyhVQoA */
    id: "Debouncing 2",
    initial: "Idle",
    states: {
      Idle: {
        on: {
          click: "Debouncing"
        }
      },
      Debouncing: {
        after: {
          "1000": {
            target: "Idle",
            actions: "Increment number of executions"
          }
        },

        on: {
          click: {
            target: "Debouncing",
            reenter: true
          }
        }
      },
    },
    types: { events: {} as { type: "next" } },
  },
  {
    actions: {},
    actors: {},
    guards: {},
    delays: {},
  },
);
