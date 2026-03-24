import { createWriteStream } from "node:fs";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import type { ReadableStream } from "node:stream/web";
import { getAbsPath } from "./path";

// fetch /api/{STAT_NAME}?username={USERNAME}
// save to /public/github-stats/{STAT_NAME}.svg
// if STAT_NAME is empty use STAT_NAME=default
void main();

async function main(): Promise<PromiseSettledResult<void>[]> {
  return Promise.allSettled([
    fetchGHStats("nikitait"),
    fetchYTStats("UCaXqZ8rE2lHoIUdi_DlWfig"),
    fetchStackoverflowStats("7214691"),
  ]);
}

async function fetchStackoverflowStats(
  userId: string,
  statName = ""
): Promise<void> {
  const url = `https://github-stackoverflow-readme.vercel.app/${statName}?userId=${userId}`;
  return fetchStats(url, statName, "stackoverflow");
}

async function fetchYTStats(channelId: string, statName = ""): Promise<void> {
  const url = `https://youtube-stats-card.vercel.app/api/${statName}?channelid=${channelId}`;
  return fetchStats(url, statName, "youtube");
}

async function fetchGHStats(username: string, statName = ""): Promise<void> {
  const url = `https://github-readme-stats.vercel.app/api/${statName}?username=${username}&show_icons=true&theme=transparent`;
  return fetchStats(url, statName, "github");
}

async function fetchStats(
  url: string,
  statName: string,
  folder: string,
  ctrl = new AbortController()
): Promise<void> {
  const response = await fetch(url, {
    signal: ctrl.signal,
  });
  if (!response.body) {
    throw new Error("No body");
  }
  const filePath = `../public/stats/${folder}/${statName || "default"}.svg`;
  const path = getAbsPath(filePath);

  // eslint-disable-next-line no-console -- ok
  console.log({
    from: url,
    to: path,
  });
  return pipeline(
    Readable.fromWeb(response.body as unknown as ReadableStream),
    createWriteStream(path),
    { signal: ctrl.signal }
  );
}
