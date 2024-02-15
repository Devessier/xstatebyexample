```tsx
/**
 * This demo is greatly inspired by VueUse's demo for the useIdle hook.
 * See https://github.com/vueuse/vueuse/blob/main/packages/core/useIdle/demo.vue.
 */

import { css } from "../../../styled-system/css";
import { useActor } from "@xstate/react";
import { userActivityMachine } from "./machine";
import type { ActorOptions, AnyActorLogic } from "xstate";
import { differenceInSeconds } from 'date-fns'
import { useEffect, useState } from "react";
import { vstack } from "../../../styled-system/patterns";

interface Props {
  actorOptions: ActorOptions<AnyActorLogic> | undefined;
}

export function Demo({ actorOptions }: Props) {
  const [snapshot] = useActor(userActivityMachine, {
    ...actorOptions,
    input: {
      timeout: 5_000 // 5 seconds; for demo purpose
    },
  });

  const isUserIdle = snapshot.matches('Inactive') === true;
  const now = useTimestamp();

  return (
    <div className={vstack({ gap: 2, px: "6", alignItems: "stretch", lineHeight: "normal" })}>
      <p className={css({ color: "gray.600", fontSize: "md", mb: "2" })}>The timeout has been reduced to <b>five seconds</b> for the demo. In the real-world you would be use a bigger one, like one minute.</p>
      
      <p>Idle: <span className={css({ color: isUserIdle === true ? "green.600" : "red.600", fontWeight: "medium" })}>{String(isUserIdle)}</span></p>

      <p>
        Inactive: <span className={css({ fontWeight: "medium", color: "orange.500", fontVariantNumeric: "tabular-nums" })}>{differenceInSeconds(now, snapshot.context.lastActive)}s</span>
      </p>
    </div>
  );
}

function useTimestamp() {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timerId = setInterval(() => {
      setNow(Date.now());
    }, 1_000)

    return () => {
      clearInterval(timerId);
    }
  }, [])

  return now;
}
```