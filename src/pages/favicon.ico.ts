/**
 * From https://kremalicious.com/favicon-generation-with-astro/
 */
import type { APIRoute } from "astro";
import sharp from "sharp";
import ico from "sharp-ico";
import path from "node:path";

// relative to project root
const faviconSrc = path.resolve("src/assets/favicon/favicon.png");

export const GET: APIRoute = async () => {
  // resize to 32px PNG
  const buffer = await sharp(faviconSrc).resize(32).toFormat("png").toBuffer();
  // generate ico
  const icoBuffer = ico.encode([buffer]);

  return new Response(icoBuffer, {
    headers: { "Content-Type": "image/x-icon" },
  });
};
