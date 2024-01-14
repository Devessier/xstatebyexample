import { css } from "../../../styled-system/css";
import { useActor } from "@xstate/react";
import { searchAsYouTypeMachine } from "./machine";
import type { ActorOptions, AnyActorLogic } from "xstate";
import { useClickAway } from "@uidotdev/usehooks";

interface Props {
  actorOptions: ActorOptions<AnyActorLogic> | undefined;
}

export function Demo({ actorOptions }: Props) {
  const [state, send] = useActor(searchAsYouTypeMachine, actorOptions);
  const ref = useClickAway<HTMLDivElement>(() => {
    send({
      type: "combobox.click-outside",
    });
  });

  return (
    <div
      className={css({ w: "full", maxW: "md", mx: "auto", px: "2", py: "2" })}
    >
      <div ref={ref} className={css({ pos: "relative" })}>
        <input
          placeholder="Type your search..."
          className={css({
            py: "1",
            pl: "3",
            pr: "10",
            appearance: "none",
            background: "none",
            borderColor: "gray.300",
            rounded: "md",
            borderWidth: 1,
            shadow: "sm",
            color: "gray.900",
            fontSize: "md",
            outline: 0,
            position: "relative",
            transitionDuration: "normal",
            transitionProperty: "box-shadow, border-color",
            transitionTimingFunction: "default",
            width: "full",
            _focus: {
              borderColor: "gray.600",
              boxShadow: "0 0 0 1px var(--colors-gray-600)",
            },
            _placeholder: {
              color: "gray.400",
            },
          })}
          value={state.context.searchInput}
          onChange={(e) => {
            send({
              type: "input.change",
              searchInput: e.target.value,
            });
          }}
          onFocus={() => {
            send({
              type: "input.focus",
            });
          }}
        />

        {state.hasTag("Display loader") === true ? (
          <span
            className={css({
              animation: "spin",
              pos: "absolute",
              insetY: 0,
              right: "0",
              display: "flex",
              alignItems: "center",
              roundedTopRight: "md",
              roundedBottomRight: "md",
              px: "2",
              _focus: { ring: "none", ringOffset: "none" },
            })}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className={css({ h: "5", w: "5", color: "gray.400" })}
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
          </span>
        ) : null}

        {state.matches("Active") === true ? (
          <ul
            className={css({
              pos: "absolute",
              zIndex: "10",
              mt: "1",
              maxH: "60",
              w: "full",
              overflow: "auto",
              rounded: "md",
              bgColor: "white",
              py: "1",
              fontSize: "md",
              lineHeight: "md",
              shadow: "lg",
              borderWidth: 1,
              borderColor: "gray.200",
            })}
          >
            {state.context.availableItems.length === 0 ? (
              <div
                className={css({
                  color: "gray.700",
                  userSelect: "none",
                  px: "4",
                  py: "1",
                })}
              >
                {state.context.lastFetchedSearch === ""
                  ? "Start typing to see some results here."
                  : "No results matching this query."}
              </div>
            ) : (
              state.context.availableItems.map((item, index) => (
                <li
                  key={item}
                  aria-selected={state.context.activeItemIndex === index}
                  className={css({
                    pos: "relative",
                    cursor: "default",
                    userSelect: "none",
                    py: "2",
                    px: "3",
                    _selected: {
                      bg: "gray.200",
                    },
                  })}
                  onMouseEnter={() => {
                    send({
                      type: "item.mouseenter",
                      itemId: index,
                    });
                  }}
                  onMouseLeave={() => {
                    send({
                      type: "item.mouseleave",
                    });
                  }}
                  onClick={() => {
                    send({
                      type: "item.click",
                      itemId: index,
                    });
                  }}
                >
                  {item}
                </li>
              ))
            )}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
