import { createMachine } from "xstate";

export const machine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QBEwCMD2BXAdgYwEscoA6ASQgBswBiPSgvAawG0AGAXUVAAcNYCAFwIYc3EAA9EARgAsAVhIA2NgE4ATKunzZ06QGZ5qgDQgAnogC0qxW2kB2WbIAcs9fM2b7AX2+nUmLiExCQB2PhEUHQMzOxcSCB8AsKi4lIIerLK0myO0krO2urO8qYWCJbq6vrKanryKmzyJaq+-ujhwaRhQZE0ErCCAIaCYCRDAGajAE4AFDlsbACUND0RIWtdceJJQiJiCemy9iRG6krqBnJsJXpliOon+qo3rs+qurJsF75+IDgYCBwcSbSI7fh7VKHKz6GrqNhudwGZ46VTOe4VfTOE6OdROAqqD7XJRtECgkIUajg5L7NIyLL2Gz2RzOJQqBRsdQY6xKEhueT2QruUnk7odXrEamQg6gdJ45wkewCvGOG72XL2bkvRXNeznfLSdwNX7eIA */
    id: "Debouncing",
    initial: "Idle",
    states: {
      Idle: {
        on: {
          click: {
            target: "Debouncing",
          }
        },
      },

      Debouncing: {
        on: {
          click: {
            target: "Debouncing",
            reenter: true
          },
        }
      }
    },
    types: { events: {} as { type: "click" } },
  },
  {
    actions: {},
    actors: {},
    guards: {},
    delays: {},
  },
);
