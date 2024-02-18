/**
 * This state machine is a re-implementation of the useIdle hook from VueUse.
 * See https://github.com/vueuse/vueuse/blob/main/packages/core/useIdle/index.ts.
 */

import { assign, fromCallback, setup } from "xstate";

type WindowEventName = keyof WindowEventMap;

const defaultEvents: WindowEventName[] = [
  "mousemove",
  "mousedown",
  "resize",
  "keydown",
  "touchstart",
  "wheel",
];

function timestamp() {
  return Date.now();
}

const domEventListener = fromCallback<
  any,
  { listenForVisibilityChange: boolean; events: WindowEventName[] }
>(({ input, sendBack }) => {
  const windowEventMap = new Map<WindowEventName, () => void>();
  let documentVisibilitychangeHandler: (() => void) | undefined = undefined;

  for (const event of input.events) {
    function callback() {
      sendBack({
        type: "activity",
      });
    }

    windowEventMap.set(event, callback);

    window.addEventListener(event, callback, { passive: true });
  }

  if (input.listenForVisibilityChange === true) {
    documentVisibilitychangeHandler = () => {
      if (document.hidden === true) {
        return;
      }

      sendBack({
        type: "activity",
      });
    };

    document.addEventListener(
      "visibilitychange",
      documentVisibilitychangeHandler
    );
  }

  /**
   * That callback will be called when the service exits, that is, when the state that invoked it exits or
   * the overall state machine stops.
   */
  return () => {
    for (const [event, handler] of windowEventMap.entries()) {
      window.removeEventListener(event, handler);
    }

    if (documentVisibilitychangeHandler !== undefined) {
      document.removeEventListener(
        "visibilitychange",
        documentVisibilitychangeHandler
      );
    }
  };
});

export const userActivityMachine = setup({
  types: {
    events: {} as { type: "activity" },
    context: {} as {
      timeout: number;
      lastActive: number;
      listenForVisibilityChange: boolean;
      events: WindowEventName[];
    },
    input: {} as {
      /**
       * How long the user can stop interacting with the page before being considered inactive.
       *
       * @default 60_000 (1 minute)
       */
      timeout?: number;
      /**
       * @default true
       */
      listenForVisibilityChange?: boolean;
      /**
       * @default ['mousemove', 'mousedown', 'resize', 'keydown', 'touchstart', 'wheel']
       */
      events?: WindowEventName[];
    },
  },
  actors: {
    "Listen to DOM events": domEventListener,
  },
  delays: {
    /**
     * This is a dynamic timer. The `timeout` comes from the input and isn't expect to change.
     */
    "Inactivity timeout": ({ context }) => context.timeout,
  },
  actions: {
    "Assign last active timestamp to context": assign({
      lastActive: () => Date.now(),
    }),
  },
}).createMachine({
  id: "User activity",
  context: ({ input }) => ({
    timeout: input.timeout ?? 60_000,
    lastActive: timestamp(),
    listenForVisibilityChange: input.listenForVisibilityChange ?? true,
    events: input.events ?? defaultEvents,
  }),
  invoke: {
    src: "Listen to DOM events",
    input: ({ context }) => ({
      events: context.events,
      listenForVisibilityChange: context.listenForVisibilityChange,
    }),
  },
  initial: "Active",
  states: {
    Active: {
      initial: "Idle",
      states: {
        Idle: {
          after: {
            "Inactivity timeout": {
              target: "Done",
            },
          },
          on: {
            activity: {
              target: "Deduplicating",
              actions: "Assign last active timestamp to context",
            },
          },
        },
        Deduplicating: {
          description: `
            We throttle here to keep things under control.
            Deduplicating with a small timer prevents restarting the "Inactivity timeout"
            too often if the state machine receives a lot of "activity" events
            in a short amount of time.
            The useIdle composable prefers to create one timer per 50ms then even more
            if a large amount of *activity* events are sent to the machine.
          `,
          after: {
            50: {
              target: "Idle",
            },
          },
        },
        Done: {
          type: "final",
          description: `
            Use a *final* state to trigger a transition to the Inactive state.
            I prefer to use it instead of directly targetting the Inactive state from the Active.Idle state,
            because I would need to rely on a global id selector.
          `,
        },
      },
      onDone: {
        target: "Inactive",
      },
    },
    Inactive: {
      on: {
        activity: {
          target: "Active",
          actions: "Assign last active timestamp to context",
        },
      },
    },
  },
});
