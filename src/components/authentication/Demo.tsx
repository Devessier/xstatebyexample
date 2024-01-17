import { css } from "../../../styled-system/css";
import { useActor } from "@xstate/react";
import { authenticationMachine } from "./machine";
import { flex } from "../../../styled-system/patterns";
import type { ActorOptions, AnyActorLogic } from "xstate";
import { input } from "./recipes";
import { useState } from "react";

interface Props {
  actorOptions: ActorOptions<AnyActorLogic> | undefined;
}

export function Demo({ actorOptions }: Props) {
  const [state, send] = useActor(authenticationMachine, actorOptions);

  return (
    <div className={css({ minH: "96", display: "grid" })}>
      {/* <LoadingUserState /> */}
      <SignOnForm />
    </div>
  );
}

function LoadingUserState() {
  return (
    <div
      className={css({
        bg: "gray.100",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        my: "-12",
        rounded: "md",
      })}
    >
      <div
        className={css({
          px: "8",
          py: "6",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          bg: "white",
          shadow: "lg",
          rounded: "md",
        })}
      >
        <p className={css({ fontSize: "md" })}>Loading user data</p>

        <div className={css({ mt: "2" })}>
          <span
            className={css({
              animation: "spin",
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
        </div>
      </div>
    </div>
  );
}

function SignOnForm() {
  const [form, setForm] = useState<"sign in" | "sign up">("sign in");

  return (
    <div
      className={css({
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        w: "full",
        maxW: { base: "full", sm: "sm" },
        mx: "auto",
      })}
    >
      <h2
        className={css({
          textAlign: "center",
          fontSize: "2xl",
          fontWeight: "bold",
          color: "gray.900",
        })}
      >
        {form === "sign in" ? "Sign in" : "Sign up"}
      </h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className={css({
          mt: "8",
          "& > *": { mt: "6", _first: { mt: "0" } },
        })}
      >
        <div>
          <label
            htmlFor="username"
            className={css({
              display: "block",
              fontSize: "sm",
              fontWeight: "medium",
              color: "gray.900",
            })}
          >
            Username
          </label>

          <div className={css({ mt: "2" })}>
            <input id="username" className={input()} />
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className={css({
              display: "block",
              fontSize: "sm",
              fontWeight: "medium",
              color: "gray.900",
            })}
          >
            Password
          </label>

          <div className={css({ mt: "2" })}>
            <input id="password" className={input()} />
          </div>
        </div>

        <button
          type="submit"
          className={css({
            w: "full",
            display: "flex",
            justifyContent: "center",
            rounded: "md",
            bg: "gray.900",
            color: "white",
            px: "2",
            py: "1",
            fontSize: "sm",
            fontWeight: "semibold",
            shadow: "sm",
            cursor: "pointer",
            _hover: { bg: "gray.800" },
          })}
        >
          Submit
        </button>
      </form>

      <p
        className={css({
          mt: "10",
          textAlign: "center",
          fontSize: "sm",
          color: "gray.500",
        })}
      >
        {form === "sign in"
          ? "Don't have an account yet?"
          : "Already have an account?"}{" "}
        <button
          className={css({
            fontWeight: "semibold",
            cursor: "pointer",
            color: "gray.900",
            _hover: { color: "gray.800" },
          })}
          onClick={() => {
            setForm(form === "sign in" ? "sign up" : "sign in");
          }}
        >
          {form === "sign in" ? "Sign up now!" : "Sign in now!"}
        </button>
      </p>
    </div>
  );
}
