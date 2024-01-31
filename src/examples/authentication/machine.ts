import { assertEvent, assign, fromPromise, setup } from "xstate";
import { wait } from "../../lib/wait";

interface UserData {
  username: string;
}

const USER_DATA_STORAGE_KEY = "user";

export type SignOnErrorCode = "unknown error" | "invalid credentials" | "duplication";

/**
 * Make an HTTP request to your API or third-party service handling authentication
 * to get the data of the user.
 *
 * Usually I design my API to expose a `/me` route, which returns user's data when
 * an authenticated cookie is attached to the request.
 * Otherwise, return `null` or throw an error.
 */
const fetchUserData = fromPromise(async () => {
  await wait(1_000);

  const rawUserData = localStorage.getItem(USER_DATA_STORAGE_KEY);
  if (rawUserData === null) {
    // Can also `throw new Error('...')`
    return null;
  }

  const userData = JSON.parse(rawUserData) as UserData;

  return userData;
});

/**
 * Make an HTTP request to your API or third-party service handling authentication.
 *
 * Delete the user's authentication cookie or clear the token from the localStorage.
 */
const signOut = fromPromise(async () => {
  await wait(1_000);

  localStorage.removeItem(USER_DATA_STORAGE_KEY);
});

/**
 * Make an HTTP request to your API or third-party service handling authentication.
 *
 * Verify if the credentials submitted by the user are valid or not and respond with user's data in case they are.
 * Usually, I handle form validation outside of my machine, by using React Hook Form on my React components
 * and sending the `sign-in` event when the form's values have been successfully validated.
 */
const signIn = fromPromise<
  | { success: true; userData: UserData }
  | { success: false; error: SignOnErrorCode },
  { username: string; password: string }
>(async ({ input }) => {
  await wait(1_000);

  if (input.password.length < 2) {
    return {
      success: false,
      error: "invalid credentials",
    };
  }

  const userData: UserData = {
    username: input.username,
  };

  localStorage.setItem(USER_DATA_STORAGE_KEY, JSON.stringify(userData));

  return {
    success: true,
    userData,
  };
});

/**
 * Make an HTTP request to your API or third-party service handling authentication.
 */
const signUp = fromPromise<
  | { success: true; userData: UserData }
  | { success: false; error: SignOnErrorCode },
  { username: string; password: string }
>(async ({ input }) => {
  await wait(1_000);

  /**
   * Simulate that the username is already taken by another user.
   */
  if (input.username.toLowerCase() === "xstate") {
    return {
      success: false,
      error: "duplication",
    };
  }

  const userData: UserData = {
    username: input.username,
  };

  localStorage.setItem(USER_DATA_STORAGE_KEY, JSON.stringify(userData));

  return {
    success: true,
    userData,
  };
});

export const authenticationMachine = setup({
  types: {
    events: {} as
      | { type: "sign-out" }
      | { type: "sign-in"; username: string; password: string }
      | { type: "sign-up"; username: string; password: string }
      | { type: "switching sign-on page" },
    context: {} as {
      userData: UserData | null;
      authenticationErrorToast: SignOnErrorCode | undefined;
    },
    tags: "Submitting sign-on form",
  },
  actors: {
    "Fetch user data": fetchUserData,
    "Sign out": signOut,
    "Sign in": signIn,
    "Sign up": signUp,
  },
  actions: {
    "Clear user data in context": assign({
      userData: null,
    }),
    "Clear authentication error toast in context": assign({
      authenticationErrorToast: undefined,
    }),
  },
}).createMachine({
  id: "Authentication",
  context: {
    userData: null,
    authenticationErrorToast: undefined,
  },
  initial: "Checking if user is initially authenticated",
  states: {
    "Checking if user is initially authenticated": {
      invoke: {
        src: "Fetch user data",
        onDone: [
          {
            guard: ({ event }) => event.output !== null,
            target: "Authenticated",
            actions: assign({
              userData: ({ event }) => event.output,
            }),
          },
          {
            target: "Not authenticated",
          },
        ],
        onError: {
          target: "Not authenticated",
        },
      },
    },
    Authenticated: {
      initial: "Idle",
      states: {
        Idle: {
          description:
            "The state in which an authenticated user will be most of the time. This is where you handle things a user can only do authenticated.",
          on: {
            "sign-out": {
              target: "Signing out",
            },
          },
        },
        "Signing out": {
          invoke: {
            src: "Sign out",
            onDone: {
              target: "Signed out",
              actions: "Clear user data in context",
            },
            onError: {
              target: "Idle",
              /**
               * You may display a toast to indicate that we couldn't sign out the user.
               */
              actions: []
            }
          },
        },
        "Signed out": {
          type: "final",
        },
      },
      onDone: {
        target: "Not authenticated",
      },
    },
    "Not authenticated": {
      entry: "Clear authentication error toast in context",
      initial: "Idle",
      states: {
        Idle: {
          on: {
            "sign-in": {
              target: "Signing in",
            },
            "sign-up": {
              target: "Signing up",
            },
            "switching sign-on page": {
              actions: "Clear authentication error toast in context",
            },
          },
        },
        "Signing in": {
          tags: "Submitting sign-on form",
          invoke: {
            src: "Sign in",
            input: ({ event }) => {
              assertEvent(event, "sign-in");

              return {
                username: event.username,
                password: event.password,
              };
            },
            onDone: [
              {
                guard: ({ event }) => event.output.success === true,
                target: "Successfully signed on",
                actions: assign({
                  userData: ({ event }) => {
                    if (event.output.success !== true) {
                      throw new Error(
                        "Expect to reach this action when output.success equals true"
                      );
                    }

                    return event.output.userData;
                  },
                }),
              },
              {
                target: "Idle",
                actions: assign({
                  authenticationErrorToast: ({ event }) => {
                    if (event.output.success !== false) {
                      throw new Error(
                        "Expect to reach this action when output.success equals false"
                      );
                    }

                    return event.output.error;
                  },
                }),
              },
            ],
            onError: {
              target: "Idle",
              actions: assign({
                authenticationErrorToast: "unknown error",
              }),
            },
          },
        },
        "Signing up": {
          tags: "Submitting sign-on form",
          invoke: {
            src: "Sign up",
            input: ({ event }) => {
              assertEvent(event, "sign-up");

              return {
                username: event.username,
                password: event.password,
              };
            },
            onDone: [
              {
                guard: ({ event }) => event.output.success === true,
                target: "Successfully signed on",
                actions: assign({
                  userData: ({ event }) => {
                    if (event.output.success !== true) {
                      throw new Error(
                        "Expect to reach this action when output.success equals true"
                      );
                    }

                    return event.output.userData;
                  },
                }),
              },
              {
                target: "Idle",
                actions: assign({
                  authenticationErrorToast: ({ event }) => {
                    if (event.output.success !== false) {
                      throw new Error(
                        "Expect to reach this action when output.success equals false"
                      );
                    }

                    return event.output.error;
                  },
                }),
              },
            ],
            onError: {
              target: "Idle",
              actions: assign({
                authenticationErrorToast: "unknown error",
              }),
            },
          },
        },
        "Successfully signed on": {
          type: "final",
        },
      },
      onDone: {
        target: "Authenticated",
      },
    },
  },
});
