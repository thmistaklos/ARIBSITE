import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import BlogPostCard from '@/components/BlogPostCard';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface BlogPost {
  id: string;
  image_url: string | null;
  title_en: string;
  title_ar: string | null;
  title_fr: string | null;
  content_en: string;
  content_ar: string | null;
  content_fr: string | null;
}

const BlogPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) {
        toast.error('Failed to load blog posts', { description: error.message });
      } else {
        setBlogPosts(data || []);
      }
      setLoading(false);
    };

    fetchBlogPosts();
  }, []);

  const getLocalizedText = (post: BlogPost, field: 'title' | 'content') => {
    const lang = i18n.language;
    if (lang === 'ar') return post[`${field}_ar`] || post[`${field}_en`];
    if (lang === 'fr') return post[`${field}_fr`] || post[`${field}_en`];
    return post[`${field}_en`];
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
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
          <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-dairy-blue" /></div>
        ) : blogPosts.length === 0 ? (
          <div className="text-center text-xl text-dairy-text">{t('no_blog_posts_available')}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            {blogPosts.map((post) => {
              const title = getLocalizedText(post, 'title');
              const content = getLocalizedText(post, 'content');
              const shortDescription = content.replace(/<[^>]*>/g, '').substring(0, 150) + '...';
              return (
                <BlogPostCard key={post.id} post={{
                  id: post.id,
                  title: title,
                  image: post.image_url || '',
                  shortDescription: shortDescription,
                }} />
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default BlogPage;