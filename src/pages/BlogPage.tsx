import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import BlogPostCard from '@/components/BlogPostCard';
import AnimatedButton from '@/components/AnimatedButton';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase'; // Import supabase
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface BlogPost {
  id: string;
  title: string;
  image_url: string; // Changed to image_url to match Supabase
  shortDescription: string;
  content: string;
  published: boolean; // Added published field
}

const BlogPage: React.FC = () => {
  const { t } = useTranslation();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  // Removed visiblePosts and loadMorePosts as we'll fetch all published posts

  useEffect(() => {
    const fetchBlogPosts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true) // Only fetch published posts
        .order('created_at', { ascending: false }); // Order by creation date

      if (error) {
        toast.error('Failed to load blog posts', { description: error.message });
      } else {
        // Map Supabase data to BlogPost interface, creating shortDescription from content
        const mappedPosts = data.map(post => ({
          id: post.id,
          title: post.title,
          image_url: post.image_url,
          shortDescription: post.content.replace(/<[^>]*>/g, '').substring(0, 150) + '...', // Strip HTML and truncate
          content: post.content,
          published: post.published,
        }));
        setBlogPosts(mappedPosts || []);
      }
      setLoading(false);
    };

    fetchBlogPosts();
  }, []);

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
      className="min-h-[calc(100vh-232px)] bg-dairy-cream text-dairy-text py-12 px-4"
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
            {blogPosts.map((post) => (
              <BlogPostCard key={post.id} post={{
                id: post.id,
                title: post.title,
                image: post.image_url, // Pass image_url to BlogPostCard
                shortDescription: post.shortDescription,
              }} />
            ))}
          </div>
        )}

        {/* Removed Load More button as all published posts are fetched */}
      </div>
    </motion.div>
  );
};

export default BlogPage;