import React, { useState } from 'react';
import { motion } from 'framer-motion';
import BlogPostCard from '@/components/BlogPostCard';
import AnimatedButton from '@/components/AnimatedButton';
import { useTranslation } from 'react-i18next';

interface BlogPost {
  id: string;
  title: string;
  image: string;
  shortDescription: string;
  content: string; // Full content for detail page
}

const ALL_BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'The Amazing Benefits of Dairy', // Changed title here
    image: 'https://via.placeholder.com/400x300/ADD8E6/000000?text=Dairy+Health',
    shortDescription: 'Discover how dairy products contribute to a healthy lifestyle, from strong bones to improved immunity.',
    content: 'Dairy products are packed with essential nutrients like calcium, vitamin D, and protein, which are crucial for bone health. Regular consumption can also support muscle growth and overall well-being. Beyond calcium, milk, yogurt, and cheese offer a range of vitamins and minerals that play vital roles in various bodily functions, including nerve function and energy production. Incorporating dairy into your diet can be a delicious way to boost your nutrient intake.',
  },
  {
    id: '2',
    title: 'Behind the Scenes: Our Sustainable Farming',
    image: 'https://via.placeholder.com/400x300/90EE90/000000?text=Sustainable+Farm',
    shortDescription: 'Learn about ARIB DAIRY\'s commitment to sustainable farming practices and animal welfare.',
    content: 'At ARIB DAIRY, sustainability is at the core of everything we do. We employ eco-friendly farming techniques, minimize waste, and prioritize the well-being of our cows. Our farms utilize renewable energy sources and efficient water management systems to reduce our environmental footprint. We believe that healthy cows and a healthy planet lead to the best quality dairy products. Our commitment extends to ensuring our animals are treated with the utmost care and respect, providing them with comfortable living conditions and nutritious diets.',
  },
  {
    id: '3',
    title: 'Delicious Dairy-Free Alternatives (and why ours are better!)',
    image: 'https://via.placeholder.com/400x300/FFD700/000000?text=Dairy+Alternatives',
    shortDescription: 'Exploring the world of dairy-free options and why traditional dairy remains a superior choice for many.',
    content: 'While dairy-free alternatives have gained popularity, traditional dairy products offer a unique nutritional profile and taste that is hard to replicate. Our dairy products are naturally rich in calcium, protein, and vitamins, providing a wholesome and complete food source. We believe in the natural goodness of milk and its derivatives, offering unparalleled flavor and texture for cooking and consumption. For those who can enjoy dairy, it remains an excellent source of essential nutrients.',
  },
  {
    id: '4',
    title: 'The Journey of Milk: From Farm to Bottle',
    image: 'https://via.placeholder.com/400x300/FFB6C1/000000?text=Milk+Journey',
    shortDescription: 'Follow the meticulous process that ensures our milk is fresh, safe, and delicious when it reaches you.',
    content: 'The journey of ARIB DAIRY milk begins on our lush green pastures, where our cows graze freely. After milking, the milk is quickly transported to our state-of-the-art processing facility. Here, it undergoes rigorous quality checks, pasteurization, and homogenization to ensure its safety and creamy texture. Finally, it\'s bottled and delivered fresh to your local stores, maintaining its natural goodness every step of the way. Our commitment to hygiene and quality control ensures that every bottle meets the highest standards.',
  },
  {
    id: '5',
    title: 'Seasonal Dairy Delights',
    image: 'https://via.placeholder.com/400x300/87CEEB/000000?text=Seasonal+Dairy',
    shortDescription: 'Discover unique dairy products and recipes that are perfect for each season of the year.',
    content: 'Embrace the changing seasons with our special dairy delights! In spring, enjoy light and fresh yogurt parfaits with seasonal berries. Summer calls for refreshing homemade ice creams and chilled milkshakes. As autumn arrives, warm up with creamy pumpkin spice lattes made with our rich milk. Winter is perfect for indulging in hearty cheese fondues and comforting hot chocolates. Each season brings new opportunities to enjoy the versatility of dairy.',
  },
];

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {ALL_BLOG_POSTS.slice(0, visiblePosts).map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>

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