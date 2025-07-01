import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // 全てのクローラーをブロック
      {
        userAgent: "*",
        disallow: ["/"],
      },
      // 以下、LLMクローラーも明示的にブロック
      {
        userAgent: "GPTBot",
        disallow: ["/"],
      },
      {
        userAgent: "ChatGPT-User",
        disallow: ["/"],
      },
      {
        userAgent: "OAI-SearchBot",
        disallow: ["/"],
      },
      {
        userAgent: "Google-Extended",
        disallow: ["/"],
      },
      {
        userAgent: "Applebot-Extended",
        disallow: ["/"],
      },
      {
        userAgent: "anthropic-ai",
        disallow: ["/"],
      },
      {
        userAgent: "ClaudeBot",
        disallow: ["/"],
      },
      {
        userAgent: "Claude-Web",
        disallow: ["/"],
      },
      {
        userAgent: "CCBot",
        disallow: ["/"],
      },
      {
        userAgent: "PerplexityBot",
        disallow: ["/"],
      },
      {
        userAgent: "YouBot",
        disallow: ["/"],
      },
      {
        userAgent: "Cohere-ai",
        disallow: ["/"],
      },
      {
        userAgent: "Amazonbot",
        disallow: ["/"],
      },
      {
        userAgent: "Bytespider",
        disallow: ["/"],
      },
    ],
  };
}
