import Link from "next/link";

type Article = {
  documentId: string;
  Title: string;
  Description: string | null;
  slug: string;
  category?: { Name: string } | null;
};

async function getArticles(): Promise<Article[]> {
  const apiUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
  if (!apiUrl) throw new Error("NEXT_PUBLIC_STRAPI_URL is not configured");

  const response = await fetch(`${apiUrl}/api/articles?populate=category`, {
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Failed to fetch articles");

  const data: { data: Article[] } = await response.json();
  return data.data;
}

export default async function ArticlesPage() {
  const articles = await getArticles();

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-foreground">Articles</h1>
        <p className="mt-2 text-muted">Explore all our articles.</p>
      </div>
      <div className="space-y-6">
        {articles.map((article) => (
          <Link key={article.documentId} href={`/articles/${article.slug}`} className="block rounded-2xl border border-line bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:border-brand/30 hover:shadow-lg">
            <p className="mb-2 text-sm font-semibold text-brand">{article.category?.Name}</p>
            <h2 className="text-2xl font-bold text-foreground">{article.Title}</h2>
            <p className="mt-2 text-muted">{article.Description}</p>
          </Link>
        ))}
        {articles.length === 0 && <p className="text-muted">No articles yet.</p>}
      </div>
    </main>
  );
}
