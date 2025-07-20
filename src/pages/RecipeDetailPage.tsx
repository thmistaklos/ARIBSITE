import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

interface Recipe {
  id: string;
  title: string;
  image_url: string;
  ingredients: string[];
  preparation_steps: string[];
}

const RecipeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      setLoading(true);
      if (!id) {
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        toast.error('Failed to load recipe', { description: error.message });
        setRecipe(null);
      } else {
        setRecipe(data || null);
      }
      setLoading(false);
    };

    fetchRecipe();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-232px)] flex items-center justify-center bg-dairy-cream text-dairy-text py-12 px-4">
        <Loader2 className="h-10 w-10 animate-spin text-dairy-blue" />
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-[calc(100vh-232px)] flex items-center justify-center bg-dairy-cream text-dairy-text py-12 px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-dairy-darkBlue">{t('recipe_not_found')}</h1>
          <p className="text-xl text-dairy-text mb-6">{t('recipe_not_found_desc')}</p>
          <Link to="/recipes">
            <Button className="bg-dairy-blue text-white hover:bg-dairy-darkBlue">
              <ArrowLeft className="mr-2 h-4 w-4" /> {t('back_to_recipes')}
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
      className="min-h-[calc(100vh-232px)] bg-dairy-cream text-dairy-text py-12 px-4"
    >
      <div className="container mx-auto max-w-4xl bg-white rounded-xl shadow-lg border-2 border-dairy-blue/20 p-6 md:p-10">
        <Link to="/recipes" className="flex items-center text-dairy-blue hover:text-dairy-darkBlue transition-colors mb-6">
          <ArrowLeft className="mr-2 h-5 w-5" /> {t('back_to_recipes')}
        </Link>

        <motion.img
          src={recipe.image_url}
          alt={recipe.title}
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
          {recipe.title}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="space-y-8"
        >
          <div>
            <h2 className="text-2xl font-semibold text-dairy-darkBlue mb-4">{t('ingredients')}</h2>
            <ul className="list-disc list-inside text-lg text-dairy-text space-y-2">
              {recipe.ingredients.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-dairy-darkBlue mb-4">{t('preparation')}</h2>
            <ol className="list-decimal list-inside text-lg text-dairy-text space-y-2">
              {recipe.preparation_steps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default RecipeDetailPage;