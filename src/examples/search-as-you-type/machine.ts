import { assign, setup, assertEvent, fromPromise } from "xstate";
/**
 * Thanks ChatGPT 4 for this list of words!
 */
import itemsCollection from "./database.json";

const fetchAutocompleteItems = fromPromise<string[], { search: string }>(
  async ({ input }) => {
    console.log('fetch items', { search: input.search })

    if (input.search === "") {
      return [];
    }

    return itemsCollection.filter((item) =>
      item.toLowerCase().startsWith(input.search.toLowerCase())
    );
  }
);

export const searchAsYouTypeMachine = setup({
  types: {
    events: {} as
      | { type: "input.focus" }
      | { type: "input.change"; searchInput: string }
      | { type: "item.click"; itemId: number }
      | { type: "item.mouseenter"; itemId: number }
      | { type: "item.mouseleave" }
      | { type: "combobox.click-outside" },
    context: {} as {
      searchInput: string;
      activeItemIndex: number;
      availableItems: string[];
      lastFetchedSearch: string;
    },
    tags: "Display loader",
  },
  actions: {
    "Assign search input to context": assign({
      searchInput: ({ event }) => {
        assertEvent(event, "input.change");

        return event.searchInput;
      },
    }),
    "Assign active item index to context": assign({
      activeItemIndex: ({ event }) => {
        assertEvent(event, "item.mouseenter");

        return event.itemId;
      },
    }),
    "Reset active item index into context": assign({
      activeItemIndex: -1,
    }),
    "Assign selected item as current search input into context": assign({
      searchInput: ({ context, event }) => {
        assertEvent(event, "item.click");

        return context.availableItems[event.itemId];
      },
    }),
    "Assign last fetched search into context": assign({
      lastFetchedSearch: ({ context }) => context.searchInput,
    }),
    "Reset available items in context": assign({
      availableItems: [],
    }),
  },
  guards: {
    "Has search query been fetched": ({ context }) =>
      context.searchInput === context.lastFetchedSearch,
  },
  actors: {
    "Autocomplete search": fetchAutocompleteItems,
  },
}).createMachine({
  id: "Search as you type",
  context: {
    searchInput: "",
    activeItemIndex: -1,
    availableItems: [],
    lastFetchedSearch: "",
  },
  initial: "Inactive",
  states: {
    Inactive: {
      on: {
        "input.focus": {
          target: "Active",
        },
      },
    },
    Active: {
      entry: "Reset active item index into context",
      initial: "Checking if initial fetching is required",
      states: {
        "Checking if initial fetching is required": {
          description: `After an item has been clicked and used as the new search query, we want to fetch its related results but only if they have not already been fetched.`,
          always: [
            {
              guard: "Has search query been fetched",
              target: "Idle",
            },
            {
              target: "Fetching",
            },
          ],
        },
        Idle: {},
        Debouncing: {
          after: {
            500: {
              target: "Fetching"
            }
          }
        },
        Fetching: {
          tags: "Display loader",
          invoke: {
            src: "Autocomplete search",
            input: ({ context }) => ({
              search: context.searchInput,
            }),
            onDone: {
              target: "Idle",
              actions: [
                assign({
                  availableItems: ({ event }) => event.output,
                }),
                "Assign last fetched search into context",
              ],
            },
          },
        },
      },
      on: {
        "input.change": {
          target: ".Debouncing",
          reenter: true,
          actions: "Assign search input to context",
        },
        "combobox.click-outside": {
          target: "Inactive",
        },
        "item.mouseenter": {
          actions: "Assign active item index to context",
        },
        "item.mouseleave": {
          actions: "Reset active item index into context",
        },
        "item.click": {
          target: "Inactive",
          actions: [
            "Assign selected item as current search input into context",
            /**
             * We reset the available items when an item has been clicked because this is
             * as if we were starting a new interaction session. An item has been selected
             * and we don't want to see the previous and stale results when focus the input.
             */
            "Reset available items in context",
          ],
        },
      },
    },
  },
});
