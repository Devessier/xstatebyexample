import { createMachine, fromPromise } from "xstate";

const fetcher = fromPromise(
  () => new Promise((resolve) => setTimeout(resolve, 2_000))
);

export const debouncingMachine = createMachine(
  {
    id: "Debouncing",
    initial: "Idle",
    states: {
      Idle: {
        on: {
          click: {
            target: "Debouncing",
          },
        },
      },
      Debouncing: {
        after: {
          "1000": {
            target: "#Debouncing.Fetching",
            actions: [],
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
      Fetching: {
        invoke: {
          input: {},
          src: "Fetch data",
          id: "fetch",
          onDone: [
            {
              target: "Idle",
            },
          ],
        },
      },
    },
    types: {
      events: {} as { type: "click" },
    },
  },
  {
    actors: {
      "Fetch data": fetcher,
    },
  }
);
