import { css, sva } from "../../../styled-system/css";
import { useActor } from "@xstate/react";
import { videoPlayerMachine } from "./machine";
import {
  center,
  flex,
  hstack,
  spacer,
  vstack,
} from "../../../styled-system/patterns";
import type { ActorOptions, AnyActorLogic } from "xstate";
import { useRef } from "react";
import {
  ArrowPathIcon,
  BackwardIcon,
  ForwardIcon,
  PauseCircleIcon,
  PlayCircleIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
} from "@heroicons/react/24/solid";
import { Transition } from "@headlessui/react";
import { Slider, Tooltip } from "@ark-ui/react";
import { intervalToDuration } from "date-fns";

interface Props {
  actorOptions: ActorOptions<AnyActorLogic> | undefined;
}

export function Demo({ actorOptions }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [snapshot, send] = useActor(
    videoPlayerMachine.provide({
      actions: {
        "Play the video": () => {
          videoRef.current?.play();
        },
        "Pause the video": () => {
          videoRef.current?.pause();
        },
        "Set video current time": (_, { seekTo }) => {
          videoRef.current!.currentTime = seekTo;
        },
        "Set video muted": (_, { muted }) => {
          console.log("set video muted", muted);

          videoRef.current!.muted = muted;
        },
        "Set video volume": (_, { volume }) => {
          videoRef.current!.volume = volume;
        },
      },
    }),
    {
      ...actorOptions,
      input: {
        videoPoster:
          "https://upload.wikimedia.org/wikipedia/commons/a/a7/Big_Buck_Bunny_thumbnail_vlc.png",
        videoSrc:
          "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      },
    }
  );
  const videoTitle = "Big Buck Bunny";

  return (
    <div className={css({ px: "4", py: "2" })}>
      <div
        // With the tabIndex, allow the video container to receive the focus, that way, we can listen to keyboard events
        // when the video is focused.
        tabIndex={-1}
        onMouseMove={() => {
          send({
            type: "hover.hovering",
          });
        }}
        onMouseLeave={() => {
          send({
            type: "hover.end",
          });
        }}
        onClick={(e) => {
          const uiControlAncestor = (e.target as HTMLElement).closest(
            "[data-ui-control]"
          );
          const hasUiControlAncestor = uiControlAncestor !== null;

          if (hasUiControlAncestor === true) {
            return;
          }

          send({
            type: "toggle.click",
          });
        }}
        onKeyDown={(event) => {
          switch (event.key) {
            case " ":
            case "k": {
              send({
                type: "toggle",
              });

              break;
            }
            case "ArrowLeft": {
              send({
                type: "time.backward",
              });

              break;
            }
            case "ArrowRight": {
              send({
                type: "time.forward",
              });

              break;
            }
            case "ArrowUp": {
              break;
            }
            case "ArrowDown": {
              break;
            }
            default: {
              // Stop processing unknown events.
              return;
            }
          }

          event.preventDefault();
        }}
        className={css({ pos: "relative" })}
      >
        <video
          ref={videoRef}
          poster={snapshot.context.videoPoster}
          src={snapshot.context.currentVideoSrc}
          onLoadedMetadata={() => {
            send({
              type: "metadata.loaded",
              videoDuration: videoRef.current!.duration,
            });
          }}
          onCanPlay={() => {
            send({
              type: "canplay",
            });
          }}
          onWaiting={() => {
            send({
              type: "waiting",
            });
          }}
          onPlay={() => {
            // To sync when the video snapshot was changed not from the UI (device controls, pip)

            send({
              type: "play",
            });
          }}
          onPause={() => {
            // To sync when the video snapshot was changed not from the UI (device controls, pip)

            send({
              type: "pause",
            });
          }}
          onTimeUpdate={() => {
            send({
              type: "time.update",
              currentTime: videoRef.current!.currentTime,
            });
          }}
          className={css({
            aspectRatio: "wide",
            objectFit: "cover",
          })}
        />

        {/* Not part of the Transition component as we want the animation to continue even if controls are hidden. */}
        {snapshot.hasTag("Animate playing state") === true ||
        snapshot.hasTag("Animate paused state") === true ? (
          <div
            className={center({
              pos: "absolute",
              inset: "0",
            })}
          >
            <div
              // Use the key to ensure the animation is restarted when the playing state changes quickly.
              key={
                snapshot.hasTag("Animate playing state") === true
                  ? "playing"
                  : "paused"
              }
              onAnimationEnd={() => {
                send({
                  type: "play-state-animation.end",
                });
              }}
              className={css({
                animation: "ping",
                animationIterationCount: "1!",
              })}
            >
              {snapshot.hasTag("Animate playing state") === true ? (
                <PlayCircleIcon
                  className={css({ h: "16", w: "16", color: "white" })}
                />
              ) : (
                <PauseCircleIcon
                  className={css({ h: "16", w: "16", color: "white" })}
                />
              )}
            </div>
          </div>
        ) : null}

        <Transition
          unmount={false}
          show={
            snapshot.hasTag("Show loading overlay") === true ||
            snapshot.hasTag("Show loader") === true ||
            snapshot.hasTag("Show controls") === true
          }
          enter={css({
            transition: "opacity",
            transitionDuration: "fastest",
          })}
          enterFrom={css({ opacity: 0 })}
          enterTo={css({ opacity: 1 })}
          leave={css({ transition: "opacity", transitionDuration: "fast" })}
          leaveFrom={css({ opacity: 1 })}
          leaveTo={css({ opacity: 0 })}
        >
          <div
            className={flex({
              pos: "absolute",
              inset: "0",
              bg: "linear-gradient(rgba(35, 35, 35, 0.8) 0%, rgba(35, 35, 35, 0) 40%, rgba(35, 35, 35, 0) 60%, rgba(35, 35, 35, 0.8) 100%)",
            })}
          />

          <p
            className={css({
              pos: "absolute",
              left: "4",
              top: "2",
              color: "white",
              fontWeight: "medium",
            })}
          >
            {videoTitle}
          </p>

          <div
            className={center({
              pos: "absolute",
              inset: "0",
            })}
          >
            {snapshot.hasTag("Show loader") === true ? (
              <ArrowPathIcon
                className={css({
                  color: "white",
                  w: "16",
                  h: "16",
                  animation: "spin",
                })}
              />
            ) : snapshot.matches("Stopped") === true ? (
              <button
                data-ui-control
                onClick={() => {
                  send({
                    type: "play",
                  });
                }}
                className={css({
                  rounded: "full",
                  overflow: "clip",
                })}
              >
                <PlayCircleIcon
                  className={css({ h: "16", w: "16", color: "white" })}
                />
              </button>
            ) : null}
          </div>

          <div
            className={vstack({
              display:
                snapshot.hasTag("Show controls") === true ? "flex" : "none",
              pos: "absolute",
              bottom: "0",
              insetX: "0",
              px: "4",
              py: "2",
              gap: "0.5",
              alignItems: "stretch",
            })}
          >
            <div className={hstack({ gap: "1" })}>
              <button
                data-ui-control
                onClick={() => {
                  send({
                    type: "time.backward",
                  });
                }}
                className={css({
                  rounded: "full",
                  overflow: "clip",
                })}
              >
                <BackwardIcon
                  className={css({ h: "6", w: "6", color: "white" })}
                />
              </button>

              <button
                data-ui-control
                onClick={() => {
                  send({
                    type: "toggle",
                  });
                }}
                className={css({
                  rounded: "full",
                  overflow: "clip",
                })}
              >
                {snapshot.matches({ Ready: "Playing" }) === true ? (
                  <PauseCircleIcon
                    className={css({ h: "10", w: "10", color: "white" })}
                  />
                ) : (
                  <PlayCircleIcon
                    className={css({ h: "10", w: "10", color: "white" })}
                  />
                )}
              </button>

              <button
                data-ui-control
                onClick={() => {
                  send({
                    type: "time.forward",
                  });
                }}
                className={css({
                  rounded: "full",
                  overflow: "clip",
                })}
              >
                <ForwardIcon
                  className={css({ h: "6", w: "6", color: "white" })}
                />
              </button>

              <div className={spacer({  })} />

              <div data-ui-control className={center()}>
                <Tooltip.Root
                  openDelay={0}
                  closeDelay={100}
                  interactive
                  positioning={{ placement: "top" }}
                >
                  <Tooltip.Trigger asChild>
                    <button
                      onClick={() => {
                        send({
                          type: "volume.mute.toggle",
                        });
                      }}
                      className={css({
                        rounded: "full",
                        overflow: "clip",
                      })}
                    >
                      {snapshot.context.muted === true ? (
                        <SpeakerXMarkIcon
                          className={css({ h: "6", w: "6", color: "white" })}
                        />
                      ) : (
                        <SpeakerWaveIcon
                          className={css({ h: "6", w: "6", color: "white" })}
                        />
                      )}
                    </button>
                  </Tooltip.Trigger>
                  <Tooltip.Positioner>
                    <Tooltip.Content
                      className={css({
                        h: "32",
                        bg: "neutral.800",
                        rounded: "full",
                        p: "2",
                      })}
                    >
                      <VolumeSlider
                        volume={snapshot.context.volume}
                        onVolumeChange={(volume) => {
                          send({
                            type: "volume.set",
                            volume,
                          });
                        }}
                      />
                    </Tooltip.Content>
                  </Tooltip.Positioner>
                </Tooltip.Root>
              </div>
            </div>

            <div
              className={flex({
                alignItems: "center",
                columnGap: "2",
              })}
            >
              <p
                className={css({
                  color: "gray.50",
                  fontWeight: "medium",
                  fontSize: "md",
                  fontVariantNumeric: "tabular-nums",
                })}
              >
                {formatTime(snapshot.context.videoCurrentTime ?? 0)}
              </p>

              <div data-ui-control className={css({ flexGrow: 1 })}>
                <VideoSlider
                  valuePercentage={
                    snapshot.context.videoDuration === undefined
                      ? 0
                      : (100 * snapshot.context.videoCurrentTime) /
                        snapshot.context.videoDuration
                  }
                  onValueChange={(valuePercentage) => {
                    console.log("slider value changed", valuePercentage);

                    send({
                      type: "time.seek",
                      seekToPercentage: valuePercentage,
                    });
                  }}
                />
              </div>

              <p
                className={css({
                  color: "gray.50",
                  fontWeight: "medium",
                  fontSize: "md",
                  fontVariantNumeric: "tabular-nums",
                })}
              >
                {formatTime(snapshot.context.videoDuration ?? 0)}
              </p>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  );
}

function formatTime(seconds: number) {
  const duration = intervalToDuration({ start: 0, end: seconds * 1000 });

  return `${String(duration.hours ?? 0).padStart(2, "0")}:${String(
    duration.minutes ?? 0
  ).padStart(2, "0")}:${String(duration.seconds ?? 0).padStart(2, "0")}`;
}

/**
 * Inspired by the Slider component of Park-UI.
 * See https://park-ui.com/docs/panda/components/slider.
 */
const sliderStyle = sva({
  slots: ["root", "control", "range", "thumb", "track"],
  base: {
    root: {
      display: "flex",
      gap: "1",
      _horizontal: {
        flexDirection: "column",
        width: "full",
      },
      _vertical: {
        flexDirection: "row",
        height: "full",
      },
    },
    control: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      _vertical: {
        flexDirection: "column",
      },
    },
    track: {
      backgroundColor: "gray.300",
      borderRadius: "full",
      overflow: "hidden",
      flex: "1",
    },
    range: {
      background: "white",
    },
    thumb: {
      height: "5",
      width: "5",
      background: "white",
      borderColor: "white",
      borderRadius: "full",
      borderWidth: "2px",
      boxShadow: "sm",
      outline: "none",
      zIndex: "1",
    },
  },
  defaultVariants: {
    size: "md",
  },
  variants: {
    size: {
      sm: {
        control: {
          _horizontal: {
            height: "4",
          },
          _vertical: {
            width: "4",
          },
        },
        range: {
          _horizontal: {
            height: "1.5",
          },
          _vertical: {
            width: "1.5",
          },
        },
        track: {
          _horizontal: {
            height: "1.5",
          },
          _vertical: {
            width: "1.5",
          },
        },
        thumb: {
          height: "4",
          width: "4",
        },
      },
      md: {
        control: {
          _horizontal: {
            height: "5",
          },
          _vertical: {
            width: "5",
          },
        },
        range: {
          _horizontal: {
            height: "2",
          },
          _vertical: {
            width: "2",
          },
        },
        track: {
          _horizontal: {
            height: "2",
          },
          _vertical: {
            width: "2",
          },
        },
        thumb: {
          height: "5",
          width: "5",
        },
      },
    },
  },
});

function VideoSlider({
  valuePercentage,
  onValueChange,
}: {
  valuePercentage: number;
  onValueChange: (valuePercentage: number) => void;
}) {
  const styles = sliderStyle({});

  return (
    <Slider.Root
      className={styles.root}
      min={0}
      max={100}
      value={[valuePercentage]}
      onValueChange={({ value }) => {
        onValueChange(value[0]);
      }}
    >
      <Slider.Control className={styles.control}>
        <Slider.Track className={styles.track}>
          <Slider.Range className={styles.range} />
        </Slider.Track>
        <Slider.Thumb index={0} className={styles.thumb} />
      </Slider.Control>
    </Slider.Root>
  );
}

function VolumeSlider({
  volume,
  onVolumeChange,
}: {
  volume: number;
  onVolumeChange: (volume: number) => void;
}) {
  const styles = sliderStyle({ size: "sm" });

  return (
    <Slider.Root
      className={styles.root}
      min={0}
      max={1}
      step={0.01}
      orientation="vertical"
      value={[volume]}
      onValueChange={({ value }) => {
        onVolumeChange(value[0]);
      }}
    >
      <Slider.Control className={styles.control}>
        <Slider.Track className={styles.track}>
          <Slider.Range className={styles.range} />
        </Slider.Track>
        <Slider.Thumb index={0} className={styles.thumb} />
      </Slider.Control>
    </Slider.Root>
  );
}
