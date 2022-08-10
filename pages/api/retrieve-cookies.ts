import { NextApiRequest, NextApiResponse } from "next";
import cookieMiddleware from "../../lib/cookies";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(400).json({});
  if (req.body.password !== process.env.SUPER_SECRET)
    return res.status(400).json({});

  const context = { req, res };
  const cookies = cookieMiddleware()
    .supplyContext(context)
    .setIfEmpty()
    .getCookies(["notebook", "section", "page", "pagecontent"]);

  if (cookies.length !== 0) res.status(200).json(cookies);
}
