import { css, cx } from "../../../styled-system/css";
import { useActor } from "@xstate/react";
import { debouncingMachine } from "./debouncing.machine";
import { createBrowserInspector } from "@statelyai/inspect";
import { useState, useSyncExternalStore } from "react";
import { flex } from "../../../styled-system/patterns";

function WithMachine({
  isInspectorEnabled,
  onInspectorEnable,
}: {
  isInspectorEnabled: boolean;
  onInspectorEnable: () => void;
}) {
  const [inspector] = useState(() => {
    if (isInspectorEnabled === false) {
      return undefined;
    }

    return createBrowserInspector();
  });

  const [state, send] = useActor(
    debouncingMachine,
    inspector
      ? {
          inspect: inspector.inspect,
        }
      : undefined
  );

  return (
    <div
      className={cx(
        css({
          py: "12",
          mt: "12",
          borderWidth: 2,
          borderColor: "gray.300",
          rounded: "md",
          pos: "relative",
        }),
        "not-prose"
      )}
    >
      <div
        className={css({
          display: "flex",
          flexDir: "column",
          alignItems: "center",
        })}
      >
        <p
          className={css({
            fontSize: "4xl",
            color: "red.700",
            mb: "6",
            fontVariantNumeric: "tabular-nums",
            fontFamily: "mono",
          })}
        >
          Count: {state.context.counter}
        </p>

        <div className={flex({ columnGap: "4" })}>
          <button
            type="button"
            className={css({
              rounded: "md",
              bgColor: "red.50",
              px: "2.5",
              py: "1.5",
              fontSize: "sm",
              lineHeight: "sm",
              fontWeight: "semibold",
              color: "red.600",
              shadow: "sm",
              cursor: "pointer",
              _hover: { bgColor: "red.100" },
            })}
            onClick={() => {
              send({ type: "reset" });
            }}
          >
            Reset
          </button>

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
              send({ type: "click" });
            }}
          >
            Increment
          </button>
        </div>

        <div className={flex({ mt: "4" })}>
          <span
            className={css({
              visibility: state.matches("Debouncing") ? undefined : "hidden",
              display: "inline-flex",
              alignItems: "center",
              columnGap: "1.5",
              rounded: "full",
              bgColor: "yellow.100",
              px: "2",
              py: "0.5",
              fontSize: "xs",
              lineHeight: "xs",
              fontWeight: "medium",
              color: "yellow.800",
            })}
          >
            <svg
              className={css({ h: "1.5", w: "1.5", fill: "yellow.500" })}
              viewBox="0 0 6 6"
              aria-hidden="true"
            >
              <circle cx={3} cy={3} r={3} />
            </svg>
            Debouncing
          </span>
        </div>
      </div>

      <div
        className={flex({
          pos: "absolute",
          right: 0,
          top: 0,
          mt: "4",
          mr: "4",
        })}
      >
        {isInspectorEnabled === false ? (
          <button
            type="button"
            className={css({
              rounded: "full",
              bgColor: "white",
              px: "2",
              py: "0.5",
              fontSize: "xs",
              fontWeight: "semibold",
              color: "gray.900",
              shadow: "1",
              borderWidth: "1",
              borderColor: "gray.300",
              cursor: "pointer",
              _hover: { bgColor: "gray.50" },
            })}
            onClick={onInspectorEnable}
          >
            Visualize
          </button>
        ) : (
          <span
            className={css({
              display: "inline-flex",
              alignItems: "center",
              columnGap: "1.5",
              rounded: "full",
              bgColor: "green.100",
              px: "2",
              py: "0.5",
              fontSize: "xs",
              fontWeight: "medium",
              color: "green.800",
            })}
          >
            <svg
              className={css({ h: "1.5", w: "1.5", fill: "green.500" })}
              viewBox="0 0 6 6"
              aria-hidden="true"
            >
              <circle cx={3} cy={3} r={3} />
            </svg>
            Visualizing
          </span>
        )}
      </div>
    </div>
  );
}

export function ButtonDemo() {
  const [isInspectorEnabled, setIsInspectorEnabled] = useState(false);

  return (
    <WithMachine
      key={String(isInspectorEnabled)}
      isInspectorEnabled={isInspectorEnabled}
      onInspectorEnable={() => {
        setIsInspectorEnabled(true);
      }}
    />
  );
}
