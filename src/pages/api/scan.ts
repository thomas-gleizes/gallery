import { NextApiRequest, NextApiResponse } from "next";
import scan from "@/utils/scan";
import { FilesTypes } from "../../../types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<FilesTypes>,
) {
  return res.status(200).json(await scan("/Users/kalat/Documents/.images"));
}
