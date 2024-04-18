import { NextApiRequest, NextApiResponse } from "next";
import fs from "node:fs";
import scan, { hash } from "@/utils/scan";
import { FilesTypes } from "../../../types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<FilesTypes>,
) {
  const dirHash = `${process.env.STATIC_PATH}/${hash(
    process.env.TARGET_PATH as string,
  )}.json`;
  console.log("DirHash", dirHash);

  if (!req.query.hasOwnProperty("latest") && fs.existsSync(dirHash)) {
    const data = fs.readFileSync(dirHash, "utf-8");
    return res.status(200).json(JSON.parse(data));
  }

  const scanned = await scan(process.env.TARGET_PATH as string);
  fs.writeFileSync(dirHash, JSON.stringify(scanned));

  return res.status(200).json(scanned);
}
