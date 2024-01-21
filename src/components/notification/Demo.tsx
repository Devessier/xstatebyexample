import { css } from "../../../styled-system/css";
import { useActor } from "@xstate/react";
import { notificationMachine } from "./machine";
import type { ActorOptions, AnyActorLogic } from "xstate";
import { Transition } from "@headlessui/react";
import { Fragment, useState } from "react";

interface Props {
  actorOptions: ActorOptions<AnyActorLogic> | undefined;
}

export function Demo({ actorOptions }: Props) {
  const [state, send] = useActor(notificationMachine, actorOptions);
  const [show, setShow] = useState(true);

  return (
    <div className={css({ pos: "relative", pt: "72" })}>
      <div
        aria-live="assertive"
        className={css({
          pointerEvents: "none",
          pos: "absolute",
          inset: "0",
          display: "flex",
          alignItems: "flex-start",
          p: "6",
        })}
      >
        <div
          className={css({
            display: "flex",
            w: "full",
            flexDir: "column",
            alignItems: "flex-end",
            my: "4",
          })}
        >
          <Transition
            show={show}
            as={Fragment}
            enter={css({
              transitionTimingFunction: "ease-out",
              transitionDuration: "slow",
              transitionProperty: "all",
            })}
            enterFrom={css({
              translate: "auto",
              opacity: "0",
              translateX: "2",
            })}
            enterTo={css({
              translate: "auto",
              translateX: "0",
              opacity: "1",
            })}
            leave={css({
              transitionTimingFunction: "ease-in",
              transitionDuration: "fast",
              transitionProperty: "all",
            })}
            leaveFrom={css({ opacity: "1" })}
            leaveTo={css({ opacity: "0" })}
          >
            <div
              className={css({
                pointerEvents: "auto",
                w: "full",
                maxW: "sm",
                overflow: "hidden",
                rounded: "lg",
                bgColor: "white",
                shadow: "lg",
                borderWidth: "1",
                borderStyle: "solid",
                borderColor: "gray.50",
              })}
            >
              <div className={css({ p: "4" })}>
                <div
                  className={css({ display: "flex", alignItems: "flex-start" })}
                >
                  <div className={css({ flexShrink: "0" })}>
                    <svg
                      className={css({ h: "7", w: "7", color: "green.400" })}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div
                    className={css({ ml: "3", w: "0", flex: "1", pt: "0.5" })}
                  >
                    <p
                      className={css({
                        fontSize: "md",
                        lineHeight: "tight",
                        fontWeight: "medium",
                        color: "gray.900",
                      })}
                    >
                      Successfully saved!
                    </p>
                    <p
                      className={css({
                        mt: "1",
                        fontSize: "md",
                        lineHeight: "tight",
                        color: "gray.500",
                      })}
                    >
                      Anyone with a link can now view this file.
                    </p>
                  </div>
                  <div
                    className={css({
                      ml: "4",
                      display: "flex",
                      flexShrink: "0",
                    })}
                  >
                    <button
                      type="button"
                      className={css({
                        display: "inline-flex",
                        rounded: "md",
                        bgColor: "white",
                        color: "gray.400",
                        cursor: "pointer",
                        _hover: { color: "gray.500" },
                        _focus: {
                          ring: "none",
                          ringOffset: "none",
                          shadow: "2",
                        },
                      })}
                      onClick={() => {
                        setShow(false);
                      }}
                    >
                      <span
                        className={css({
                          pos: "absolute",
                          w: "sr.only",
                          h: "sr.only",
                          p: "sr.only",
                          m: "sr.only",
                          overflow: "hidden",
                          clip: "rect(0, 0, 0, 0)",
                          whiteSpace: "nowrap",
                          borderWidth: "0",
                        })}
                      >
                        Close
                      </span>
                      <svg
                        className={css({ h: "5", w: "5" })}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>

      <div className={css({})}>
        <button
          type="button"
          className={css({
            rounded: "md",
            bgColor: "gray.50",
            px: "2.5",
            py: "1.5",
            fontSize: "sm",
            lineHeight: "sm",
            fontWeight: "semibold",
            color: "gray.600",
            shadow: "sm",
            cursor: "pointer",
            _hover: { bgColor: "gray.100" },
          })}
          onClick={() => {
            setShow(true);
          }}
        >
          Trigger the toast
        </button>
      </div>
    </div>
  );
}
