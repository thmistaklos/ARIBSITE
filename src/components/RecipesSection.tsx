import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import RecipeCard from '@/components/RecipeCard';
import AnimatedButton from '@/components/AnimatedButton';

interface Recipe {
  id: string;
  image_url: string;
  title_en: string;
  title_ar: string | null;
  title_fr: string | null;
  preparation_steps_en: string[];
  preparation_steps_ar: string[] | null;
  preparation_steps_fr: string[] | null;
  ingredients_en: string[];
  ingredients_ar: string[] | null;
  ingredients_fr: string[] | null;
}

interface RecipesSectionProps {}

const RecipesSection: React.FC<RecipesSectionProps> = () => {
  const { t, i18n } = useTranslation();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('recipes').select('*').order('title_en', { ascending: true }).limit(4);
      if (error) {
        toast.error('Failed to load recipes for homepage', { description: error.message });
      } else {
        setRecipes(data || []);
      }
      setLoading(false);
    };

    fetchRecipes();
  }, []);

  const getLocalizedText = (item: any, fieldPrefix: string) => {
    const lang = i18n.language;
    return item[`${fieldPrefix}_${lang}`] || item[`${fieldPrefix}_en`];
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-dairy-blue" />
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <div className="text-center text-xl text-dairy-text mt-8">
        {t('no_recipes_available')}
      </div>
    );
  }

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="w-full py-8 px-4"
    >
      <div className="container mx-auto">
        <motion.h2
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 100, damping: 10 }}
          className="text-4xl md:text-5xl font-bold text-center text-dairy-darkBlue mb-12"
        >
          {t('delicious_recipes')}
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={{
              id: recipe.id,
              title: getLocalizedText(recipe, 'title'),
              image: recipe.image_url,
              shortDescription: (getLocalizedText(recipe, 'preparation_steps')?.[0]) || '',
              ingredients: getLocalizedText(recipe, 'ingredients'),
              preparation: getLocalizedText(recipe, 'preparation_steps'),
            }} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex justify-center mt-12"
        >
          <Link to="/recipes">
            <AnimatedButton
              className="bg-dairy-blue text-white hover:bg-dairy-darkBlue"
              soundOnClick="/sounds/click.mp3"
            >
              {t('view_all_recipes')}
            </AnimatedButton>
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default RecipesSection;