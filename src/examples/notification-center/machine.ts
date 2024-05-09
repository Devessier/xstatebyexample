import {
  assertEvent,
  assign,
  setup,
  type ActorRefFrom,
  sendParent,
  stopChild,
  fromCallback,
  enqueueActions,
} from "xstate";

const windowFocusLogic = fromCallback(
  ({
    sendBack,
  }: {
    sendBack: (event: { type: "window.focus" | "window.blur" }) => void;
  }) => {
    window.addEventListener("focus", () => {
      sendBack({
        type: "window.focus",
      });
    });

    window.addEventListener("blur", () => {
      sendBack({
        type: "window.blur",
      });
    });
  }
);

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
    events: {} as
      | { type: "close" }
      | { type: "mouse.enter" }
      | { type: "mouse.leave" }
      | { type: "animation.end" }
      | { type: "window.focus" }
      | { type: "window.blur" },
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
              target: "Hovering",
            },
          },
        },
        Hovering: {
          on: {
            "mouse.leave": {
              target: "Active",
            },
          },
        },
        "Window inactive": {
          on: {
            "window.focus": {
              target: "Active",
            },
          },
        },
      },
      on: {
        "window.blur": {
          target: ".Window inactive",
        },
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
      | { type: "notification.closed"; notificationId: string }
      | { type: "window.focus" }
      | { type: "window.blur" },
  },
  actions: {
    "Assign notification configuration into context": assign({
      notificationRefs: ({ context, event, spawn }) => {
        assertEvent(event, "notification.trigger");

        const newNotificationId = generateId();

        return [
          spawn("notificationMachine", {
            id: newNotificationId,
            input: {
              notificationId: newNotificationId,
              title: event.title,
              description: event.description,
              timeout: event.timeout,
            },
          }),
          ...context.notificationRefs,
        ];
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
  actors: {
    windowFocusLogic,
    notificationMachine,
  },
}).createMachine({
  id: "Notification Center",
  context: {
    notificationRefs: [],
  },
  invoke: {
    src: "windowFocusLogic",
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
    "window.*": {
      actions: enqueueActions(({ enqueue, context, event }) => {
        for (const ref of context.notificationRefs) {
          enqueue.sendTo(ref, event);
        }
      }),
    },
  },
});

function generateId() {
  return String(Math.random());
}
