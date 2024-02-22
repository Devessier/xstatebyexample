/**
 * This demo is greatly inspired by VueUse's demo for the useIdle hook.
 * See https://github.com/vueuse/vueuse/blob/main/packages/core/useIdle/demo.vue.
 */

import { css } from "../../../styled-system/css";
import { useActor } from "@xstate/react";
import type { ActorOptions, AnyActorLogic } from "xstate";
import { differenceInSeconds } from "date-fns";
import { useEffect, useState } from "react";
import { vstack } from "../../../styled-system/patterns";
import { userActivityMachine } from "./machine";

interface Props {
  actorOptions: ActorOptions<AnyActorLogic> | undefined;
}

export function Demo({ actorOptions }: Props) {
  const [snapshot] = useActor(userActivityMachine)

  const now = useTimestamp();

  return (
    <div
      className={vstack({
        gap: 2,
        px: "6",
        alignItems: "stretch",
        lineHeight: "normal",
      })}
    >
      <p className={css({ color: "gray.600", fontSize: "md", mb: "2" })}>
        The timeout has been reduced to <b>five seconds</b> for the demo. In the
        real-world you would be use a bigger one, like one minute.
      </p>

      <p>
        Idle:{" "}
        <span
          className={css({
            color: snapshot.matches("Inactive") === true ? "green.600" : "red.600",
            fontWeight: "medium",
          })}
        >
          {String(snapshot.matches("Inactive") === true)}
        </span>
      </p>

      <p>
        Inactive:{" "}
        <span
          className={css({
            fontWeight: "medium",
            color: "orange.500",
            fontVariantNumeric: "tabular-nums",
          })}
        >
          {differenceInSeconds(now, snapshot.context.lastActive)}s
        </span>
      </p>
    </div>
  );
}

function useTimestamp() {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timerId = setInterval(() => {
      setNow(Date.now());
    }, 1_000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  return now;
}
