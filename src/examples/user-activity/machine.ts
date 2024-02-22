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

const domListenerLogic = fromCallback(({ sendBack }) => {
  function handleWindowEvent() {
    sendBack({
      type: "activity"
    })
  }
  
  for (const event of defaultEvents) {
    window.addEventListener(event, handleWindowEvent, { passive: true })
  }

  function handleDocumentVisibilityChange() {
    if (document.hidden === false) {
      handleWindowEvent()
    }
  }
  
  document.addEventListener('visibilitychange', handleDocumentVisibilityChange, { passive: true })

  return () => {
    for (const event of defaultEvents) {
      window.removeEventListener(event, handleWindowEvent)
    }

    document.removeEventListener('visibilitychange', handleDocumentVisibilityChange)
  }
})

const userActivityMachine = setup({
  types: {
    events: {} as {
      type: "activity"
    },
    context: {} as {
      lastActive: number
    }
  },
  actions: {
    "Assign current timestamp to context": assign({
      lastActive: () => timestamp()
    })
  },
  actors: {
    "Listen DOM events": domListenerLogic,
  }
}).createMachine({
  context: () => ({
    lastActive: timestamp()
  }),
  invoke: {
    src: "Listen DOM events",
  },
  initial: "Active",
  states: {
    Active: {
      after: {
        5_000: {
          target: "Inactive"
        }
      },
      on: {
        activity: {
          target: "Active",
          reenter: true,
          actions: "Assign current timestamp to context",
        }
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
