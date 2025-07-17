import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import BlogPostCard from '@/components/BlogPostCard';
import AnimatedButton from '@/components/AnimatedButton';
import { useTranslation } from 'react-i18next';
import { ALL_BLOG_POSTS } from '@/data/blogPosts'; // Import from new data file

interface BlogPost {
  id: string;
  title: string;
  image: string;
  shortDescription: string;
  content: string;
}

const POSTS_PER_LOAD = 3;

const BlogPage: React.FC = () => {
  const { t } = useTranslation();
  const [visiblePosts, setVisiblePosts] = useState(POSTS_PER_LOAD);

  const loadMorePosts = () => {
    setVisiblePosts(prev => prev + POSTS_PER_LOAD);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-[calc(100vh-160px)] bg-dairy-cream text-dairy-text py-12 px-4"
    >
      <div className="container mx-auto">
        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 100, damping: 10 }}
          className="text-4xl md:text-5xl font-bold text-center text-dairy-darkBlue mb-12"
        >
          {t('our_blog')}
        </motion.h1>

        {ALL_BLOG_POSTS.length === 0 ? (
          <div className="text-center text-xl text-dairy-text">
            {t('no_blog_posts_available')}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            {ALL_BLOG_POSTS.slice(0, visiblePosts).map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        )}

        {visiblePosts < ALL_BLOG_POSTS.length && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex justify-center mt-12"
          >
            <AnimatedButton
              onClick={loadMorePosts}
              className="bg-dairy-blue text-white hover:bg-dairy-darkBlue"
              soundOnClick="/sounds/click.mp3"
            >
              {t('load_more')}
            </AnimatedButton>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default BlogPage;