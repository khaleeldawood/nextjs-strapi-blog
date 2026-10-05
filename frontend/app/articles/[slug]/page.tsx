import Link from "next/link";
import { notFound } from "next/navigation";

type ContentBlock = {
  children?: { text?: string }[];
};

type Article = {
  Title: string;
  Description: string | null;
  Content?: ContentBlock[] | null;
  category?: { Name: string } | null;
};

async function getArticle(slug: string): Promise<Article | null> {
  const apiUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
  if (!apiUrl) throw new Error("NEXT_PUBLIC_STRAPI_URL is not configured");

  const params = new URLSearchParams({
    "filters[slug][$eq]": slug,
    populate: "category",
  });
  const response = await fetch(`${apiUrl}/api/articles?${params}`, {
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Failed to fetch article");

  const data: { data: Article[] } = await response.json();
  return data.data[0] ?? null;
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-12">
      <div className="mb-8">
        <Link href="/articles" className="text-sm font-semibold text-brand hover:underline">
          ← Back to Articles
        </Link>
      </div>
      <article>
        <p className="mb-3 text-sm font-semibold text-brand">{article.category?.Name}</p>
        <h1 className="text-5xl font-bold text-foreground">{article.Title}</h1>
        <p className="mt-4 text-lg text-muted">{article.Description}</p>
        <div className="mt-10 text-lg leading-8 text-foreground">
          {article.Content?.map((block, index) => (
            <p key={index} className="mb-4">
              {block.children?.map((child, childIndex) => (
                <span key={childIndex}>{child.text}</span>
              ))}
            </p>
          ))}
        </div>
      </article>
    </main>
  );
}
