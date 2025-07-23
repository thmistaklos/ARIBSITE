import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface HomeBlogPostCardProps {
  post: {
    id: string;
    title: string;
    image_url: string | null;
    content: string;
  };
}

const HomeBlogPostCard: React.FC<HomeBlogPostCardProps> = ({ post }) => {
  const { t } = useTranslation();
  const shortDescription = post.content.replace(/<[^>]*>/g, '').substring(0, 100) + '...';

  return (
    <div
      className="home-blog-card"
      style={{ '--bg-image': `url(${post.image_url || '/placeholder.jpg'})` } as React.CSSProperties}
    >
      <div className="content">
        <h2 className="title">{post.title}</h2>
        <p className="copy">{shortDescription}</p>
        <Link to={`/blog/${post.id}`} className="btn">
          {t('read_more')}
        </Link>
      </div>
    </div>
  );
};

export default HomeBlogPostCard;