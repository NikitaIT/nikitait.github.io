import { resolve , dirname } from "node:path";
import { fileURLToPath } from "node:url";

export function getAbsPath(filePath: string) {
  return resolve(dirname(fileURLToPath(import.meta.url)), filePath);
}
