import { css, sva } from "../../../styled-system/css";
import { useActor } from "@xstate/react";
import { videoPlayerMachine } from "./machine";
import { flex } from "../../../styled-system/patterns";
import type { ActorOptions, AnyActorLogic } from "xstate";
import { useRef } from "react";
import { PauseCircleIcon, PlayCircleIcon } from "@heroicons/react/24/solid";
import { Transition } from "@headlessui/react";
import { Slider } from "@ark-ui/react";

interface Props {
  actorOptions: ActorOptions<AnyActorLogic> | undefined;
}

export function Demo({ actorOptions }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [state, send] = useActor(
    videoPlayerMachine.provide({
      actions: {
        "Play the video": () => {
          videoRef.current?.play();
        },
        "Pause the video": () => {
          videoRef.current?.pause();
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

  return (
    <div
      onMouseEnter={() => {
        send({
          type: "hover.start",
        });
      }}
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
      className={css({ px: "4", py: "2" })}
    >
      <div className={css({ pos: "relative" })}>
        <video
          ref={videoRef}
          poster={state.context.videoPoster}
          src={state.context.currentVideoSrc}
          onCanPlay={() => {
            send({
              type: "canplay",
            });
          }}
          onCanPlayThrough={() => {
            console.log("onCanPlayThrough");

            send({
              type: "canplaythrough",
            });
          }}
          onWaiting={() => {
            send({
              type: "waiting",
            });
          }}
          onPlay={() => {
            // To sync when the video state was changed not from the UI (device controls, pip)

            send({
              type: "play",
            });
          }}
          onPause={() => {
            // To sync when the video state was changed not from the UI (device controls, pip)

            send({
              type: "pause",
            });
          }}
          className={css({
            aspectRatio: "wide",
            objectFit: "cover",
          })}
        />

        {state.matches("Stopped") === true ? (
          <div
            className={flex({
              pos: "absolute",
              inset: "0",
              bg: "gray.900/60",
              justifyContent: "center",
              alignItems: "center",
            })}
          >
            <button
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
          </div>
        ) : null}

        {state.matches("Ready") === true ? (
          <Transition
            unmount={false}
            show={
              state.matches({ Ready: { Playing: "Hovering" } }) === true ||
              state.matches({ Ready: "Paused" }) === true
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
                bg: "gray.900/60",
              })}
            />

            <div
              className={flex({
                pos: "absolute",
                inset: "0",
                justifyContent: "center",
                alignItems: "center",
              })}
            >
              <button
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
                {state.matches({ Ready: "Playing" }) === true ? (
                  <PauseCircleIcon
                    className={css({ h: "16", w: "16", color: "white" })}
                  />
                ) : (
                  <PlayCircleIcon
                    className={css({ h: "16", w: "16", color: "white" })}
                  />
                )}
              </button>
            </div>

            <div
              className={flex({
                pos: "absolute",
                bottom: "0",
                insetX: "0",
                px: "4",
                py: "2",
              })}
            >
              <VideoSlider />
            </div>
          </Transition>
        ) : null}

        {state.matches("Loading") === true ? (
          <div
            className={css({
              pos: "absolute",
              inset: "0",
              bg: "gray.900/10",
            })}
          >
            Loading
          </div>
        ) : null}
      </div>
    </div>
  );
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
      flexDirection: "column",
      gap: "1",
      width: "full",
    },
    control: {
      height: "5",
      position: "relative",
      display: "flex",
      alignItems: "center",
    },
    track: {
      height: "2",
      backgroundColor: "gray.300",
      borderRadius: "full",
      overflow: "hidden",
      flex: "1",
    },
    range: {
      height: "2",
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
});

function VideoSlider() {
  const styles = sliderStyle({});

  return (
    <Slider.Root className={styles.root}>
      <Slider.Control className={styles.control}>
        <Slider.Track className={styles.track}>
          <Slider.Range className={styles.range} />
        </Slider.Track>
        <Slider.Thumb index={0} className={styles.thumb} />
      </Slider.Control>
    </Slider.Root>
  );
}
