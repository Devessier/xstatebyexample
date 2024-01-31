import { useState } from "react";
import { css } from "../../../styled-system/css/index";
import { AppExampleSandbox } from "../../components/AppExampleSandbox.tsx";
import { Demo } from "./Demo.tsx";
import { Tooltip } from "@ark-ui/react";

export default function DemoEntrypoint() {
  const [key, setKey] = useState(0);

  return (
    <div className={css({ pos: "relative" })}>
      <AppExampleSandbox key={key} Example={Demo} />

      <div
        className={css({ pos: "absolute", top: 0, left: 0, mt: "4", ml: "4" })}
      >
        <Tooltip.Root openDelay={0} positioning={{ strategy: "fixed" }}>
          <Tooltip.Trigger
            type="button"
            className={css({
              rounded: "full",
              bgColor: "white",
              px: "2",
              py: "0.5",
              fontSize: "xs",
              fontWeight: "semibold",
              shadow: "1",
              borderWidth: "1",
              borderColor: "gray.300",
              cursor: "pointer",
              _hover: { bgColor: "gray.50" },
            })}
            onClick={() => {
              setKey(key + 1);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className={css({ h: "5", w: "5", color: "gray.900" })}
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
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
              Restart the machine from the beginning
            </Tooltip.Content>
          </Tooltip.Positioner>
        </Tooltip.Root>
      </div>
    </div>
  );
}
