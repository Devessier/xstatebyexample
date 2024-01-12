import { css } from "../../../styled-system/css";
import { useActor } from "@xstate/react";
import { debouncingMachine } from "./debouncing.machine";
import { createBrowserInspector } from "@statelyai/inspect";
import { useEffect, useMemo, useState } from "react";
import { grid } from "../../../styled-system/patterns";

export function ButtonDemo() {
  const inspector = useMemo(() => {
    console.log('create browser')
    
    return createBrowserInspector({
      // url: 'https://stately.ai/registry/inspect',
      iframe: document.querySelector('iframe#inspector') as HTMLIFrameElement,
      autoStart: true,
    })
  }, []);
  const [state, send] = useActor(debouncingMachine, {
    inspect: inspector.inspect,
  });

  useEffect(() => {
    inspector.start();
  }, [])

  return (
    <div className={grid({
      columns: 2,
      h: "full",
    })}>
      <button
        type="button"
        className={css({
          rounded: "md",
          bgColor: "indigo.50",
          pl: "2.5",
          pr: "2.5",
          pt: "1.5",
          pb: "1.5",
          fontSize: "sm",
          lineHeight: "sm",
          fontWeight: "semibold",
          color: "indigo.600",
          shadow: "sm",
          cursor: "pointer",
          placeSelf: "center",
          _hover: { bgColor: "indigo.100" },
        })}
        onClick={() => {
          send({ type: "click" });
        }}
      >
        Click me!
      </button>

      <div className={css({ placeSelf: "center", p: "4" })}>
        <p className={css({ m: "0", fontFamily: "mono", textAlign: "center" })}>
          {state.matches("Idle")
            ? "Click on the button!"
            : state.matches("Debouncing")
              ? "Stop to click to go to the next step"
              : "Performing a ressource-consuming task..."}
        </p>
      </div>
    </div>
  );
}
