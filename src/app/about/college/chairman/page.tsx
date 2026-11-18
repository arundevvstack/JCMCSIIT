import { redirect } from 'next/navigation';

/**
 * Redirects the legacy Chairman route to the canonical URL `/about/our-chairman`.
 * Ensures backwards compatibility for bookmarks and external links while maintaining
 * exactly one canonical Chairman page implementation.
 */
export default function LegacyChairmanRedirectPage() {
  redirect('/about/our-chairman');
}
