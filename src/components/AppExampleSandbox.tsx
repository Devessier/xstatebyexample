import { css, cx } from "../../styled-system/css";
import { flex } from "../../styled-system/patterns";
import { Tooltip } from "@ark-ui/react";
import { createBrowserInspector } from "@statelyai/inspect";
import {
  type ActorOptions,
  type AnyActorLogic,
  setup,
  fromCallback,
  assign,
} from "xstate";
import { useActor } from "@xstate/react";

type BrowserInspector = ReturnType<typeof createBrowserInspector>;

type ExampleComponent = React.FunctionComponent<{
  actorOptions: ActorOptions<AnyActorLogic> | undefined;
}>;

const inspectorLauncherMachine = setup({
  types: {
    context: {} as {
      updateId: number;
      inspector: BrowserInspector | undefined;
    },
    events: {} as { type: "inspector.open" } | { type: "inspector.closed" },
  },
  actors: {
    "Wait for inspector window to be closed": fromCallback<
      any,
      { inspector: BrowserInspector }
    >(({ input, sendBack }) => {
      const timerId = setInterval(() => {
        const isInspectorClosed =
          input.inspector.adapter.targetWindow!.closed === true;

        if (isInspectorClosed === true) {
          sendBack({
            type: "inspector.closed",
          });
        }
      }, 1_000);

      return () => {
        clearInterval(timerId);
      };
    }),
  },
  actions: {
    "Create inspector and assign to context": assign({
      inspector: () => createBrowserInspector(),
    }),
    "Increment update id in context": assign({
      updateId: ({ context }) => context.updateId + 1,
    }),
  },
}).createMachine({
  context: {
    updateId: 0,
    inspector: undefined,
  },
  initial: "closed",
  states: {
    closed: {
      on: {
        "inspector.open": {
          target: "open",
          actions: [
            "Create inspector and assign to context",
            "Increment update id in context",
          ],
        },
      },
    },
    open: {
      invoke: {
        src: "Wait for inspector window to be closed",
        input: ({ context }) => {
          if (context.inspector === undefined) {
            throw new Error("Inspector must be defined in context");
          }

          return {
            inspector: context.inspector!,
          };
        },
      },
      on: {
        "inspector.closed": {
          target: "closed",
        },
      },
    },
  },
});

function InspectorSetter({
  inspector,
  Example,
}: {
  inspector: BrowserInspector | undefined;
  Example: ExampleComponent;
}) {
  const actorOptions: ActorOptions<AnyActorLogic> | undefined =
    inspector === undefined
      ? undefined
      : {
          inspect: inspector.inspect as any,
        };

  return <Example actorOptions={actorOptions} />;
}

export function AppExampleSandbox({ Example }: { Example: ExampleComponent }) {
  const [state, send] = useActor(inspectorLauncherMachine);

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
        key={state.context.updateId}
        Example={Example}
        inspector={state.context.inspector}
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
        {state.matches("closed") === true ? (
          <Tooltip.Root openDelay={0}>
            <Tooltip.Trigger
              onClick={() => {
                send({
                  type: "inspector.open",
                });
              }}
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
            >
              Visualize
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
