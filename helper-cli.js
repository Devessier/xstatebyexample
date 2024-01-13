import { opendir, readFile, writeFile } from 'node:fs/promises'
import { join, extname } from 'node:path';

const BASE_DIR = new URL("./src/components", import.meta.url)

const FILES_TO_COPY = ["Demo.tsx", "machine.ts"]

const dir = await opendir(BASE_DIR)

for await (const dirent of dir) {
    if (dirent.isDirectory() === false) {
        continue;
    }

    const subdir = await opendir(join(dirent.path, dirent.name))

    for await (const subdirent of subdir) {
        if (FILES_TO_COPY.includes(subdirent.name) === false) {
            continue
        }

        const subdirentPath = join(subdirent.path, subdirent.name)
        const fileContent = await readFile(subdirentPath, { encoding: "utf-8" })

        const markdownContent = "```tsx\n" + fileContent.trim() + "\n```"
        const markdownPath = subdirentPath.replace(extname(subdirentPath), ".md")

        await writeFile(markdownPath, markdownContent)

        console.log(`✅ generated Markdown file for ${subdirentPath} at ${markdownPath}`)
    }
}
