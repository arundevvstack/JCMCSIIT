import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://jcmcsiit.ac.in';
  
  const routes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'yearly', priority: 1 },
    { url: `${baseUrl}/admissions`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/departments`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/faculty`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.7 },
  ];

  try {
    // Fetch departments
    const { data: departments } = await supabase.from('departments').select('slug, updated_at');
    if (departments) {
      departments.forEach(dept => {
        routes.push({
          url: `${baseUrl}/departments/${dept.slug}`,
          lastModified: new Date(dept.updated_at || Date.now()),
          changeFrequency: 'monthly',
          priority: 0.7,
        });
      });
    }

    // Fetch faculty
    const { data: faculty } = await supabase.from('faculty').select('slug, updated_at'); // Note: faculty slug would need to be in table if used for routes
    // Assuming faculty profiles have slugs or we just use IDs
    
    // Fetch posts/events
    const { data: posts } = await supabase.from('posts').select('type, slug, updated_at');
    if (posts) {
      posts.forEach(post => {
        const routePrefix = post.type === 'news' ? 'news' : post.type === 'event' ? 'events' : 'notices';
        routes.push({
          url: `${baseUrl}/${routePrefix}/${post.slug}`,
          lastModified: new Date(post.updated_at || Date.now()),
          changeFrequency: 'weekly',
          priority: 0.6,
        });
      });
    }
  } catch (error) {
    console.error("Error generating sitemap:", error);
  }

  return routes;
}
