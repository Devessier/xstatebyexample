import { createMachine } from "xstate";

export const machine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QBEwCMD2BXAdgYwEscoA6ASQgBswBiPSgvAawG0AGAXUVAAcNYCAFwIYc3EAA9EARgDsbEgDY2ATgBMK6QFYALNOkBmLSoA0IAJ6I1Bkltk610gByytAXzdnUmXIWIlvbHwiKBoJWEEAQ0EwEkiAMxiAJwAKLTY2AEoaQN8QgPQgvyh2LiQQPgFhUXEpBGkdWSVVDW09Qy0nRTNLescSAxU2JycdQZU9HTZFDy9CvP9c4OI6BmZS8UqhETFyuqMbLqHZDSc2I0VFAx7EAFpZRWbNbWU2TuMdD08QHAwIOHES2Km342xqezuBkeajYDjUWkMg10KicNwQt20WhI0lU+i0r3eE1mICB+Qo1BBVR2tRk0hIshUdnsXWUOnSajRajUtnsjhc7m+pMW82WUEpYN2oH28PpynsBhh9jY9k53LsDmcri+biAA */
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
        after: {
          "500": "Idle"
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
