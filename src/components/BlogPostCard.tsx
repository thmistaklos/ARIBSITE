import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AnimatedButton from '@/components/AnimatedButton';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface BlogPostCardProps {
  post: {
    id: string;
    title: string;
    image: string;
    shortDescription: string;
  };
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post }) => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03, boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.1)' }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-sm"
    >
      <Card className="rounded-xl overflow-hidden border-2 border-dairy-blue/20 bg-dairy-cream shadow-lg h-full flex flex-col">
        <CardHeader className="p-0">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-48 object-cover"
          />
        </CardHeader>
        <CardContent className="p-6 flex-grow flex flex-col justify-between">
          <div>
            <CardTitle className="text-2xl font-semibold text-dairy-darkBlue mb-2">{post.title}</CardTitle>
            <CardDescription className="text-dairy-text text-sm mb-4 line-clamp-3">{post.shortDescription}</CardDescription>
          </div>
          <div className="mt-4">
            <Link to={`/blog/${post.id}`}>
              <AnimatedButton className="w-full bg-dairy-darkBlue text-dairy-cream hover:bg-dairy-blue" soundOnClick="/sounds/click.mp3">
                {t('read_more')}
              </AnimatedButton>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BlogPostCard;