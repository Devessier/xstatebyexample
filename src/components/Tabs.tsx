import { Tab } from "@headlessui/react";
import { css } from "../../styled-system/css";

type Props = Record<string, React.ReactNode> & {
  labels: Array<string>;
};

export default function Tabs(props: Props) {
  const slots = Object.keys(props)
    .filter((p) => Number.isInteger(Number(p)))
    .sort();

  return (
    <div className={css({  })}>
      
    <Tab.Group>
      <Tab.List
        className={css({ borderBottomWidth: "1px", borderColor: "gray.200" })}
      >
        <div
          className={css({ mb: "-1px", display: "flex" })}
        >
          {props.labels.map((label) => (
            <Tab
              key={label}
              className={({ selected }) =>
                css(
                  selected
                    ? { borderColor: "red.600", color: "red.700" }
                    : {
                        borderColor: "transparent",
                        color: "gray.500",
                        _hover: { borderColor: "gray.300", color: "gray.700" },
                      },
                  {
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    borderBottomWidth: "2px",
                    py: "2",
                    px: "4",
                    fontSize: "md",
                    lineHeight: "sm",
                    fontWeight: "medium",
                  }
                )
              }
            >
              {label}
            </Tab>
          ))}
        </div>
      </Tab.List>
      <Tab.Panels className={css({ mt: 4 })}>
        {slots.map((slot, index) => (
          <Tab.Panel key={index}>{props[slot]}</Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
    </div>

  );
}
