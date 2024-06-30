import scan, { saveCache } from "@/utils/scan";
import "dotenv/config";
import { dirname } from "node:path";

const dirPath: string = process.env.TARGET_PATH as string;
process.env.STATIC_PATH = `${dirname(__dirname)}/static`;

async function main() {
  const files = await scan(dirPath, []);
  await saveCache(files);
}

main()
  .then(() => console.log("Done"))
  .catch((err) => console.error("Error", err))
  .finally(() => process.exit(0));
