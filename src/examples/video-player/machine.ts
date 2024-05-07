import { assign, enqueueActions, setup } from "xstate";

export const videoPlayerMachine = setup({
  types: {
    events: {} as
      | { type: "hover.start" }
      | { type: "hover.hovering" }
      | { type: "hover.end" }
      | { type: "metadata.loaded"; videoDuration: number }
      | { type: "time.update"; currentTime: number }
      | { type: "time.seek"; seekToPercentage: number }
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
      videoDuration: number | undefined;
      videoCurrentTime: number;
    },
    input: {} as {
      videoSrc: string;
      videoPoster: string;
    },
  },
  actions: {
    "Play the video": () => {},
    "Pause the video": () => {},
    "Set video current time": (_, params: { seekTo: number }) => {},
  },
}).createMachine({
  id: "Video Player",
  context: ({ input }) => ({
    videoSrc: input.videoSrc,
    videoPoster: input.videoPoster,
    currentVideoSrc: undefined,
    videoDuration: undefined,
    videoCurrentTime: 0,
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
      initial: "Blank loader",
      states: {
        "Blank loader": {
          after: {
            500: {
              target: "Loader",
            },
          },
        },
        Loader: {},
      },
      on: {
        "metadata.loaded": {
          actions: assign({
            videoDuration: ({ event }) => event.videoDuration,
          }),
        },
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
          exit: "Pause the video",
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
            "time.update": {
              actions: assign({
                videoCurrentTime: ({ event }) => event.currentTime,
              }),
            },
          },
        },
        Paused: {
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
          target: "Loading.Loader",
        },
        "time.seek": {
          actions: enqueueActions(({ context, event, enqueue }) => {
            const updatedVideoCurrentTime =
              (context.videoDuration! * event.seekToPercentage) / 100;

            enqueue({
              type: "Set video current time",
              params: {
                seekTo: updatedVideoCurrentTime,
              },
            });

            enqueue.assign({
              videoCurrentTime: updatedVideoCurrentTime,
            });
          }),
        },
      },
    },
  },
});
