import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import AnimatedButton from '@/components/AnimatedButton';
import HomeBlogPostCard from './HomeBlogPostCard';
import './HomeBlogSection.css';

interface BlogPost {
  id: string;
  title_en: string;
  title_ar: string | null;
  title_fr: string | null;
  content_en: string;
  content_ar: string | null;
  content_fr: string | null;
  image_url: string | null;
}

const BlogSection: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title_en, title_ar, title_fr, content_en, content_ar, content_fr, image_url')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        toast.error('Failed to load blog posts', { description: error.message });
      } else {
        setPosts(data || []);
      }
      setLoading(false);
    };

    fetchPosts();
  }, []);

  const getLocalizedText = (post: BlogPost, field: 'title' | 'content') => {
    const lang = i18n.language;
    if (lang === 'ar') return post[`${field}_ar`] || post[`${field}_en`];
    if (lang === 'fr') return post[`${field}_fr`] || post[`${field}_en`];
    return post[`${field}_en`];
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-dairy-blue" />
      </div>
    );
  }

  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-12 px-4 bg-dairy-cream">
      <div className="container mx-auto">
        <motion.h2
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 100, damping: 10 }}
          className="text-4xl md:text-5xl font-bold text-center text-dairy-darkBlue mb-12"
        >
          {t('from_our_blog', 'From Our Blog')}
        </motion.h2>

        <div className="home-blog-page-content">
          {posts.map((post) => (
            <HomeBlogPostCard key={post.id} post={{
              id: post.id,
              title: getLocalizedText(post, 'title'),
              content: getLocalizedText(post, 'content'),
              image_url: post.image_url
            }} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex justify-center mt-12"
        >
          <Link to="/blog">
            <AnimatedButton
              className="bg-dairy-blue text-white hover:bg-dairy-darkBlue"
              soundOnClick="/sounds/click.mp3"
            >
              {t('view_all_posts')}
            </AnimatedButton>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default BlogSection;