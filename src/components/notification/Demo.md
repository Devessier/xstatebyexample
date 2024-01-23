```tsx
import { css } from "../../../styled-system/css";
import { useActor } from "@xstate/react";
import { notificationMachine } from "./machine";
import type { ActorOptions, AnyActorLogic } from "xstate";
import { Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { flex, vstack } from "../../../styled-system/patterns";
import { input } from "../authentication/recipes";

interface Props {
  actorOptions: ActorOptions<AnyActorLogic> | undefined;
}

export function Demo({ actorOptions }: Props) {
  const [state, send] = useActor(notificationMachine, actorOptions);

  const timeoutOptions: Array<{ title: string; value: number | undefined }> = [
    {
      title: "No timeout",
      value: undefined,
    },
    {
      title: "5s",
      value: 5_000,
    },
    {
      title: "10s",
      value: 10_000,
    },
  ];

  return (
    <div className={css({ pos: "relative" })}>
      <div
        aria-live="assertive"
        className={css({
          pointerEvents: "none",
          pos: "fixed",
          inset: "0",
          display: "flex",
          alignItems: "flex-start",
          p: "6",
          zIndex: "20",
        })}
      >
        <div
          className={css({
            display: "flex",
            w: "full",
            flexDir: "column",
            alignItems: "flex-end",
            mb: "4",
          })}
        >
          <Transition
            show={state.matches("Open") === true}
            as={Fragment}
            enter={css({
              transitionTimingFunction: "ease-out",
              transitionDuration: "slow",
              transitionProperty: "all",
            })}
            enterFrom={css({
              translate: "auto",
              opacity: "0",
              translateY: { base: "-2", sm: "0" },
              translateX: { sm: "2" },
            })}
            enterTo={css({
              translate: "auto",
              translateY: "0",
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
                borderColor: "gray.200",
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
                      strokeWidth="1.5"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
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
                      {state.context.title}
                    </p>
                    <p
                      className={css({
                        mt: "1",
                        fontSize: "md",
                        lineHeight: "tight",
                        color: "gray.500",
                      })}
                    >
                      {state.context.description}
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
                        send({
                          type: "close",
                        });
                      }}
                    >
                      <span className={css({ srOnly: true })}>
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

      <form
        className={vstack({ gap: "6", alignItems: "stretch", px: "4" })}
        onSubmit={(e) => {
          e.preventDefault();

          const formData = new FormData(e.currentTarget);
          const rawTitle = formData.get("title");
          const rawDescription = formData.get("description");
          const rawTimeout = formData.get("timeout");

          const timeout = rawTimeout === "" ? undefined : Number(rawTimeout);

          send({
            type: "trigger",
            title: String(rawTitle),
            description: String(rawDescription),
            timeout,
          });
        }}
      >
        <h2 className={css({ fontSize: "xl", fontWeight: "semibold", color: "gray.900" })}>
          Trigger a notification
        </h2>

        <div>
          <label
            htmlFor="title"
            className={css({
              display: "block",
              fontSize: "sm",
              fontWeight: "medium",
              color: "gray.900",
            })}
          >
            Title
          </label>

          <div className={css({ mt: "2" })}>
            <input id="title" name="title" type="text" required defaultValue="Successfully saved!" className={input()} />
          </div>
        </div>

        <div>
          <label
            htmlFor="description"
            className={css({
              display: "block",
              fontSize: "sm",
              fontWeight: "medium",
              color: "gray.900",
            })}
          >
            Description
          </label>

          <div className={css({ mt: "2" })}>
            <input
              id="description"
              name="description"
              type="text"
              required
              defaultValue="Your XState machine has been saved 👌"
              className={input()}
            />
          </div>
        </div>

        <div>
          <label
            className={css({
              display: "block",
              fontSize: "sm",
              fontWeight: "medium",
              color: "gray.900",
            })}
          >
            Timeout
          </label>

          <fieldset className={css({ mt: "2" })}>
            <legend className={css({ srOnly: true })}>
              Notification method
            </legend>
            <div className={vstack({ gap: "2", alignItems: "stretch" })}>
              {timeoutOptions.map(({ title, value }) => (
                <div
                  key={title}
                  className={css({ display: "flex", alignItems: "center" })}
                >
                  <input
                    id={title}
                    name="timeout"
                    type="radio"
                    defaultChecked={value === undefined}
                    value={value}
                    className={css({
                      h: "4",
                      w: "4",
                      borderColor: "gray.300",
                      color: "gray.600",
                    })}
                  />
                  <label
                    htmlFor={title}
                    className={css({
                      ml: "3",
                      display: "block",
                      fontSize: "sm",
                      fontWeight: "medium",
                      color: "gray.900",
                    })}
                  >
                    {title}
                  </label>
                </div>
              ))}
            </div>
          </fieldset>
        </div>

        <div className={flex({ justifyContent: "center" })}>
          <button
            type="submit"
            className={css({
              rounded: "md",
              bg: "gray.800",
              px: "2.5",
              py: "1.5",
              fontSize: "sm",
              lineHeight: "sm",
              fontWeight: "semibold",
              color: "gray.50",
              shadow: "sm",
              cursor: "pointer",
              _hover: { bgColor: "gray.700" },
            })}
          >
            Trigger the toast
          </button>
        </div>
      </form>
    </div>
  );
}
```