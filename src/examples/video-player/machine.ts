import { assign, enqueueActions, setup } from "xstate";

export const videoPlayerMachine = setup({
  types: {
    events: {} as
      | { type: "hover.hovering" }
      | { type: "hover.end" }
      | { type: "metadata.loaded"; videoDuration: number }
      | { type: "time.update"; currentTime: number }
      | { type: "time.seek"; seekToPercentage: number }
      | { type: "time.backward" }
      | { type: "time.forward" }
      | { type: "play" }
      | { type: "pause" }
      | { type: "toggle" }
      | { type: "toggle.click" }
      | { type: "toggle.keyboard" }
      | { type: "canplay" }
      | { type: "canplaythrough" }
      | { type: "waiting" }
      | { type: "play-state-animation.end" }
      | { type: "volume.mute.toggle" }
      | { type: "volume.set"; volume: number },
    context: {} as {
      videoSrc: string;
      videoPoster: string;
      currentVideoSrc: string | undefined;
      videoDuration: number | undefined;
      videoCurrentTime: number;
      volume: number;
      muted: boolean;
    },
    input: {} as {
      videoSrc: string;
      videoPoster: string;
    },
    tags: {} as
      | "Show loading overlay"
      | "Show loader"
      | "Show controls"
      | "Animate playing state"
      | "Animate paused state",
  },
  actions: {
    "Play the video": () => {},
    "Pause the video": () => {},
    "Set video current time": (_, params: { seekTo: number }) => {},
    "Set video muted": (_, params: { muted: boolean }) => {},
    "Set video volume": (_, params: { volume: number }) => {},
  },
}).createMachine({
  id: "Video Player",
  context: ({ input }) => ({
    videoSrc: input.videoSrc,
    videoPoster: input.videoPoster,
    currentVideoSrc: undefined,
    videoDuration: undefined,
    videoCurrentTime: 0,
    muted: false,
    volume: 1,
  }),
  initial: "Stopped",
  states: {
    Stopped: {
      tags: "Show loading overlay",
      on: {
        play: {
          target: "Initial loading",
          actions: assign({
            currentVideoSrc: ({ context }) => context.videoSrc,
          }),
        },
        "toggle.*": {
          target: "Initial loading",
          actions: assign({
            currentVideoSrc: ({ context }) => context.videoSrc,
          }),
          description:
            "Both `toggle` and `toggle.click` events will trigger this transition.",
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
          type: "parallel",
          states: {
            Controls: {
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
            },
            Animation: {
              initial: "Idle",
              states: {
                Idle: {},
                Animating: {
                  tags: "Animate playing state",
                  on: {
                    "play-state-animation.end": {
                      target: "Idle",
                    },
                  },
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
            "toggle.*": {
              target: "Paused.Animating",
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
          initial: "Idle",
          states: {
            Idle: {},
            Animating: {
              tags: "Animate paused state",
              on: {
                "play-state-animation.end": {
                  target: "Idle",
                },
              },
            },
          },
          on: {
            play: {
              target: "Playing",
            },
            toggle: {
              target: "Playing",
            },
            "toggle.*": {
              target: "Playing.Animation.Animating",
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
        "time.backward": {
          actions: enqueueActions(({ context, enqueue }) => {
            const updatedVideoCurrentTime = Math.max(
              context.videoCurrentTime - 10,
              0
            );

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
        "time.forward": {
          actions: enqueueActions(({ context, enqueue }) => {
            const updatedVideoCurrentTime = Math.min(
              context.videoCurrentTime + 10,
              context.videoDuration!
            );

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
        "volume.mute.toggle": {
          actions: [
            assign({
              muted: ({ context }) => !context.muted,
            }),
            {
              type: "Set video muted",
              params: ({ context }) => ({
                // Because the assign action is run before this one, the value of the muted property in the context
                // is updated.
                muted: context.muted,
              }),
            },
          ],
        },
        "volume.set": {
          actions: [
            assign({
              volume: ({ event }) => event.volume,
            }),
            {
              type: "Set video volume",
              params: ({ event }) => ({ volume: event.volume }),
            },
          ],
        },
      },
    },
  },
});
