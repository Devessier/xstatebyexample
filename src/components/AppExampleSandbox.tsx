import { useState } from "react";
import { css, cx } from "../../styled-system/css";
import { flex } from "../../styled-system/patterns";
import { Tooltip } from "@ark-ui/react";
import { createBrowserInspector } from "@statelyai/inspect";
import type { ActorOptions, AnyActorLogic } from "xstate";

type ExampleComponent = React.FunctionComponent<{
  actorOptions: ActorOptions<AnyActorLogic> | undefined;
}>;

function InspectorSetter({
  isInspectorEnabled,
  Example,
}: {
  isInspectorEnabled: boolean;
  Example: ExampleComponent;
}) {
  const [inspector] = useState(() => {
    if (isInspectorEnabled === false) {
      return undefined;
    }

    return createBrowserInspector();
  });
  const actorOptions: ActorOptions<AnyActorLogic> | undefined =
    inspector === undefined
      ? undefined
      : {
          inspect: inspector.inspect as any,
        };

  return <Example actorOptions={actorOptions} />;
}

export function AppExampleSandbox({
  Example,
}: {
  Example: ExampleComponent;
}) {
  const [key, setKey] = useState(0);
  const [isInspectorEnabled, setIsInspectorEnabled] = useState(false);

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
      <InspectorSetter
        key={key}
        Example={Example}
        isInspectorEnabled={isInspectorEnabled}
      />

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
          <Tooltip.Root openDelay={0}>
            <Tooltip.Trigger>
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
                onClick={() => {
                  setIsInspectorEnabled(true);
                  setKey(key + 1);
                }}
              >
                Visualize
              </button>
            </Tooltip.Trigger>

            <Tooltip.Positioner>
              <Tooltip.Content
                className={css({
                  background: "gray.950",
                  borderRadius: "sm",
                  boxShadow: "sm",
                  color: "white",
                  fontWeight: "semibold",
                  px: "3",
                  py: "2",
                  textStyle: "xs",
                  _open: {
                    animation: "fadeIn 0.25s ease-out",
                  },
                  _closed: {
                    animation: "fadeOut 0.2s ease-out",
                  },
                })}
              >
                Visualize the demo in Stately Inspector
              </Tooltip.Content>
            </Tooltip.Positioner>
          </Tooltip.Root>
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
