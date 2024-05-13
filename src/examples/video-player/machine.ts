import { assign, enqueueActions, raise, setup } from "xstate";

export const videoPlayerMachine = setup({
  types: {
    events: {} as
      | { type: "hover.hovering" }
      | { type: "hover.end" }
      | { type: "metadata.loaded"; videoDuration: number }
      | { type: "time.update"; currentTime: number }
      | { type: "time.seek"; seekToPercentage: number }
      | { type: "time.seeking"; currentTime: number }
      | { type: "time.backward" }
      | { type: "time.forward" }
      | { type: "time.backward.keyboard" }
      | { type: "time.forward.keyboard" }
      | { type: "play" }
      | { type: "pause" }
      | { type: "video.click" }
      | { type: "toggle" }
      | { type: "toggle.keyboard" }
      | { type: "canplay" }
      | { type: "canplaythrough" }
      | { type: "waiting" }
      | { type: "play-state-animation.end" }
      | { type: "volume.mute.toggle" }
      | { type: "volume.set"; volume: number }
      | {
          type: "animate";
          animation: "playing" | "paused" | "backward" | "forward";
        }
      | { type: "fullscreen.toggle" }
      | { type: "fullscreen.expanded" }
      | { type: "fullscreen.exited" }
      | { type: "fullscreen.error" },
    context: {} as {
      videoSrc: string;
      videoPoster: string;
      currentVideoSrc: string | undefined;
      videoDuration: number | undefined;
      videoCurrentTime: number;
      volume: number;
      muted: boolean;
      animationActionTimestamp: string;
      isTouchDevice: boolean;
    },
    input: {} as {
      videoSrc: string;
      videoPoster: string;
    },
    tags: {} as
      | "Show loading overlay"
      | "Show loader"
      | "Show controls"
      | "Animate action"
      | "Animate playing state"
      | "Animate paused state"
      | "Animate backward"
      | "Animate forward",
  },
  actions: {
    "Play the video": () => {},
    "Pause the video": () => {},
    "Set video current time": (_, params: { seekTo: number }) => {},
    "Set video muted": (_, params: { muted: boolean }) => {},
    "Set video volume": (_, params: { volume: number }) => {},
    "Set animation timestamp to now": assign({
      animationActionTimestamp: () => new Date().toISOString(),
    }),
    "Set video fullscreen state": (
      _,
      _params: { setFullScreen: boolean }
    ) => {},
  },
  guards: {
    "Is not touch device": ({ context }) => !context.isTouchDevice,
    "Is touch device": ({ context }) => context.isTouchDevice,
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
    animationActionTimestamp: "",
    isTouchDevice:
      typeof window !== "undefined"
        ? window.matchMedia("(hover: none)").matches === true
        : false,
  }),
  type: "parallel",
  states: {
    Video: {
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
            "video.click": {
              description:
                "Centralize the side effects to run by raising a toggle event.",
              actions: raise({
                type: "toggle",
              }),
            },
            "toggle.*": {
              target: "Initial loading",
              actions: assign({
                currentVideoSrc: ({ context }) => context.videoSrc,
              }),
            },
          },
        },
        "Initial loading": {
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
          on: {
            "metadata.loaded": {
              target: "#Video Player.Video.Ready",
              actions: assign({
                videoDuration: ({ event }) => event.videoDuration,
              }),
            },
          },
        },
        Ready: {
          type: "parallel",
          states: {
            Controls: {
              initial: "Playing",
              states: {
                Playing: {
                  entry: "Play the video",
                  initial: "Hovering",
                  states: {
                    Idle: {
                      on: {
                        "hover.hovering": {
                          guard: "Is not touch device",
                          target: "Hovering",
                        },
                        "video.click": {
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
                        "video.click": {
                          guard: "Is touch device",
                          target: "Idle",
                        },
                        "hover.end": {
                          guard: "Is not touch device",
                          target: "Idle",
                        },
                        "hover.hovering": {
                          guard: "Is not touch device",
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
                    "video.click": {
                      guard: "Is not touch device",
                      target: "Paused",
                      actions: raise({
                        type: "animate",
                        animation: "paused",
                      }),
                    },
                    "toggle.*": {
                      target: "Paused",
                      actions: raise({
                        type: "animate",
                        animation: "paused",
                      }),
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
                  entry: "Pause the video",
                  initial: "Showing controls",
                  states: {
                    Idle: {
                      on: {
                        "video.click": {
                          guard: "Is touch device",
                          target: "Showing controls",
                        },
                      },
                    },
                    "Showing controls": {
                      tags: "Show controls",
                      on: {
                        "video.click": {
                          guard: "Is touch device",
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
                    "video.click": {
                      guard: "Is not touch device",
                      target: "Playing",
                      actions: raise({
                        type: "animate",
                        animation: "playing",
                      }),
                    },
                    "toggle.keyboard": {
                      target: "Playing",
                      actions: raise({
                        type: "animate",
                        animation: "playing",
                      }),
                    },
                  },
                },
              },
              on: {
                "time.seek": {
                  actions: {
                    type: "Set video current time",
                    params: ({ context, event }) => ({
                      seekTo:
                        (context.videoDuration! * event.seekToPercentage) / 100,
                    }),
                  },
                },
                "time.seeking": {
                  actions: assign({
                    videoCurrentTime: ({ event }) => event.currentTime,
                  }),
                },
                "time.backward.*": {
                  actions: enqueueActions(({ context, enqueue, event }) => {
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

                    if (event.type.endsWith(".keyboard")) {
                      enqueue.raise({
                        type: "animate",
                        animation: "backward",
                      });
                    }
                  }),
                },
                "time.forward.*": {
                  actions: enqueueActions(({ context, enqueue, event }) => {
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

                    if (event.type.endsWith(".keyboard")) {
                      enqueue.raise({
                        type: "animate",
                        animation: "forward",
                      });
                    }
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
            Animation: {
              initial: "Idle",
              states: {
                Idle: {},
                "Animating playing state": {
                  tags: ["Animate action", "Animate playing state"],
                },
                "Animating paused state": {
                  tags: ["Animate action", "Animate paused state"],
                },
                "Animating backward": {
                  tags: ["Animate action", "Animate backward"],
                },
                "Animating forward": {
                  tags: ["Animate action", "Animate forward"],
                },
              },
              on: {
                "play-state-animation.end": {
                  target: ".Idle",
                },
                animate: [
                  {
                    guard: ({ event }) => event.animation === "playing",
                    target: ".Animating playing state",
                    actions: "Set animation timestamp to now",
                  },
                  {
                    guard: ({ event }) => event.animation === "paused",
                    target: ".Animating paused state",
                    actions: "Set animation timestamp to now",
                  },
                  {
                    guard: ({ event }) => event.animation === "backward",
                    target: ".Animating backward",
                    actions: "Set animation timestamp to now",
                  },
                  {
                    guard: ({ event }) => event.animation === "forward",
                    target: ".Animating forward",
                    actions: "Set animation timestamp to now",
                  },
                ],
              },
            },
          },
        },
      },
    },
    Fullscreen: {
      initial: "Off",
      states: {
        Off: {
          initial: "Idle",
          states: {
            Idle: {
              on: {
                "fullscreen.toggle": {
                  target: "Waiting for acknowledgement",
                  actions: {
                    type: "Set video fullscreen state",
                    params: {
                      setFullScreen: true,
                    },
                  },
                },
              },
            },
            "Waiting for acknowledgement": {
              on: {
                "fullscreen.expanded": {
                  target: "Done",
                },
                "fullscreen.error": {
                  target: "Idle",
                },
                "fullscreen.exited": {
                  target: "Idle",
                },
              },
            },
            Done: {
              type: "final",
            },
          },
          onDone: {
            target: "On",
          },
          on: {
            "fullscreen.expanded": {
              target: "On",
              description: `The transition is taken when the fullscreen state has been changed without a user action we controled.`,
            },
          },
        },
        On: {
          initial: "Idle",
          states: {
            Idle: {
              on: {
                "fullscreen.toggle": {
                  target: "Waiting for acknowledgement",
                  actions: {
                    type: "Set video fullscreen state",
                    params: {
                      setFullScreen: false,
                    },
                  },
                },
              },
            },
            "Waiting for acknowledgement": {
              on: {
                "fullscreen.exited": {
                  target: "Done",
                },
                "fullscreen.error": {
                  target: "Idle",
                },
                "fullscreen.expanded": {
                  target: "Idle",
                },
              },
            },
            Done: {
              type: "final",
            },
          },
          onDone: {
            target: "Off",
          },
          on: {
            "fullscreen.exited": {
              target: "Off",
              description: `The transition is taken when the fullscreen state has been changed without a user action we controled.`,
            },
          },
        },
      },
    },
  },
});
