// ============================================================
// Types — Search Results
// ============================================================
export type SearchCategory = 'busana' | 'properti' | 'katering';

export interface SearchResultItem {
  id: string;
  title: string;
  category: SearchCategory;
  subtitle: string;
  path: string;
  price?: number;
  imageLabel?: string;
}
