import { NextApiRequest, NextApiResponse } from "next";
import { parse } from "node-html-parser";
import { client } from "../../lib/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(400).json({});
  const contentUrl = req.body.contentUrl;
  const targetId = req.body.targetId;
  const parsed = parse(req.body.html);

  if (parsed && contentUrl && targetId) {
    const replaceOnenoteData = await client.api(contentUrl).patch([
      {
        target: targetId,
        action: "replace",
        content: parsed.toString(),
      },
    ]);
  }

  res.status(200).json({});
}
