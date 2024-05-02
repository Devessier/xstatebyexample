import { assign, setup } from "xstate";

export const videoPlayerMachine = setup({
  types: {
    events: {} as
      | { type: "hover.start" }
      | { type: "hover.hovering" }
      | { type: "hover.end" }
      | { type: "play" }
      | { type: "pause" }
      | { type: "toggle" }
      | { type: "canplay" }
      | { type: "canplaythrough" }
      | { type: "waiting" },
    context: {} as {
      videoSrc: string;
      videoPoster: string;
      currentVideoSrc: string | undefined;
    },
    input: {} as {
      videoSrc: string;
      videoPoster: string;
    },
  },
  actions: {},
}).createMachine({
  id: "Video Player",
  context: ({ input }) => ({
    videoSrc: input.videoSrc,
    videoPoster: input.videoPoster,
    currentVideoSrc: undefined,
  }),
  initial: "Stopped",
  states: {
    Stopped: {
      on: {
        play: {
          target: "Loading",
          actions: assign({
            currentVideoSrc: ({ context }) => context.videoSrc,
          }),
        },
      },
    },
    Loading: {
      on: {
        canplay: {
          target: "Ready",
        },
        canplaythrough: {
          target: "Ready",
        },
      },
    },
    Ready: {
      initial: "Playing",
      states: {
        Playing: {
          entry: "Play the video",
          initial: "Hovering",
          states: {
            Idle: {
              on: {
                "hover.start": {
                  target: "Hovering",
                },
                "hover.hovering": {
                  target: "Hovering",
                },
              },
            },
            Hovering: {
              after: {
                2_000: {
                  target: "Idle",
                },
              },
              on: {
                "hover.end": {
                  target: "Idle",
                },
                "hover.hovering": {
                  target: "Hovering",
                  reenter: true,
                },
              },
            },
          },
          on: {
            pause: {
              target: "Paused",
            },
            toggle: {
              target: "Paused",
            },
          },
        },
        Paused: {
          entry: "Pause the video",
          on: {
            play: {
              target: "Playing",
            },
            toggle: {
              target: "Playing",
            },
          },
        },
      },
      on: {
        waiting: {
          target: "Loading",
        },
      },
    },
  },
});
