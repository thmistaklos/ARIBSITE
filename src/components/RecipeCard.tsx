import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AnimatedButton from '@/components/AnimatedButton';
import { Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom'; // Import Link

interface RecipeCardProps {
  recipe: {
    id: string;
    title: string;
    image: string;
    shortDescription: string;
    ingredients: string[];
    preparation: string[];
  };
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  const { t } = useTranslation();

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: recipe.title,
        text: recipe.shortDescription,
        url: `${window.location.origin}/recipes/${recipe.id}`, // Specific recipe URL
      })
      .then(() => toast.success(t('recipe_shared_success')))
      .catch((error) => toast.error(t('recipe_shared_error'), { description: error.message }));
    } else {
      navigator.clipboard.writeText(`${recipe.title}: ${recipe.shortDescription} - ${window.location.origin}/recipes/${recipe.id}`);
      toast.info(t('recipe_link_copied'));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03, boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.1)' }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-sm"
    >
      <Card className="rounded-xl overflow-hidden border-2 border-dairy-blue/20 bg-dairy-cream shadow-lg h-full flex flex-col">
        <CardHeader className="p-0">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-48 object-cover"
          />
        </CardHeader>
        <CardContent className="p-6 flex-grow flex flex-col justify-between">
          <div>
            <CardTitle className="text-2xl font-semibold text-dairy-darkBlue mb-2">{recipe.title}</CardTitle>
            <p className="text-dairy-text text-sm mb-4 line-clamp-3">{recipe.shortDescription}</p>
          </div>
          <div className="flex justify-between items-center mt-4">
            <AnimatedButton
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="text-dairy-blue border-dairy-blue hover:bg-dairy-blue hover:text-white"
              soundOnClick="/sounds/click.mp3"
            >
              <Share2 className="h-4 w-4 mr-2" /> {t('share')}
            </AnimatedButton>
            <Link to={`/recipes/${recipe.id}`}> {/* Link to RecipeDetailPage */}
              <AnimatedButton
                variant="default"
                size="sm"
                className="bg-dairy-darkBlue text-dairy-cream hover:bg-dairy-blue"
                soundOnClick="/sounds/click.mp3"
              >
                {t('view_details')}
              </AnimatedButton>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RecipeCard;