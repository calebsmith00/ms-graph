import { ResponseType } from "@microsoft/microsoft-graph-client";
import { NextApiRequest, NextApiResponse } from "next";
import { parse } from "node-html-parser";
import { client } from "../../lib/client";
import parser from "../../lib/html";

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

    if (replaceOnenoteData === undefined) {
      console.log(`Old target: ${targetId}`);
      const newContent = await client
        .api(contentUrl + "?includeIDs=true")
        .responseType(ResponseType.TEXT)
        .get();

      return res.status(200).json({
        html: newContent,
      });
    }
  }

  res.status(200).json({});
}
