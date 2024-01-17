import { css } from "../../../styled-system/css";
import { useActorRef, useSelector } from "@xstate/react";
import { authenticationMachine, type SignOnErrorCode } from "./machine";
import type { ActorOptions, ActorRefFrom, AnyActorLogic } from "xstate";
import { input } from "./recipes";
import { useEffect, useState } from "react";
import { grid } from "../../../styled-system/patterns";

interface Props {
  actorOptions: ActorOptions<AnyActorLogic> | undefined;
}

export function Demo({ actorOptions }: Props) {
  const actorRef = useActorRef(authenticationMachine, actorOptions);
  const screenToRender = useSelector(actorRef, (state) => {
    if (state.matches("Checking if user is initially authenticated")) {
      return "loading" as const;
    }

    if (state.matches("Authenticated")) {
      return "authenticated" as const;
    }

    if (state.matches("Not authenticated")) {
      return "not authenticated" as const;
    }

    throw new Error(
      `Reached an unreachable state: ${JSON.stringify(state.value)}`
    );
  });

  return (
    <div className={css({ minH: "96", display: "grid" })}>
      {screenToRender === "loading" ? (
        <LoadingUserState />
      ) : screenToRender === "not authenticated" ? (
        <SignOnForm actorRef={actorRef} />
      ) : (
        <Dashboard actorRef={actorRef} />
      )}
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

function SignOnForm({
  actorRef,
}: {
  actorRef: ActorRefFrom<typeof authenticationMachine>;
}) {
  /**
   * Usually you would use a JS router but we don't have one here!
   */
  const [form, setForm] = useState<"sign in" | "sign up">("sign in");

  const [validationError, setValidationError] = useState<string | undefined>(
    undefined
  );
  const serverError = useSelector(
    actorRef,
    (state) => state.context.authenticationErrorToast
  );

  useEffect(() => {
    /**
     * Clear the toast when switching to the other authentication page.
     *
     * In our case, listening to changes on form state is an easy way
     * to clear the toast.
     */
    return () => {
      actorRef.send({
        type: "switching sign-on page",
      });

      setValidationError(undefined);
    };
  }, [form]);

  function formatServerError(error: SignOnErrorCode) {
    switch (error) {
      case "unknown error": {
        return "An unknown error occured, please try again later.";
      }
      case "duplication": {
        return "The username you selected is already attributed to a user.";
      }
      case "invalid credentials": {
        return "The credentials you submitted are not valid.";
      }
      default: {
        throw new Error(
          `Unknown error: ${error}. Please provide a pretty message for it.`
        );
      }
    }
  }

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

      {validationError !== undefined || serverError !== undefined ? (
        <div
          className={css({ rounded: "md", bgColor: "red.50", p: "4", mt: "8" })}
        >
          <div className={css({ display: "flex" })}>
            <div className={css({ flexShrink: "0" })}>
              <svg
                className={css({ h: "5", w: "5", color: "red.400" })}
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div className={css({ ml: "3" })}>
              <h3
                className={css({
                  fontSize: "sm",
                  lineHeight: "sm",
                  fontWeight: "medium",
                  color: "red.800",
                })}
              >
                There was an error with your submission
              </h3>
              <div
                className={css({
                  mt: "2",
                  fontSize: "sm",
                  lineHeight: "sm",
                  color: "red.700",
                })}
              >
                <p>
                  {validationError !== undefined
                    ? validationError
                    : serverError !== undefined
                      ? formatServerError(serverError)
                      : null}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <form
        key={form}
        onSubmit={(e) => {
          e.preventDefault();

          const formData = new FormData(e.currentTarget);
          const username = formData.get("username");
          const password = formData.get("password");

          if (
            typeof username !== "string" ||
            typeof password !== "string" ||
            username.length === 0 ||
            password.length === 0
          ) {
            setValidationError("Username and password must be defined");

            return;
          }

          if (form === "sign in") {
            actorRef.send({
              type: "sign-in",
              username,
              password,
            });
          } else if (form === "sign up") {
            actorRef.send({
              type: "sign-up",
              username,
              password,
            });
          }
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
            <input
              id="username"
              name="username"
              type="text"
              className={input()}
            />
          </div>

          {form === "sign up" ? (
            <p className={css({ mt: "2", fontSize: "sm", color: "gray.500" })}>
              Any username is valid unless it's "XState".
            </p>
          ) : null}
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
            <input
              id="password"
              name="password"
              type="password"
              className={input()}
            />
          </div>

          {form === "sign in" ? (
            <p className={css({ mt: "2", fontSize: "sm", color: "gray.500" })}>
              Any password is valid if it contains 2 characters or more, e.g.
              "Test".
            </p>
          ) : null}
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

function Dashboard({
  actorRef,
}: {
  actorRef: ActorRefFrom<typeof authenticationMachine>;
}) {
  const userData = useSelector(actorRef, (state) => {
    const ud = state.context.userData;

    if (ud === null) {
      throw new Error(
        "User data must be defined when rendering the authenticated dashboard"
      );
    }

    return ud;
  });

  return (
    <div
      className={grid({
        minH: "full",
        gridTemplateRows: "auto 1fr",
        gap: 0,
        my: "-12",
      })}
    >
      <nav
        className={css({
          borderBottomWidth: "1px",
          borderColor: "gray.200",
          bgColor: "white",
        })}
      >
        <div
          className={css({
            ml: "auto",
            mr: "auto",
            maxW: "7xl",
            pl: "4",
            pr: "4",
            sm: { pl: "6", pr: "6" },
            lg: { pl: "8", pr: "8" },
          })}
        >
          <div
            className={css({
              display: "flex",
              h: "16",
              justifyContent: "center",
            })}
          >
            <div className={css({ display: "flex" })}>
              <div
                className={css({
                  display: "flex",
                  flexShrink: "0",
                  alignItems: "center",
                })}
              >
                <span className={css({ fontWeight: "medium", fontSize: "lg" })}>
                  Example with{" "}
                  <span className={css({ color: "red.700" })}>XState</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div
        className={css({
          pt: "10",
          pb: "10",
          bg: "gray.50",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        })}
      >
        <h2 className={css({ fontSize: "xl", fontWeight: "bold" })}>
          Welcome, {userData.username}!
        </h2>

        <button
          type="button"
          className={css({
            mt: "4",
            display: "flex",
            justifyContent: "center",
            rounded: "md",
            bg: "red.600",
            color: "white",
            px: "2",
            py: "1",
            fontSize: "sm",
            fontWeight: "semibold",
            shadow: "sm",
            cursor: "pointer",
            _hover: { bg: "red.500" },
          })}
          onClick={() => {
            actorRef.send({
              type: "sign-out",
            });
          }}
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
