import { createMachine } from "xstate";

export const machine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QBEwCMD2BXAdgYwEscoACACjwwAcBPASgDoB1AQwIBcioBiPAGwJ4A1gG0ADAF1EoKhlgcCGHNJAAPRAEYA7ABYGWgGw6ArACYNOg2ICcZrQBoQNTddMNTpgByfr1raYBmYwCdAIBfMMdUTFxCYnJKWkZo7HwuXgFhcSkkEFl5TiUVdQRjYIYdUy1q6yDjHS1PHUdnBG0AhgDvXwDfMX7-CKj0VLjSCmp6BhTY9NVYdhZ2MAYWADNlgCcyDX6xOm4ZtPiJpOmR2eJslXyFItySgzdjazEtMWMxDU8NKoNrFqIEJ6TwBLRBMSmPx+AxaCKREA4DAQOAqI5jBKTOg3OR3ZQPRAAWhMDF8VR+xi0GmsOg01MBCGs7jKBie-zpWleoKGIHRXExZ1YCmIOIKinxoBKbgG5iaXg+3g0AVMDOpYgYnkCrPq1g0wR0Oh5fJOiSmxqgorxxSB9QqxiVhihGgMxgMnlVrw1WpdOl1+sN8KAA */
    id: "Untitled",
    initial: "First State",
    states: {
      "First State": {
        on: {
          next: {
            target: "Second State",
          },
        },
      },
      "Second State": {},
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
