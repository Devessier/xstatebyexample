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

const domListenerLogic = fromCallback<any, { events: WindowEventName[]; listenForVisibilityChange: boolean }>(({ sendBack, input }) => {
  function handleWindowEvent() {
    sendBack({
      type: "activity"
    })
  }
  
  for (const event of input.events) {
    window.addEventListener(event, handleWindowEvent, { passive: true })
  }

  function handleDocumentVisibilityChange() {
    if (document.hidden === false) {
      handleWindowEvent()
    }
  }

  if (input.listenForVisibilityChange === true) {
    document.addEventListener('visibilitychange', handleDocumentVisibilityChange, { passive: true })
  }

  return () => {
    for (const event of input.events) {
      window.removeEventListener(event, handleWindowEvent)
    }

    if (input.listenForVisibilityChange === true) {
      document.removeEventListener('visibilitychange', handleDocumentVisibilityChange)
    }
  }
})

export const userActivityMachine = setup({
  types: {
    events: {} as {
      type: "activity"
    },
    context: {} as {
      lastActive: number
      timeout: number
      events: WindowEventName[];
      listenForVisibilityChange: boolean
    },
    input: {} as {
      timeout?: number
      events?: WindowEventName[];
      listenForVisibilityChange?: boolean
    }
  },
  actions: {
    "Assign current timestamp to context": assign({
      lastActive: () => timestamp()
    })
  },
  actors: {
    "Listen DOM events": domListenerLogic,
  },
  delays: {
    "Activity timeout": ({ context }) => context.timeout,
  }
}).createMachine({
  context: ({ input }) => ({
    lastActive: timestamp(),
    timeout: input.timeout ?? 60_000,
    events: input.events ?? defaultEvents,
    listenForVisibilityChange: input.listenForVisibilityChange ?? true,
  }),
  invoke: {
    src: "Listen DOM events",
    input: ({ context }) => ({
      events: context.events,
      listenForVisibilityChange: context.listenForVisibilityChange,
    })
  },
  initial: "Active",
  states: {
    Active: {
      initial: "Idle",
      states: {
        Idle: {
          after: {
            "Activity timeout": {
              target: "Done"
            }
          },
          on: {
            activity: {
              target: "Throttling",
              actions: "Assign current timestamp to context",
            }
          }
        },
        Throttling: {
          after: {
            50: {
              target: "Idle"
            }
          }
        },
        Done: {
          type: "final"
        }
      },
      onDone: {
        target: "Inactive"
      }
    },
    Inactive: {
      on: {
        activity: {
          target: "Active",
          actions: "Assign current timestamp to context",
        }
      }
    },
  }
})
