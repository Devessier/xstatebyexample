import { assign, enqueueActions, setup } from "xstate";

export const videoPlayerMachine = setup({
  types: {
    events: {} as
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
    tags: {} as "Show loading overlay" | "Show loader" | "Show controls",
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
      tags: "Show loading overlay",
      on: {
        toggle: {
          target: "Initial loading",
          actions: assign({
            currentVideoSrc: ({ context }) => context.videoSrc,
          }),
        },
      },
    },
    "Initial loading": {
      type: "parallel",
      states: {
        Loader: {
          initial: "Hide",
          states: {
            Hide: {
              tags: "Show loading overlay",
              after: {
                500: {
                  target: "Show",
                },
              },
            },
            Show: {
              tags: "Show loader",
            },
          },
        },
        Metadata: {
          initial: "Waiting for metadata",
          states: {
            "Waiting for metadata": {
              on: {
                "metadata.loaded": {
                  target: "Waiting for playing authorization",
                  actions: assign({
                    videoDuration: ({ event }) => event.videoDuration,
                  }),
                },
              },
            },
            "Waiting for playing authorization": {
              on: {
                canplay: {
                  target: "#Video Player.Ready",
                },
              },
            },
          },
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
                "hover.hovering": {
                  target: "Hovering",
                },
              },
            },
            Hovering: {
              tags: "Show controls",
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
            waiting: {
              target: "Loading",
            },
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
        Loading: {
          tags: "Show loader",
          on: {
            canplay: {
              target: "Playing",
            },
          },
        },
        Paused: {
          tags: "Show controls",
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
