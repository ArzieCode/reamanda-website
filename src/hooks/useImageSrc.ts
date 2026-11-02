import { useEffect, useState } from 'react';
import { getImageUrl } from '../services/idb';

/** Convert a browser-local CMS image ID into a renderable URL. */
export function useImageSrc(value?: string): string {
  const [resolved, setResolved] = useState<{ key: string; url: string } | null>(null);
  useEffect(() => {
    let active = true;
    if (value?.startsWith('img-')) {
      getImageUrl(value).then((url) => {
        if (active) setResolved({ key: value, url: url || '' });
      });
    }
    return () => { active = false; };
  }, [value]);
  if (value?.startsWith('img-')) return resolved?.key === value ? resolved.url : '';
  return value || '';
}
