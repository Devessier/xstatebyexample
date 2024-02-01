import {
  assertEvent,
  assign,
  setup,
  type ActorRefFrom,
  sendParent,
  stopChild,
} from "xstate";

export const notificationMachine = setup({
  types: {
    input: {} as {
      notificationId: string;
      timeout: number | undefined;
      title: string;
      description: string;
    },
    context: {} as {
      notificationId: string;
      timeout: number | undefined;
      title: string;
      description: string;
    },
    events: {} as { type: "close" } | { type: "mouse.enter" } | { type: "mouse.leave" } | { type: "animation.end" },
  },
  guards: {
    "Is timer defined": ({ context }) => typeof context.timeout === "number",
  },
}).createMachine({
  id: "Notification",
  context: ({ input }) => input,
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
      initial: "Active",
      states: {
        Active: {
          on: {
            "mouse.enter": {
              target: "Inactive"
            }
          }
        },
        Inactive: {
          on: {
            "mouse.leave": {
              target: "Active"
            }
          }
        },
      },
      on: {
        close: {
          target: "Done",
        },
        "animation.end": {
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
      entry: sendParent(({ context }) => ({
        type: "notification.closed",
        notificationId: context.notificationId,
      })),
    },
  },
});

export const notificationCenterMachine = setup({
  types: {
    context: {} as {
      notificationRefs: Array<ActorRefFrom<typeof notificationMachine>>;
    },
    events: {} as
      | {
          type: "notification.trigger";
          timeout?: number;
          title: string;
          description: string;
        }
      | { type: "notification.closed"; notificationId: string },
  },
  actions: {
    "Assign notification configuration into context": assign({
      notificationRefs: ({ context, event, spawn }) => {
        assertEvent(event, "notification.trigger");

        const newNotificationId = generateId();

        return context.notificationRefs.concat(
          spawn(notificationMachine, {
            id: newNotificationId,
            input: {
              notificationId: newNotificationId,
              title: event.title,
              description: event.description,
              timeout: event.timeout,
            },
          })
        );
      },
    }),
    "Stop closed notification": stopChild(({ context, event }) => {
      assertEvent(event, "notification.closed");

      return context.notificationRefs.find(
        (ref) => ref.id === event.notificationId
      )!;
    }),
    "Remove closed notification from context": assign({
      notificationRefs: ({ context, event }) => {
        assertEvent(event, "notification.closed");

        return context.notificationRefs.filter(
          (ref) => ref.id !== event.notificationId
        );
      },
    }),
  },
}).createMachine({
  id: "Notification Center",
  context: {
    notificationRefs: [],
  },
  on: {
    "notification.trigger": {
      actions: "Assign notification configuration into context",
    },
    "notification.closed": {
      actions: [
        "Stop closed notification",
        "Remove closed notification from context",
      ],
    },
  },
});

function generateId() {
  return String(Math.random());
}
