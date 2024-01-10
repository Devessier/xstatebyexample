import { css } from "../../../styled-system/css";
import { grid } from "../../../styled-system/patterns";

export function ButtonDemo() {
  return (
    <div
      className={grid({
        columns: 2,
        my: "12",
        maxWidth: "lg",
        mx: "auto",
        borderWidth: 2,
        borderColor: "gray.300",
        rounded: "md",
      })}
    >
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
      >
        Click me!
      </button>

      <div className={css({ h: 200 })}></div>
    </div>
  );
}
