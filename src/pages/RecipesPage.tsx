import React from 'react';
import { motion } from 'framer-motion';
import RecipeCard from '@/components/RecipeCard';
import { useTranslation } from 'react-i18next';

interface Recipe {
  id: string;
  title: string;
  image: string;
  shortDescription: string;
  ingredients: string[];
  preparation: string[];
}

const DUMMY_RECIPES: Recipe[] = [
  {
    id: '1',
    title: 'Creamy Tomato Pasta',
    image: 'https://via.placeholder.com/400x300/FFDAB9/000000?text=Creamy+Pasta',
    shortDescription: 'A rich and creamy pasta dish made with fresh dairy cream and ripe tomatoes.',
    ingredients: ['200g pasta', '1 cup heavy cream', '1 can crushed tomatoes', 'Garlic', 'Parmesan cheese'],
    preparation: ['Cook pasta.', 'Sauté garlic, add tomatoes and cream.', 'Combine with pasta, serve with cheese.'],
  },
  {
    id: '2',
    title: 'Homemade Yogurt Parfait',
    image: 'https://via.placeholder.com/400x300/B0E0E6/000000?text=Yogurt+Parfait',
    shortDescription: 'Layers of homemade yogurt, fresh berries, and crunchy granola for a healthy breakfast.',
    ingredients: ['1 cup plain yogurt', '1/2 cup mixed berries', '1/4 cup granola', 'Honey (optional)'],
    preparation: ['Layer yogurt, berries, and granola in a glass.', 'Repeat layers.', 'Drizzle with honey if desired.'],
  },
  {
    id: '3',
    title: 'Classic Milkshake',
    image: 'https://via.placeholder.com/400x300/F0E68C/000000?text=Milkshake',
    shortDescription: 'A simple yet delicious classic milkshake, perfect for a sweet treat.',
    ingredients: ['1 cup milk', '2 scoops vanilla ice cream', '1 tbsp sugar', 'Flavoring (chocolate/strawberry)'],
    preparation: ['Blend all ingredients until smooth.', 'Pour into a tall glass and serve.'],
  },
  {
    id: '4',
    title: 'Cheesy Garlic Bread',
    image: 'https://via.placeholder.com/400x300/D8BFD8/000000?text=Garlic+Bread',
    shortDescription: 'Warm, crusty bread topped with melted cheese and aromatic garlic butter.',
    ingredients: ['1 baguette', '1/2 cup shredded mozzarella', '2 tbsp butter', '2 cloves garlic', 'Parsley'],
    preparation: ['Slice baguette, mix butter and minced garlic.', 'Spread on bread, top with cheese.', 'Bake until golden.'],
  },
];

const RecipesPage: React.FC = () => {
  const { t } = useTranslation();

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
          {t('delicious_recipes')}
        </motion.h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
          {DUMMY_RECIPES.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default RecipesPage;