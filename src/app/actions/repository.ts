"use server";

const apiToken = process.env.GITHUB_API_ACCESS_TOKEN;
const URL = "https://api.github.com/repos/tamashiro-syuta/TIL/contents/";
const excludeNames = ["README.md", "image"];

export async function fetchGenres() {
  const res = await fetch(URL, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${apiToken}`,
      "X-GitHub-Api-Version": "2022-11-28",
    },
  }).then((res) => {
    return res.json();
  });

  const genres = res
    .filter((item: any) => !excludeNames.includes(item.name))
    .map((item: any) => item.name) as string[];

  return genres;
}
