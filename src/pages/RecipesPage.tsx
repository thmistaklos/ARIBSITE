import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import RecipeCard from '@/components/RecipeCard';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

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

const RecipesPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('recipes').select('*').order('title_en', { ascending: true });
      if (error) {
        toast.error('Failed to load recipes', { description: error.message });
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
          {t('delicious_recipes')}
        </motion.h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-dairy-blue" />
          </div>
        ) : recipes.length === 0 ? (
          <div className="text-center text-xl text-dairy-text">
            {t('no_recipes_available')}
          </div>
        ) : (
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
        )}
      </div>
    </motion.div>
  );
};

export default RecipesPage;