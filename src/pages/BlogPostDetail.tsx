import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { ALL_BLOG_POSTS } from '@/data/blogPosts'; // Import from new data file

interface BlogPost {
  id: string;
  title: string;
  image: string;
  content: string;
  shortDescription: string; // Added shortDescription for consistency with ALL_BLOG_POSTS
}

const BlogPostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const [post, setPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    // Find the post from the hardcoded array
    const foundPost = ALL_BLOG_POSTS.find(p => p.id === id);
    setPost(foundPost || null);
  }, [id]);

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
          src={post.image}
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