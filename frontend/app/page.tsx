import Link from "next/link";

type User = { id: number; username: string; email: string };
type Category = { documentId: string; Name: string; slug: string };
type Article = { documentId: string; Title: string; slug: string };
type Collection<T> = { data: T[] };

async function getHomeData() {
  const apiUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
  if (!apiUrl) throw new Error("NEXT_PUBLIC_STRAPI_URL is not configured");

  const [usersResponse, categoriesResponse, articlesResponse] = await Promise.all([
    fetch(`${apiUrl}/api/users?sort=createdAt:desc&pagination[limit]=5`, {
      cache: "no-store",
    }),
    fetch(`${apiUrl}/api/categories?sort=createdAt:desc`, {
      cache: "no-store",
    }),
    fetch(`${apiUrl}/api/articles?sort=createdAt:desc&pagination[limit]=5`, {
      cache: "no-store",
    }),
  ]);

  if (!usersResponse.ok || !categoriesResponse.ok || !articlesResponse.ok) {
    throw new Error("Failed to fetch home page data");
  }

  const [users, categories, articles] = await Promise.all([
    usersResponse.json() as Promise<User[]>,
    categoriesResponse.json() as Promise<Collection<Category>>,
    articlesResponse.json() as Promise<Collection<Article>>,
  ]);

  return { users, categories: categories.data, articles: articles.data };
}

export default async function Home() {
  const { users, categories, articles } = await getHomeData();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="border-b border-line bg-hero px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <span className="mb-5 inline-block rounded-full border border-line bg-card px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand">
            Welcome
          </span>
          <h1 className="max-w-3xl text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
            Discover Our <span className="block text-brand">Latest Content</span>
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-muted">
            Explore the latest articles, browse our categories, and connect with our growing community.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pt-20">
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand">Community</span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight">Latest Members</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {users.map((user) => (
            <div key={user.id} className="rounded-2xl border border-line bg-card p-5 shadow-sm transition hover:-translate-y-1 hover:border-brand/30 hover:shadow-lg">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-soft-accent text-lg font-bold text-brand">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <h3 className="font-semibold">{user.username}</h3>
              <p className="mt-1 break-all text-sm text-muted">{user.email}</p>
            </div>
          ))}
          {users.length === 0 && <p className="text-muted">No members yet.</p>}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pt-24">
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand">Explore</span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight">Categories</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link key={category.documentId} href={`/category/${category.slug}`} className="group flex items-center justify-between rounded-2xl border border-line bg-card px-6 py-5 font-semibold shadow-sm transition hover:-translate-y-1 hover:border-brand/30 hover:shadow-lg">
              <span>{category.Name}</span>
              <span className="text-xl text-brand transition group-hover:translate-x-1">→</span>
            </Link>
          ))}
          {categories.length === 0 && <p className="text-muted">No categories yet.</p>}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24 pt-24">
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand">Blog</span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight">Latest Articles</h2>
        </div>
        <div className="overflow-hidden rounded-2xl border border-line bg-card shadow-sm">
          {articles.map((article, index) => (
            <Link key={article.documentId} href={`/articles/${article.slug}`} className="group grid min-h-20 grid-cols-[50px_1fr_30px] items-center border-b border-line px-5 transition last:border-b-0 hover:bg-hero sm:grid-cols-[70px_1fr_40px] sm:px-7">
              <span className="text-sm font-bold text-muted">{String(index + 1).padStart(2, "0")}</span>
              <h3 className="font-semibold transition group-hover:text-brand">{article.Title}</h3>
              <span className="justify-self-end text-xl text-brand transition group-hover:-translate-y-1 group-hover:translate-x-1">↗</span>
            </Link>
          ))}
          {articles.length === 0 && <p className="p-6 text-muted">No articles yet.</p>}
        </div>
      </section>
    </main>
  );
}
