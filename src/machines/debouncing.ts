import { createMachine } from "xstate";

export const machine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QBEwCMD2BXAdgYwEscoA6AdQEMCAXIqAYjwBsC8BrAbQAYBdRUAA4ZYNAhhz8QAD0QAmAIwBWEgHYAbABZFCjWq4BObSoA0IAJ5zZakrNkAOO-v0rZAZkWuNrgL7fTqTFxCYhIA7Hw6RhZ2bj4kECERWnFJGQRFfQ0SDVkVPP13RQ0VOw1TCwRZLhUSVwcnVycuZpdff3Rw4NIwoMipWGoKajASCgAzYYAnAAp5Zq4ASnoeiJCVrtjJRNEU+LS51xIM6q5FLnk7eVyTc0RXEpI7e-cuWWdnNRVfPxAcDAg4JJ1nQtsIdhI9ogALRZJy5S6KFTyTLyZFlW4ILw2RTyHKyHEXKyONogYEhSiiYigpJiCGgNJYloKUr2U4OLhqcqWLJ2NxqNRFfRKTwaElk7odXpU+LbZJ06R3QzZHH3NRveQCtR2LmVWQ8vkCjRCjwaUXfIA */
    id: "Debouncing",
    initial: "Waiting",
    states: {
      Waiting: {
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

          "Event 2": "Waiting"
        }
      }
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
