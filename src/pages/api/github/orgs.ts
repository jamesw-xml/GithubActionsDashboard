// pages/api/github/orgs.ts

import { getToken } from "next-auth/jwt";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = await getToken({ req });
  if (!token?.accessToken) return res.status(401).json({ error: "Unauthorized" });

  const orgRes = await fetch("https://api.github.com/user/orgs", {
    headers: {
      Authorization: `Bearer ${token.accessToken}`,
      Accept: "application/vnd.github+json",
    },
  });

  const data = await orgRes.json();
  const orgNames = data.map((org) => org.login);
  res.status(200).json(orgNames);
}
