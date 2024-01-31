import { cva } from "../../../styled-system/css";

export const input = cva({
  base: {
    py: "1",
    px: "3",
    appearance: "none",
    background: "none",
    borderColor: "gray.300",
    rounded: "md",
    borderWidth: 1,
    shadow: "sm",
    color: "gray.900",
    fontSize: "md",
    outline: 0,
    transitionDuration: "normal",
    transitionProperty: "box-shadow, border-color",
    transitionTimingFunction: "default",
    width: "full",
    _focus: {
      borderColor: "gray.600",
      boxShadow: "0 0 0 1px var(--colors-gray-600)",
    },
  },
});
