import { Dialog, Portal } from "@ark-ui/react";
import { css } from "../../styled-system/css";
import { hstack, vstack, divider } from "../../styled-system/patterns";
import AppMailIcon from "./icons/AppMailIcon";
import AppTwitterIcon from "./icons/AppTwitterIcon";
import AppGithubIcon from "./icons/AppGithubIcon";
import { useState } from "react";

const CHANGELOG_URL = "https://buttondown.email/xstate-by-example/archive/";

const mastHeadLinks: Array<{ href: string; label: string; external?: true }> = [
  {
    label: "Examples",
    href: "/#examples",
  },
  {
    label: "Tips & Tricks",
    href: "/tips/",
  },
  {
    label: "Videos",
    href: "https://www.youtube.com/playlist?list=PLM0SYHogd5JOEtstuSvHtYInvxgUAoEkE",
    external: true,
  },
  {
    label: "Podcast",
    href: "https://xstate-in-the-wild.transistor.fm",
    external: true,
  },
];

function WebsiteIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="50"
      fill="none"
      viewBox="0 0 354 172"
    >
      <path
        fill="#B91C1C"
        d="M7.969 97c-3 0-3.594-1.344-1.782-4.031l20.766-30.656-19.078-28.5c-1.813-2.688-1.219-4.032 1.781-4.032h9.469c1.656 0 3.063.922 4.219 2.766l12.797 20.25 12.797-20.25c1.156-1.844 2.562-2.766 4.218-2.766h9.469c3 0 3.594 1.344 1.781 4.032l-19.125 28.5 20.813 30.656C67.906 95.656 67.313 97 64.313 97h-9.61c-1.625 0-3.031-.922-4.219-2.766L36.141 71.828 21.797 94.234C20.609 96.078 19.203 97 17.578 97h-9.61Z"
      ></path>
      <path
        fill="#030712"
        d="M74.953 91.984c-1.937-1.468-2.406-2.953-1.406-4.453l3.61-5.437c1.187-1.781 2.921-1.875 5.202-.281 1.75 1.218 4.032 2.484 6.844 3.796a21.555 21.555 0 0 0 8.953 1.922c2.188 0 4.297-.25 6.328-.75 2.032-.5 3.578-1.469 4.641-2.906 1.063-1.438 1.594-3.14 1.594-5.11 0-1.406-.235-2.64-.703-3.703-.469-1.062-1.235-1.937-2.297-2.624a20.733 20.733 0 0 0-3.281-1.735c-1.969-.812-4.454-1.61-7.454-2.39a90.778 90.778 0 0 1-8.812-2.907 26.183 26.183 0 0 1-7.125-4.125c-2.156-1.75-3.828-3.718-5.016-5.906-1.187-2.188-1.781-5.11-1.781-8.766 0-4.343 1.406-8.062 4.219-11.156 2.812-3.094 6.047-5.078 9.703-5.953a47.372 47.372 0 0 1 11.062-1.313c3.688 0 7.485.563 11.391 1.688 3.937 1.125 6.906 2.531 8.906 4.219 1.969 1.656 2.453 3.156 1.453 4.5l-3.796 5.11c-1.282 1.75-3 1.89-5.157.421-1.375-.938-3.265-1.984-5.672-3.14-2.375-1.157-4.859-1.735-7.453-1.735-1.844 0-3.547.156-5.11.469-1.53.312-2.89 1.062-4.077 2.25-1.188 1.187-1.781 2.656-1.781 4.406 0 1.688.437 3.063 1.312 4.125.875 1.031 1.844 1.813 2.906 2.344 1.063.5 2.14.922 3.235 1.265a1626.77 1626.77 0 0 0 9.047 2.907c2.656.812 5.109 1.718 7.359 2.718 3.125 1.407 5.515 2.813 7.172 4.22 1.656 1.405 3.015 3.327 4.078 5.765 1.094 2.437 1.641 5.344 1.641 8.719 0 5-1.594 9.14-4.782 12.421-3.187 3.25-6.734 5.344-10.64 6.282-3.875.968-7.657 1.453-11.344 1.453-5.438 0-9.86-.531-13.266-1.594-3.406-1.031-6.64-2.703-9.703-5.016Zm58.125-50.203c-2.344 0-3.516-1.015-3.516-3.047v-5.906c0-2.031 1.172-3.047 3.516-3.047h48.188c2.343 0 3.515 1.016 3.515 3.047v5.906c0 2.032-1.172 3.047-3.515 3.047h-17.25v52.64c0 1.72-.782 2.579-2.344 2.579h-9c-1.563 0-2.344-.86-2.344-2.578v-52.64h-17.25ZM183.609 97c-2.25 0-2.984-1.031-2.203-3.094l22.969-60.328c.969-2.531 2.437-3.797 4.406-3.797h6.563c1.968 0 3.437 1.266 4.406 3.797l22.969 60.328c.781 2.063.047 3.094-2.203 3.094h-7.454c-2.062 0-3.5-1.078-4.312-3.234l-4.781-12.61h-23.813l-4.781 12.61c-.813 2.156-2.25 3.234-4.313 3.234h-7.453Zm20.907-27.469h15.093l-5.765-14.906c-.688-1.75-1.11-3.016-1.266-3.797-.125-.812-.266-2-.422-3.562h-.187c-.157 1.562-.313 2.75-.469 3.562-.125.781-.531 2.047-1.219 3.797l-5.765 14.906Zm36-27.75c-2.344 0-3.516-1.015-3.516-3.047v-5.906c0-2.031 1.172-3.047 3.516-3.047h48.187c2.344 0 3.516 1.016 3.516 3.047v5.906c0 2.032-1.172 3.047-3.516 3.047h-17.25v52.64c0 1.72-.781 2.579-2.344 2.579h-9c-1.562 0-2.343-.86-2.343-2.578v-52.64h-17.25ZM304.594 97c-2.188 0-3.282-1.172-3.282-3.516V33.297c0-2.344 1.094-3.516 3.282-3.516h40.218c2.344 0 3.516 1.016 3.516 3.047v5.531c0 2.032-1.172 3.047-3.516 3.047H315v14.907h27.328c2.344 0 3.516 1.015 3.516 3.046v5.532c0 2.03-1.172 3.046-3.516 3.046H315v17.438h31.312c2.344 0 3.516 1.016 3.516 3.047v5.531c0 2.031-1.172 3.047-3.516 3.047h-41.718ZM28.664 151c-1.25 0-1.875-.586-1.875-1.758v-30.094c0-1.171.625-1.757 1.875-1.757h7.969c6 0 10.047.742 12.14 2.226 2.11 1.469 3.164 3.735 3.164 6.797 0 2.141-.789 3.797-2.367 4.969-1.562 1.172-3.078 1.851-4.547 2.039v.07c1.422.094 3.094.813 5.016 2.156 1.922 1.344 2.883 3.243 2.883 5.696 0 2.875-1.172 5.203-3.516 6.984-2.343 1.781-6.21 2.672-11.601 2.672h-9.14Zm4.969-5.719h3.422c3.312 0 5.562-.289 6.75-.867 1.203-.578 1.804-1.75 1.804-3.516 0-1.656-.695-2.796-2.086-3.421-1.375-.641-3.53-.961-6.468-.961h-3.422v8.765Zm0-14.297h3.07c2.016 0 3.899-.351 5.649-1.054 1.765-.703 2.648-1.797 2.648-3.282 0-1.156-.492-2.031-1.477-2.625-.968-.609-3.242-.914-6.82-.914h-3.07v7.875Zm24.14-11.578c-.796-1.344-.43-2.015 1.102-2.015h4.102c.812 0 1.53.539 2.156 1.617l4.992 8.695c.14.235.555.969 1.242 2.203.688 1.219 1.086 2.406 1.195 3.563h.094c.11-1.157.508-2.344 1.196-3.563a131.402 131.402 0 0 1 1.242-2.203l4.992-8.695c.625-1.078 1.344-1.617 2.156-1.617h4.102c1.531 0 1.898.671 1.101 2.015l-11.414 19.289v11.016c0 .859-.547 1.289-1.64 1.289h-3.563c-1.094 0-1.64-.43-1.64-1.289v-11.016l-11.415-19.289Z"
      ></path>
      <path
        fill="#B91C1C"
        d="M109.242 151c-1.094 0-1.64-.586-1.64-1.758v-30.094c0-1.171.546-1.757 1.64-1.757h20.11c1.171 0 1.757.507 1.757 1.523v2.766c0 1.015-.586 1.523-1.757 1.523h-14.907v7.453h13.664c1.172 0 1.758.508 1.758 1.524v2.765c0 1.016-.586 1.524-1.758 1.524h-13.664v8.719h15.657c1.171 0 1.757.507 1.757 1.523v2.766c0 1.015-.586 1.523-1.757 1.523h-20.86Zm28.5 0c-1.5 0-1.797-.672-.89-2.016l10.382-15.328-9.539-14.25c-.906-1.344-.609-2.015.891-2.015h4.734c.828 0 1.532.461 2.11 1.382l6.398 10.125 6.399-10.125c.578-.921 1.281-1.382 2.109-1.382h4.734c1.5 0 1.797.671.891 2.015l-9.563 14.25 10.407 15.328c.906 1.344.609 2.016-.891 2.016h-4.805c-.812 0-1.515-.461-2.109-1.383l-7.172-11.203-7.172 11.203c-.594.922-1.297 1.383-2.109 1.383h-4.805Zm32.039 0c-1.125 0-1.492-.516-1.101-1.547l11.484-30.164c.484-1.266 1.219-1.898 2.203-1.898h3.281c.985 0 1.719.632 2.204 1.898l11.484 30.164c.391 1.031.023 1.547-1.102 1.547h-3.726c-1.031 0-1.75-.539-2.156-1.617l-2.391-6.305h-11.906l-2.391 6.305c-.406 1.078-1.125 1.617-2.156 1.617h-3.727Zm10.453-13.734h7.547l-2.883-7.454c-.343-.874-.554-1.507-.632-1.898-.063-.406-.133-1-.211-1.781h-.094a21.497 21.497 0 0 1-.234 1.781c-.063.391-.266 1.024-.61 1.898l-2.883 7.454ZM205.148 151c-1.093 0-1.64-.586-1.64-1.758v-30.094c0-1.171.547-1.757 1.64-1.757h6.797c.907 0 1.555.625 1.946 1.875l6.351 20.554c.281.891.477 1.625.586 2.203.11.563.203 1.235.281 2.016h.141a22.59 22.59 0 0 1 .281-2.016c.11-.578.305-1.312.586-2.203l6.352-20.554c.39-1.25 1.039-1.875 1.945-1.875h6.797c1.094 0 1.641.586 1.641 1.757v30.094c0 1.172-.547 1.758-1.641 1.758h-3.563c-1.093 0-1.64-.586-1.64-1.758v-19.359c0-.938.039-1.875.117-2.813h-.164l-6.773 22.032c-.391 1.265-1.063 1.898-2.016 1.898h-3.984c-.954 0-1.626-.633-2.016-1.898l-6.774-22.032h-.164c.078.938.118 1.875.118 2.813v19.359c0 1.172-.547 1.758-1.641 1.758h-3.563Zm42.844 0c-1.094 0-1.64-.586-1.64-1.758v-30.094c0-1.171.546-1.757 1.64-1.757h8.766c5.625 0 9.523.914 11.695 2.742 2.188 1.828 3.281 4.422 3.281 7.781s-1.093 5.953-3.281 7.781c-2.172 1.828-6.07 2.743-11.695 2.743h-3.563v10.804c0 1.172-.547 1.758-1.64 1.758h-3.563Zm5.203-18.281h3.539c3.125 0 5.25-.367 6.375-1.102 1.125-.75 1.688-1.984 1.688-3.703 0-1.719-.563-2.945-1.688-3.68-1.125-.75-3.25-1.125-6.375-1.125h-3.539v9.61ZM279.117 151c-1.094 0-1.64-.586-1.64-1.758v-30.094c0-1.171.546-1.757 1.64-1.757h3.797c.938 0 1.406.586 1.406 1.757v26.04h13.664c1.172 0 1.758.507 1.758 1.523v2.766c0 1.015-.586 1.523-1.758 1.523h-18.867Zm27.235 0c-1.094 0-1.641-.586-1.641-1.758v-30.094c0-1.171.547-1.757 1.641-1.757h20.109c1.172 0 1.758.507 1.758 1.523v2.766c0 1.015-.586 1.523-1.758 1.523h-14.906v7.453h13.664c1.172 0 1.758.508 1.758 1.524v2.765c0 1.016-.586 1.524-1.758 1.524h-13.664v8.719h15.656c1.172 0 1.758.507 1.758 1.523v2.766c0 1.015-.586 1.523-1.758 1.523h-20.859Z"
      ></path>
    </svg>
  );
}

export function TheMastHead({
  contacts,
}: {
  contacts: Array<{
    href: string;
    alt: string;
    icon: "github" | "twitter" | "email";
    hideOnHeader?: boolean;
  }>;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav
      className={css({
        borderBottomWidth: "1px",
        borderColor: "gray.200",
        bgColor: "white",
      })}
    >
      <div
        className={css({
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mx: "auto",
          maxW: "7xl",
          px: { base: "4", sm: "6", lg: "8" },
        })}
      >
        <div
          className={css({
            display: "flex",
            h: "16",
          })}
        >
          <div
            className={css({
              display: "flex",
              flexShrink: "0",
              alignItems: "center",
            })}
          >
            <a href="/" title="Home">
              <WebsiteIcon />
            </a>
          </div>
        </div>

        <div className={css({ display: { base: "flex", md: "none" } })}>
          <button
            type="button"
            className={css({
              m: "-2.5",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              rounded: "md",
              p: "2.5",
              color: "gray.700",
              cursor: "pointer",
            })}
            onClick={() => setIsOpen(true)}
          >
            <span className={css({ srOnly: true })}>Open main menu</span>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={css({ h: "6", w: "6" })}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        </div>

        <div
          className={css({
            display: "none",
            md: { display: "flex", columnGap: "12" },
          })}
        >
          {mastHeadLinks.map((link, index) => (
            <a
              key={index}
              href={link.href}
              target={link.external === true ? "_blank" : undefined}
              className={css({
                fontSize: "md",
                fontWeight: "semibold",
                color: "gray.900",
              })}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div
          className={hstack({
            display: { base: "none", md: "flex" },
            gap: "4",
            "& > a": {
              p: "1.5",
              rounded: "md",
              cursor: "pointer",
              _hover: { bg: "gray.100" },
              "& > svg": {
                w: "6",
                h: "6",
                color: "gray.400",
              },
            },
          })}
        >
          <a href={CHANGELOG_URL} target="_blank">
            <span
              className={css({
                srOnly: true,
              })}
            >
              Changelog
            </span>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6"
            >
              <path
                fillRule="evenodd"
                d="M4.125 3C3.089 3 2.25 3.84 2.25 4.875V18a3 3 0 0 0 3 3h15a3 3 0 0 1-3-3V4.875C17.25 3.839 16.41 3 15.375 3H4.125ZM12 9.75a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H12Zm-.75-2.25a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5H12a.75.75 0 0 1-.75-.75ZM6 12.75a.75.75 0 0 0 0 1.5h7.5a.75.75 0 0 0 0-1.5H6Zm-.75 3.75a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5H6a.75.75 0 0 1-.75-.75ZM6 6.75a.75.75 0 0 0-.75.75v3c0 .414.336.75.75.75h3a.75.75 0 0 0 .75-.75v-3A.75.75 0 0 0 9 6.75H6Z"
                clipRule="evenodd"
              />
              <path d="M18.75 6.75h1.875c.621 0 1.125.504 1.125 1.125V18a1.5 1.5 0 0 1-3 0V6.75Z" />
            </svg>
          </a>

          {contacts
            .filter((contact) => contact.hideOnHeader !== true)
            .map((contact, index) => (
              <a key={index} href={contact.href}>
                <span className={css({ srOnly: true })}>{contact.alt}</span>

                {contact.icon === "email" ? (
                  <AppMailIcon />
                ) : contact.icon === "twitter" ? (
                  <AppTwitterIcon />
                ) : contact.icon === "github" ? (
                  <AppGithubIcon />
                ) : null}
              </a>
            ))}
        </div>
      </div>

      <Dialog.Root open={isOpen} onOpenChange={(e) => setIsOpen(e.open)}>
        <Portal>
          <Dialog.Backdrop className={css({ md: { display: "none" } })} />

          <Dialog.Positioner>
            <Dialog.Content
              className={css({
                md: { display: "none" },
                pos: "fixed",
                insetY: "0",
                right: "0",
                zIndex: "30",
                w: "full",
                overflowY: "auto",
                bgColor: "white",
                px: "6",
                py: "6",
                sm: {
                  maxW: "sm",
                  borderLeftWidth: 1,
                  borderStyle: "solid",
                  borderColor: "gray.900/10",
                },
              })}
            >
              <div
                className={css({
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                })}
              >
                <a href="/" title="Home">
                  <WebsiteIcon />
                </a>

                <Dialog.CloseTrigger
                  className={css({ cursor: "pointer", color: "gray.700" })}
                >
                  <span className={css({ srOnly: true })}>Close menu</span>

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className={css({ h: "6", w: "6" })}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18 18 6M6 6l12 12"
                    />
                  </svg>
                </Dialog.CloseTrigger>
              </div>

              <div
                className={vstack({ py: "6", gap: "2", alignItems: "stretch" })}
              >
                {[
                  ...mastHeadLinks,
                  { href: CHANGELOG_URL, external: true, label: "Changelog" },
                ].map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    target={link.external === true ? "_blank" : undefined}
                    className={css({
                      display: "block",
                      rounded: "lg",
                      mx: "-3",
                      px: "3",
                      py: "2",
                      fontWeight: "semibold",
                      color: "gray.900",
                      _hover: { bg: "gray.50" },
                    })}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
              </div>

              <div className={divider({ color: "gray.500/10" })} />

              <div className={hstack({ gap: 4, py: "6" })}>
                {contacts.map((contact, index) => (
                  <a
                    key={index}
                    href={contact.href}
                    className={css({
                      p: "1.5",
                      rounded: "md",
                      cursor: "pointer",
                      _hover: { bg: "gray.100" },
                    })}
                  >
                    <span className={css({ srOnly: true })}>{contact.alt}</span>

                    {contact.icon === "email" ? (
                      <AppMailIcon
                        className={css({
                          w: "6",
                          h: "6",
                          color: "gray.400",
                        })}
                      />
                    ) : contact.icon === "twitter" ? (
                      <AppTwitterIcon
                        className={css({
                          w: "6",
                          h: "6",
                          color: "gray.400",
                        })}
                      />
                    ) : contact.icon === "github" ? (
                      <AppGithubIcon
                        className={css({
                          w: "6",
                          h: "6",
                          color: "gray.400",
                        })}
                      />
                    ) : null}
                  </a>
                ))}
              </div>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </nav>
  );
}
