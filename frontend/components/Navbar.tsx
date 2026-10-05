import Link from "next/link";

type NavigationItem = {
  documentId: string;
  Name: string;
  URL: string;
};

type StrapiCollectionResponse<T> = {
  data: T[];
};

async function getNavigationItems(): Promise<NavigationItem[]> {
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL;

  if (!strapiUrl) {
    console.error("NEXT_PUBLIC_STRAPI_URL is not configured.");
    return [];
  }

  const response = await fetch(`${strapiUrl}/api/nav-icons?sort=Order:asc`, {
    cache: "no-store",
  });

  if (!response.ok) {
    console.error(`Failed to fetch navigation items: ${response.status}`);
    return [];
  }

  const data: StrapiCollectionResponse<NavigationItem> = await response.json();
  return Array.isArray(data.data) ? data.data : [];
}
// start site settings
type SiteSettings = {
  Site_Name: string | null;
  CopyWrite: string | null;
};

type StrapiSingleResponse<T> = {
  data: T | null;
};

async function getSiteSettings(): Promise<SiteSettings | null> {
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL;

  if (!strapiUrl) {
    console.error("NEXT_PUBLIC_STRAPI_URL is not configured.");
    return null;
  }

  const response = await fetch(`${strapiUrl}/api/site-setsetting`, {
    cache: "no-store",
  });

  if (!response.ok) {
    console.error(`Failed to fetch site settings: ${response.status}`);
    return null;
  }

  const data: StrapiSingleResponse<SiteSettings> = await response.json();
  return data.data;
}

// end site settings

export default async function Navbar() {
  const [navigationItems, siteSettings] = await Promise.all([
    getNavigationItems(),
    getSiteSettings(),
  ]);

  return (
    <nav className="border-b border-line bg-background/90 text-foreground backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="text-2xl font-bold tracking-tight transition hover:text-brand">
          {siteSettings?.Site_Name ?? "My Blog"}
        </Link>
        <div className="flex flex-wrap items-center gap-6">
          {navigationItems.map((item) => (
            <Link
              key={item.documentId}
              href={item.URL}
              className="font-medium text-foreground transition hover:text-brand"
            >
              {item.Name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
