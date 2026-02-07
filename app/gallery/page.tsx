import { supabase } from '@/lib/supabase';
import GalleryView from './gallery-view';

// This is a Server Component — data is fetched on the server before render
export default async function GalleryPage() {
  // Fetch artworks and join the artist data
  const { data: artworks, error } = await supabase
    .from('artworks')
    .select('*, artists(*)')
    .order('title');

  if (error) {
    console.error('Error fetching art:', error);
  }

  return <GalleryView artworks={artworks || []} />;
}
