import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import BlogPostCard from '@/components/BlogPostCard';
import AnimatedButton from '@/components/AnimatedButton';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface BlogPost {
  id: string;
  title: string;
  image_url: string; // Changed to image_url to match Supabase schema
  shortDescription: string;
  content: string;
  published: boolean; // Added published status
}

const POSTS_PER_LOAD = 3;

const BlogPage: React.FC = () => {
  const { t } = useTranslation();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [visiblePosts, setVisiblePosts] = useState(POSTS_PER_LOAD);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      setLoading(true);
      // Fetch only published posts for the public blog
      const { data, error } = await supabase.from('blog_posts').select('*').eq('published', true).order('created_at', { ascending: false });
      if (error) {
        toast.error('Failed to load blog posts', { description: error.message });
      } else {
        // Map Supabase data to BlogPost interface, extracting shortDescription from content
        const mappedPosts = data.map(post => ({
          id: post.id,
          title: post.title,
          image_url: post.image_url,
          shortDescription: post.content ? post.content.replace(/<[^>]*>/g, '').substring(0, 150) + '...' : '', // Strip HTML and truncate
          content: post.content,
          published: post.published,
        }));
        setBlogPosts(mappedPosts || []);
      }
      setLoading(false);
    };

    fetchBlogPosts();
  }, []);

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

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-dairy-blue" />
          </div>
        ) : blogPosts.length === 0 ? (
          <div className="text-center text-xl text-dairy-text">
            {t('no_blog_posts_available')}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            {blogPosts.slice(0, visiblePosts).map((post) => (
              <BlogPostCard key={post.id} post={{
                id: post.id,
                title: post.title,
                image: post.image_url, // Pass image_url as image prop
                shortDescription: post.shortDescription,
              }} />
            ))}
          </div>
        )}

        {visiblePosts < blogPosts.length && (
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