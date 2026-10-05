import Link from "next/link";

async function getCategories() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/categories?populate=articles`
  );
  if (!response.ok) {
    throw new Error("Failed to Fetch Categories");
  }
  const data = await response.json();
  return data.data;
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-foreground">Categories</h1>
        <p className="mt-2 text-muted">
          Explore our articles by category.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category: { documentId: string; Name: string; articles?: unknown[]; slug: string }) => (
          <div
            key={category.documentId}
            className="rounded-2xl border border-line bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:border-brand/30 hover:shadow-xl">
            <h2 className="text-2xl font-bold text-foreground">
              {category.Name}
            </h2>
            <p className="mt-2 text-muted">{category.articles?.length || 0} Articles</p>
            <div className="mt-6 border-t border-line pt-4">
              <Link
                href={`/category/${category.slug}`}
                className="text-sm font-semibold text-brand transition hover:underline">
                View Category
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
