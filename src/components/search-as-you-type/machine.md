```tsx
import { assign, setup, assertEvent, fromPromise } from "xstate";

const itemsCollection: Array<string> = [
  "Panda CSS",
  "Tailwind CSS",
  "Tailwind Labs",
  "TypeScript",
  "CSS",
  "HTML",
  "JavaScript",
];

const fetchAutocompleteItems = fromPromise<string[], { search: string }>(
  async ({ input }) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

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

        console.log(
          "clicked",
          context.availableItems[event.itemId],
          event.itemId,
          context.availableItems
        );

        return context.availableItems[event.itemId];
      },
    }),
    "Assign last fetched search into context": assign({
      lastFetchedSearch: ({ context }) => context.searchInput,
    }),
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
      initial: "Idle",
      states: {
        Idle: {
          on: {
            "input.change": {
              target: "Debouncing",
              actions: "Assign search input to context",
            },
          },
        },
        Debouncing: {
          after: {
            500: {
              target: "Fetching",
            },
          },
          on: {
            "input.change": {
              target: "Debouncing",
              actions: "Assign search input to context",
              reenter: true,
            },
          },
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
          on: {
            "input.change": {
              target: "Debouncing",
              actions: "Assign search input to context",
            },
          },
        },
      },
      on: {
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
          actions: "Assign selected item as current search input into context",
        },
      },
    },
  },
});
```