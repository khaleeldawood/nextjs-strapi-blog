import Link from "next/link";

async function getCategory(slug: string) {
  const params = new URLSearchParams({
    "filters[slug][$eq]": slug,
    populate: "articles",
  });

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/categories?${params}`
  );

  if (!response.ok) {
    throw new Error("Failed to Fetch Category");
  }

  const data = await response.json();

  return data.data[0];
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const category = await getCategory(slug);

  if (!category) {
    return <h1>Category Not Found</h1>;
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-foreground">
          {category.Name}
        </h1>

        <p className="mt-2 text-muted">
          {category.Description}
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {category.articles?.map((article: { documentId: string; Title: string; Description: string; slug: string }) => (
          <article
            key={article.documentId}
            className="rounded-2xl border border-line bg-card p-6 shadow-sm transition hover:border-brand/30 hover:shadow-lg">
            <h2 className="text-2xl font-bold text-foreground">
              {article.Title}
            </h2>

            <p className="mt-3 text-muted">
              {article.Description}
            </p>

            <div className="mt-6">
              <Link
                href={`/articles/${article.slug}`}
                className="font-semibold text-brand hover:underline">
                Read Article →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
