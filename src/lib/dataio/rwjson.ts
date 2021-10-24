import { readFile, writeFile } from "fs/promises";

import * as Cache from "./cache";

function getJsonPath(filename: string) {
  return `data/${filename}.json`;
}

export async function read(filename: string) {
  const path = getJsonPath(filename);

  if (Cache.has(path)) {
    return Cache.get(path);
  }

  let data;
  try {
    const json = await readFile(path, { encoding: "utf8" });
    data = JSON.parse(json);
  } catch {
    data = {};
  }

  Cache.set(path, data);
  return data;
}

export async function write(filename: string, data: any) {
  const path = getJsonPath(filename);

  Cache.set(path, data);

  const json = JSON.stringify(data, null, 2);
  await writeFile(path, json, { encoding: "utf8" });
}
