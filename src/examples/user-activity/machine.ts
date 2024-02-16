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
      after: {
        "Inactivity timeout": {
          target: "Inactive",
        },
      },
      on: {
        activity: {
          target: "Active",
          reenter: true,
          actions: "Assign last active timestamp to context",
        },
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
