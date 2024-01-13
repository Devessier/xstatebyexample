import { Tabs as ArkTabs } from "@ark-ui/react";
import { css } from "../../styled-system/css";

type Props = Record<string, React.ReactNode> & {
  labels: Array<string>;
};

export default function Tabs(props: Props) {
  const slots = Object.keys(props)
    .filter((p) => Number.isInteger(Number(p)))
    .sort();

  return (
    <div className={css({})}>
      <ArkTabs.Root defaultValue="1">
        <ArkTabs.List
          className={css({ borderBottomWidth: "1px", borderColor: "gray.200" })}
        >
          <div className={css({ mb: "-1px", display: "flex" })}>
            {props.labels.map((label, index) => (
              <ArkTabs.Trigger
                key={label}
                value={String(index + 1)}
                className={
                  css({
                    borderColor: "transparent",
                    color: "gray.500",
                    _hover: {
                      borderColor: "gray.300",
                      color: "gray.700",
                    },
                    _selected: {
                      borderColor: "red.600",
                      color: "red.700",
                      _hover: {
                        borderColor: "red.600",
                        color: "red.700",
                      },
                    },
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    borderBottomWidth: "2px",
                    py: "2",
                    px: "4",
                    fontSize: "md",
                    lineHeight: "sm",
                    fontWeight: "medium",
                  })
                }
              >
                {label}
              </ArkTabs.Trigger>
            ))}

            <ArkTabs.Indicator />
          </div>
        </ArkTabs.List>

        <div className={css({ mt: 4 })}>
          {slots.map((slot) => (
            <ArkTabs.Content key={slot} value={slot}>
              {props[slot]}
            </ArkTabs.Content>
          ))}
        </div>
      </ArkTabs.Root>
    </div>
  );
}
