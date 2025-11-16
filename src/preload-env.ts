import { config } from "dotenv";
import { resolve } from "node:path";

const envFileIndex = process.argv.findIndex((arg) => arg === '--env-file')

if (envFileIndex !== -1) {
  const envFilePath = process.argv[envFileIndex + 1];
  const path = resolve(process.cwd(), envFilePath);
  config({ path });
}
