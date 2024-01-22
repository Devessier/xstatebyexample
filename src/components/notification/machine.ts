import { assertEvent, assign, setup } from "xstate";

export const notificationMachine = setup({
  types: {
    context: {} as {
      timeout: number | undefined;
      title: string | undefined;
      description: string | undefined;
    },
    events: {} as
      | {
          type: "trigger";
          timeout?: number;
          title: string;
          description: string;
        }
      | { type: "close" },
  },
  delays: {
    "Notification timeout": ({ context }) => {
      if (context.timeout === undefined) {
        throw new Error("Expect timeout to be defined.");
      }

      return context.timeout;
    },
  },
  actions: {
    "Assign notification configuration into context": assign(({ event }) => {
      assertEvent(event, "trigger");

      return {
        title: event.title,
        description: event.description,
        timeout: event.timeout,
      };
    }),
  },
  guards: {
    "Is timer defined": ({ context }) => typeof context.timeout === 'number',
  }
}).createMachine({
  context: {
    timeout: undefined,
    title: undefined,
    description: undefined,
  },
  initial: "Closed",
  states: {
    Closed: {
      on: {
        trigger: {
          target: "Open",
          actions: "Assign notification configuration into context",
        },
      },
    },
    Open: {
      initial: "Checking if timer is required",
      states: {
        "Checking if timer is required": {
          always: [
            {
              guard: "Is timer defined",
              target: "Waiting for timeout",
            },
            {
              target: "Waiting for manual action",
            },
          ],
        },
        "Waiting for timeout": {
          after: {
            "Notification timeout": {
              target: "Done",
            },
          },
          on: {
            close: {
              target: "Done",
            },
          },
        },
        "Waiting for manual action": {
          on: {
            close: {
              target: "Done",
            },
          },
        },
        Done: {
          type: "final",
        },
      },
      onDone: {
        target: "Closed",
      },
    },
  },
});
