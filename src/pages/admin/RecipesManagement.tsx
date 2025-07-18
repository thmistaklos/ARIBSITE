import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { PlusCircle, Edit, Trash2, Loader2, Eye } from 'lucide-react';
import AnimatedButton from '@/components/AnimatedButton';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'; // Import Form components

interface Recipe {
  id: string;
  title: string;
  image_url: string | null;
  ingredients: string[];
  preparation_steps: string[];
}

const recipeSchema = z.object({
  title: z.string().min(2, { message: 'Title must be at least 2 characters.' }),
  image_url: z.string().url().nullable().optional(),
  ingredients: z.string().min(1, { message: 'Ingredients cannot be empty.' }), // Raw string input
  preparation_steps: z.string().min(1, { message: 'Preparation steps cannot be empty.' }), // Raw string input
});

const RecipesManagement: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const form = useForm<z.infer<typeof recipeSchema>>({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      title: '',
      image_url: null,
      ingredients: '',
      preparation_steps: '',
    },
  });

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('recipes').select('*').order('title', { ascending: true });
    if (error) {
      toast.error('Failed to fetch recipes', { description: error.message });
    } else {
      setRecipes(data || []);
    }
    setLoading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setImagePreviewUrl(URL.createObjectURL(file));
    } else {
      setSelectedFile(null);
      setImagePreviewUrl(currentRecipe?.image_url || null);
    }
  };

  const onSubmit = async (values: z.infer<typeof recipeSchema>) => {
    setIsSubmitting(true);
    let imageUrl = currentRecipe?.image_url || null;

    try {
      if (selectedFile) {
        const fileName = `${Date.now()}-${selectedFile.name}`;
        const filePath = `recipe-images/${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('recipe-images')
          .upload(filePath, selectedFile, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) {
          throw uploadError;
        }

        const { data: publicUrlData } = supabase.storage
          .from('recipe-images')
          .getPublicUrl(filePath);

        imageUrl = publicUrlData.publicUrl;
      } else if (!currentRecipe && !imageUrl) {
        toast.error('Image required', { description: 'Please upload an image for the new recipe.' });
        setIsSubmitting(false);
        return;
      }

      // Parse ingredients and steps from string to JSON array
      const parsedIngredients = values.ingredients.split('\n').map(item => item.trim()).filter(item => item.length > 0);
      const parsedSteps = values.preparation_steps.split('\n').map(step => step.trim()).filter(step => step.length > 0);

      const recipeData = {
        title: values.title,
        image_url: imageUrl,
        ingredients: parsedIngredients,
        preparation_steps: parsedSteps,
      };

      if (currentRecipe) {
        const { error } = await supabase
          .from('recipes')
          .update(recipeData)
          .eq('id', currentRecipe.id);

        if (error) {
          throw error;
        }
        toast.success('Recipe updated successfully!');
      } else {
        const { error } = await supabase
          .from('recipes')
          .insert([recipeData]);

        if (error) {
          throw error;
        }
        toast.success('Recipe added successfully!');
      }

      setIsDialogOpen(false);
      fetchRecipes();
    } catch (error: any) {
      toast.error('Operation Failed', { description: error.message });
    } finally {
      setIsSubmitting(false);
      setSelectedFile(null);
      setImagePreviewUrl(null);
    }
  };

  const handleDeleteRecipe = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      const { error } = await supabase.from('recipes').delete().eq('id', id);
      if (error) {
        toast.error('Failed to delete recipe', { description: error.message });
      } else {
        toast.success('Recipe deleted successfully!');
        fetchRecipes();
      }
    }
  };

  const openAddDialog = () => {
    setCurrentRecipe(null);
    form.reset({ title: '', image_url: null, ingredients: '', preparation_steps: '' });
    setSelectedFile(null);
    setImagePreviewUrl(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (recipe: Recipe) => {
    setCurrentRecipe(recipe);
    form.reset({
      ...recipe,
      ingredients: recipe.ingredients.join('\n'), // Convert array back to string for textarea
      preparation_steps: recipe.preparation_steps.join('\n'), // Convert array back to string for textarea
    });
    setSelectedFile(null);
    setImagePreviewUrl(recipe.image_url);
    setIsDialogOpen(true);
  };

  const openPreviewDialog = (recipe: Recipe) => {
    setCurrentRecipe(recipe);
    setIsPreviewOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-dairy-darkBlue">Recipes Management</h1>
        <AnimatedButton onClick={openAddDialog} className="bg-dairy-blue text-white hover:bg-dairy-darkBlue" soundOnClick="/sounds/click.mp3">
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Recipe
        </AnimatedButton>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-dairy-blue" />
        </div>
      ) : (
        <div className="rounded-md border border-dairy-blue/20 bg-white shadow-md overflow-hidden">
          <div className="overflow-x-auto"> {/* Added for horizontal scrolling */}
            <Table>
              <TableHeader>
                <TableRow className="bg-dairy-blue/10">
                  <TableHead className="w-[80px] text-dairy-darkBlue">Image</TableHead>
                  <TableHead className="text-dairy-darkBlue">Title</TableHead>
                  <TableHead className="text-dairy-darkBlue">Ingredients</TableHead>
                  <TableHead className="text-right text-dairy-darkBlue">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recipes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-dairy-text">
                      No recipes found.
                    </TableCell>
                  </TableRow>
                ) : (
                  recipes.map((recipe) => (
                    <TableRow key={recipe.id}>
                      <TableCell>
                        {recipe.image_url && (
                          <img src={recipe.image_url} alt={recipe.title} className="w-12 h-12 object-cover rounded-md" />
                        )}
                      </TableCell>
                      <TableCell className="font-medium text-dairy-darkBlue">{recipe.title}</TableCell>
                      <TableCell className="text-dairy-text line-clamp-2">{recipe.ingredients.join(', ')}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <AnimatedButton variant="outline" size="sm" onClick={() => openPreviewDialog(recipe)} soundOnClick="/sounds/click.mp3">
                            <Eye className="h-4 w-4" />
                          </AnimatedButton>
                          <AnimatedButton variant="outline" size="sm" onClick={() => openEditDialog(recipe)} soundOnClick="/sounds/click.mp3">
                            <Edit className="h-4 w-4" />
                          </AnimatedButton>
                          <AnimatedButton variant="destructive" size="sm" onClick={() => handleDeleteRecipe(recipe.id)} soundOnClick="/sounds/click.mp3">
                            <Trash2 className="h-4 w-4" />
                          </AnimatedButton>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] bg-dairy-cream border-dairy-blue/20 shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-dairy-darkBlue">{currentRecipe ? 'Edit Recipe' : 'Add New Recipe'}</DialogTitle>
            <DialogDescription className="text-dairy-text">
              {currentRecipe ? 'Make changes to the recipe details here.' : 'Add a new delicious recipe.'}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}> {/* Wrapped the form with Form component */}
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right text-dairy-text">Title</FormLabel>
                    <FormControl className="col-span-3">
                      <Input {...field} className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue" />
                    </FormControl>
                    <FormMessage className="col-span-4 col-start-2" />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="image" className="text-right text-dairy-text">
                  Image
                </Label>
                <div className="col-span-3 flex flex-col gap-2">
                  <Input
                    id="image"
                    name="image"
                    type="file"
                    onChange={handleFileChange}
                    className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue"
                    accept="image/*"
                  />
                  {imagePreviewUrl && (
                    <img src={imagePreviewUrl} alt="Recipe Image Preview" className="w-24 h-24 object-cover rounded-md mt-2" />
                  )}
                  {!selectedFile && currentRecipe?.image_url && (
                    <p className="text-xs text-muted-foreground mt-1">Current image will be used if no new file is selected.</p>
                  )}
                </div>
              </div>
              <FormField
                control={form.control}
                name="ingredients"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-start gap-4">
                    <FormLabel className="text-right text-dairy-text">Ingredients (one per line)</FormLabel>
                    <FormControl className="col-span-3">
                      <Textarea {...field} rows={5} className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue" />
                    </FormControl>
                    <FormMessage className="col-span-4 col-start-2" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="preparation_steps"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-start gap-4">
                    <FormLabel className="text-right text-dairy-text">Preparation Steps (one per line)</FormLabel>
                    <FormControl className="col-span-3">
                      <Textarea {...field} rows={7} className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue" />
                    </FormControl>
                    <FormMessage className="col-span-4 col-start-2" />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <AnimatedButton type="submit" className="bg-dairy-blue text-white hover:bg-dairy-darkBlue" soundOnClick="/sounds/click.mp3" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {currentRecipe ? 'Saving...' : 'Adding...'}
                    </>
                  ) : (
                    currentRecipe ? 'Save Changes' : 'Add Recipe'
                  )}
                </AnimatedButton>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Recipe Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-[800px] bg-dairy-cream border-dairy-blue/20 shadow-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-dairy-darkBlue">{currentRecipe?.title || 'Recipe Preview'}</DialogTitle>
            <DialogDescription className="text-dairy-text">
              This is how your recipe will appear on the public site.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-6">
            {currentRecipe?.image_url && (
              <img src={currentRecipe.image_url} alt={currentRecipe.title} className="w-full h-64 object-cover rounded-md shadow-sm" />
            )}
            <div>
              <h3 className="text-xl font-semibold text-dairy-darkBlue mb-2">Ingredients:</h3>
              <ul className="list-disc list-inside text-dairy-text">
                {currentRecipe?.ingredients.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-dairy-darkBlue mb-2">Preparation:</h3>
              <ol className="list-decimal list-inside text-dairy-text">
                {currentRecipe?.preparation_steps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsPreviewOpen(false)} className="bg-dairy-blue text-white hover:bg-dairy-darkBlue">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default RecipesManagement;