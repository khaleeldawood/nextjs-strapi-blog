import Link from "next/link";

async function getUsers() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }
  return response.json();
}

export default async function UsersPage() {
  const users = await getUsers();
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-foreground">Users</h1>
        <p className="mt-2 text-muted">Our Awesome Users</p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {users.map((user: { id: number; username: string; email: string }) => (
          <div
            key={user.id}
            className="group rounded-2xl border border-line bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:border-brand/30 hover:shadow-xl">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-soft-accent text-2xl font-bold text-brand">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <h2 className="text-xl font-bold text-foreground">{user.username}</h2>
                <p className="mt-1 text-sm text-muted">{user.email}</p>
              </div>
            </div>
            <div className="mt-6 border-t border-line pt-4">
              <Link
                href={`/users/${user.id}`}
                className="text-sm font-semibold text-brand transition hover:underline">
                View Profile →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
