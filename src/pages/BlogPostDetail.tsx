import React from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';

interface BlogPost {
  id: string;
  title: string;
  image: string;
  shortDescription: string;
  content: string;
}

// This should ideally come from a backend/database
const ALL_BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'The Health Benefits of Dairy',
    image: 'https://via.placeholder.com/800x450/ADD8E6/000000?text=Dairy+Health',
    shortDescription: 'Discover how dairy products contribute to a healthy lifestyle, from strong bones to improved immunity.',
    content: 'Dairy products are packed with essential nutrients like calcium, vitamin D, and protein, which are crucial for bone health. Regular consumption can also support muscle growth and overall well-being. Beyond calcium, milk, yogurt, and cheese offer a range of vitamins and minerals that play vital roles in various bodily functions, including nerve function and energy production. Incorporating dairy into your diet can be a delicious way to boost your nutrient intake. Studies show that dairy consumption is linked to a reduced risk of osteoporosis and can aid in weight management. Furthermore, the probiotics found in fermented dairy products like yogurt can significantly improve gut health, leading to better digestion and a stronger immune system. It\'s a versatile food group that can be enjoyed in many forms, from a refreshing glass of milk to a savory cheese platter.',
  },
  {
    id: '2',
    title: 'Behind the Scenes: Our Sustainable Farming',
    image: 'https://via.placeholder.com/800x450/90EE90/000000?text=Sustainable+Farm',
    shortDescription: 'Learn about ARIB DAIRY\'s commitment to sustainable farming practices and animal welfare.',
    content: 'At ARIB DAIRY, sustainability is at the core of everything we do. We employ eco-friendly farming techniques, minimize waste, and prioritize the well-being of our cows. Our farms utilize renewable energy sources and efficient water management systems to reduce our environmental footprint. We believe that healthy cows and a healthy planet lead to the best quality dairy products. Our commitment extends to ensuring our animals are treated with the utmost care and respect, providing them with comfortable living conditions and nutritious diets. We continuously invest in research and development to find innovative ways to improve our environmental performance and ensure the longevity of our natural resources. Our goal is to provide delicious dairy while preserving the planet for future generations.',
  },
  {
    id: '3',
    title: 'Delicious Dairy-Free Alternatives (and why ours are better!)',
    image: 'https://via.placeholder.com/800x450/FFD700/000000?text=Dairy+Alternatives',
    shortDescription: 'Exploring the world of dairy-free options and why traditional dairy remains a superior choice for many.',
    content: 'While dairy-free alternatives have gained popularity, traditional dairy products offer a unique nutritional profile and taste that is hard to replicate. Our dairy products are naturally rich in calcium, protein, and vitamins, providing a wholesome and complete food source. We believe in the natural goodness of milk and its derivatives, offering unparalleled flavor and texture for cooking and consumption. For those who can enjoy dairy, it remains an excellent source of essential nutrients. Unlike many alternatives, our dairy is minimally processed, retaining its natural goodness and flavor. We pride ourselves on the purity and simplicity of our ingredients, ensuring you get the best nature has to offer.',
  },
  {
    id: '4',
    title: 'The Journey of Milk: From Farm to Bottle',
    image: 'https://via.placeholder.com/800x450/FFB6C1/000000?text=Milk+Journey',
    shortDescription: 'Follow the meticulous process that ensures our milk is fresh, safe, and delicious when it reaches you.',
    content: 'The journey of ARIB DAIRY milk begins on our lush green pastures, where our cows graze freely. After milking, the milk is quickly transported to our state-of-the-art processing facility. Here, it undergoes rigorous quality checks, pasteurization, and homogenization to ensure its safety and creamy texture. Finally, it\'s bottled and delivered fresh to your local stores, maintaining its natural goodness every step of the way. Our commitment to hygiene and quality control ensures that every bottle meets the highest standards. We employ advanced technology to monitor every stage of production, from the health of our cows to the final packaging, guaranteeing a product you can trust.',
  },
  {
    id: '5',
    title: 'Seasonal Dairy Delights',
    image: 'https://via.placeholder.com/800x450/87CEEB/000000?text=Seasonal+Dairy',
    shortDescription: 'Discover unique dairy products and recipes that are perfect for each season of the year.',
    content: 'Embrace the changing seasons with our special dairy delights! In spring, enjoy light and fresh yogurt parfaits with seasonal berries. Summer calls for refreshing homemade ice creams and chilled milkshakes. As autumn arrives, warm up with creamy pumpkin spice lattes made with our rich milk. Winter is perfect for indulging in hearty cheese fondues and comforting hot chocolates. Each season brings new opportunities to enjoy the versatility of dairy. We also offer limited-edition seasonal products, so keep an eye out for new flavors and treats that celebrate the best of each time of year.',
  },
];

const BlogPostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const post = ALL_BLOG_POSTS.find(p => p.id === id);

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

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-lg text-dairy-text leading-relaxed mb-8"
        >
          {post.content}
        </motion.p>

        {/* You can add more sections here, e.g., author, date, related posts */}
      </div>
    </motion.div>
  );
};

export default BlogPostDetail;