# XState by Example

Welcome to the repository of XState by Example, a collection of state machines to help people think in state machines.

## Development

To start the website locally, run the following:

```bash
npm install
npm run dev
```

## Generate Markdown files from demo source files

I want to display the content of `machine.ts` and `Demo.tsx` files for each machine. Though it's easy to get the raw content of any file – thanks to Vite – but it's harder to render them as proper code blocks. I use [Expressive [Code](https://expressive-code.com/) to generate amazing code blocks, but it can't easily render an arbitrary string as a code block.

As a consequence, I had to generate the Markdown blocks with an automatic tool.

To run it:

```bash
npm run generate:code-markdown
```

For now, the files should be committed. There is no automatic system to build them or check them on a CI.
