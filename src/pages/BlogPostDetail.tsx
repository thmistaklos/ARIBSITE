import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

interface BlogPost {
  id: string;
  title: string;
  image_url: string; // Changed to image_url to match Supabase schema
  content: string;
  author: string; // Added author
  created_at: string; // Added created_at
}

const BlogPostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      if (!id) {
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .eq('published', true) // Only show published posts on public detail page
        .single();

      if (error) {
        toast.error('Failed to load blog post', { description: error.message });
        setPost(null);
      } else {
        setPost(data || null);
      }
      setLoading(false);
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-160px)] flex items-center justify-center bg-dairy-cream text-dairy-text py-12 px-4">
        <Loader2 className="h-10 w-10 animate-spin text-dairy-blue" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-[calc(100vh-160px)] flex items-center justify-center bg-dairy-cream text-dairy-text py-12 px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-dairy-darkBlue">{t('post_not_found')}</h1>
          <p className="text-xl text-dairy-text mb-6">{t('post_not_found_desc')}</p>
          <Link to="/blog">
            <Button className="bg-dairy-blue text-white hover:bg-dairy-darkBlue">
              <ArrowLeft className="mr-2 h-4 w-4" /> {t('back_to_blog')}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="min-h-[calc(100vh-160px)] bg-dairy-cream text-dairy-text py-12 px-4"
    >
      <div className="container mx-auto max-w-4xl bg-white rounded-xl shadow-lg border-2 border-dairy-blue/20 p-6 md:p-10">
        <Link to="/blog" className="flex items-center text-dairy-blue hover:text-dairy-darkBlue transition-colors mb-6">
          <ArrowLeft className="mr-2 h-5 w-5" /> {t('back_to_blog')}
        </Link>

        <motion.img
          src={post.image_url}
          alt={post.title}
          className="w-full h-64 md:h-96 object-cover rounded-lg mb-8 shadow-md"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        />

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-4xl md:text-5xl font-bold text-dairy-darkBlue mb-6"
        >
          {post.title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-sm text-gray-600 mb-4"
        >
          By {post.author} on {new Date(post.created_at).toLocaleDateString()}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-lg text-dairy-text leading-relaxed mb-8 prose max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* You can add more sections here, e.g., author, date, related posts */}
      </div>
    </motion.div>
  );
};

export default BlogPostDetail;