import React from 'react';
import type { SectionEntity } from '../../types/content';
import { useImageSrc } from '../../hooks/useImageSrc';

export const CateringPostCard: React.FC<{ post: SectionEntity }> = ({ post }) => {
  const imageSrc = useImageSrc(post.imageUrl);
  return (
    <article className="bg-white border border-line rounded-[2px] overflow-hidden">
      {imageSrc && <img src={imageSrc} alt={post.title} loading="lazy" className="w-full aspect-[4/3] object-cover" />}
      <div className="p-5 sm:p-6">
        <h3 className="font-serif text-xl sm:text-2xl text-charcoal mb-2">{post.title}</h3>
        {post.subtitle && <p className="text-sm text-caramel-deep mb-2">{post.subtitle}</p>}
        {post.content && <p className="text-sm text-ink whitespace-pre-line leading-relaxed">{post.content}</p>}
      </div>
    </article>
  );
};
