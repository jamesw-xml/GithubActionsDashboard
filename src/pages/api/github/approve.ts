import { getToken } from "next-auth/jwt";
import { NextApiRequest, NextApiResponse } from "next";
import type { Issue } from "@/types/github";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = await getToken({ req });

  if (!token?.accessToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const issue = req.body as Issue;
  const approve = await fetch(issue.comments_url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token.accessToken}`,
      Accept: "application/vnd.github+json",
    },
    body: JSON.stringify({
      body: "approved",
    }),
  });

  if (approve.ok) {
    return res.status(200).json({ message: "Approved" });
  } else {
    return res.status(500).json({ error: "Failed to approve" });
  }
}
