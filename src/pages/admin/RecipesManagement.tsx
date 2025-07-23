import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { PlusCircle, Edit, Trash2, Loader2, Eye } from 'lucide-react';
import AnimatedButton from '@/components/AnimatedButton';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

interface Recipe {
  id: string;
  image_url: string | null;
  title_en: string;
  title_ar: string | null;
  title_fr: string | null;
  ingredients_en: string[];
  ingredients_ar: string[] | null;
  ingredients_fr: string[] | null;
  preparation_steps_en: string[];
  preparation_steps_ar: string[] | null;
  preparation_steps_fr: string[] | null;
}

const recipeSchema = z.object({
  image_url: z.string().url().nullable().optional().or(z.literal('')),
  title_en: z.string().min(2, { message: 'English title is required.' }),
  title_ar: z.string().min(2, { message: 'Arabic title is required.' }),
  title_fr: z.string().min(2, { message: 'French title is required.' }),
  ingredients_en: z.string().min(1, { message: 'English ingredients are required.' }),
  ingredients_ar: z.string().min(1, { message: 'Arabic ingredients are required.' }),
  ingredients_fr: z.string().min(1, { message: 'French ingredients are required.' }),
  preparation_steps_en: z.string().min(1, { message: 'English preparation steps are required.' }),
  preparation_steps_ar: z.string().min(1, { message: 'Arabic preparation steps are required.' }),
  preparation_steps_fr: z.string().min(1, { message: 'French preparation steps are required.' }),
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
      title_en: '', title_ar: '', title_fr: '',
      image_url: null,
      ingredients_en: '', ingredients_ar: '', ingredients_fr: '',
      preparation_steps_en: '', preparation_steps_ar: '', preparation_steps_fr: '',
    },
  });

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('recipes').select('*').order('title_en', { ascending: true });
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
        const filePath = `recipes/${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('recipes')
          .upload(filePath, selectedFile, { cacheControl: '3600', upsert: false });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage.from('recipes').getPublicUrl(filePath);
        imageUrl = publicUrlData.publicUrl;
      } else if (!currentRecipe && !imageUrl) {
        toast.error('Image required', { description: 'Please upload an image for the new recipe.' });
        setIsSubmitting(false);
        return;
      }

      const parseStringToArray = (str: string) => str.split('\n').map(item => item.trim()).filter(item => item.length > 0);

      const recipeData = {
        image_url: imageUrl,
        title_en: values.title_en,
        title_ar: values.title_ar,
        title_fr: values.title_fr,
        ingredients_en: parseStringToArray(values.ingredients_en),
        ingredients_ar: parseStringToArray(values.ingredients_ar),
        ingredients_fr: parseStringToArray(values.ingredients_fr),
        preparation_steps_en: parseStringToArray(values.preparation_steps_en),
        preparation_steps_ar: parseStringToArray(values.preparation_steps_ar),
        preparation_steps_fr: parseStringToArray(values.preparation_steps_fr),
      };

      if (currentRecipe) {
        const { error } = await supabase.from('recipes').update(recipeData).eq('id', currentRecipe.id);
        if (error) throw error;
        toast.success('Recipe updated successfully!');
      } else {
        const { error } = await supabase.from('recipes').insert([recipeData]);
        if (error) throw error;
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
    form.reset({
      title_en: '', title_ar: '', title_fr: '',
      image_url: null,
      ingredients_en: '', ingredients_ar: '', ingredients_fr: '',
      preparation_steps_en: '', preparation_steps_ar: '', preparation_steps_fr: '',
    });
    setSelectedFile(null);
    setImagePreviewUrl(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (recipe: Recipe) => {
    setCurrentRecipe(recipe);
    form.reset({
      image_url: recipe.image_url,
      title_en: recipe.title_en,
      title_ar: recipe.title_ar || '',
      title_fr: recipe.title_fr || '',
      ingredients_en: (recipe.ingredients_en || []).join('\n'),
      ingredients_ar: (recipe.ingredients_ar || []).join('\n'),
      ingredients_fr: (recipe.ingredients_fr || []).join('\n'),
      preparation_steps_en: (recipe.preparation_steps_en || []).join('\n'),
      preparation_steps_ar: (recipe.preparation_steps_ar || []).join('\n'),
      preparation_steps_fr: (recipe.preparation_steps_fr || []).join('\n'),
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
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-dairy-blue/10">
                  <TableHead className="w-[80px] text-dairy-darkBlue">Image</TableHead>
                  <TableHead className="text-dairy-darkBlue">Title (EN)</TableHead>
                  <TableHead className="text-dairy-darkBlue">Ingredients (EN)</TableHead>
                  <TableHead className="text-right text-dairy-darkBlue">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recipes.map((recipe) => (
                  <TableRow key={recipe.id}>
                    <TableCell>
                      {recipe.image_url && <img src={recipe.image_url} alt={recipe.title_en} className="w-12 h-12 object-cover rounded-md" />}
                    </TableCell>
                    <TableCell className="font-medium text-dairy-darkBlue">{recipe.title_en}</TableCell>
                    <TableCell className="text-dairy-text line-clamp-2">{recipe.ingredients_en.join(', ')}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <AnimatedButton variant="outline" size="sm" onClick={() => openPreviewDialog(recipe)} soundOnClick="/sounds/click.mp3"><Eye className="h-4 w-4" /></AnimatedButton>
                        <AnimatedButton variant="outline" size="sm" onClick={() => openEditDialog(recipe)} soundOnClick="/sounds/click.mp3"><Edit className="h-4 w-4" /></AnimatedButton>
                        <AnimatedButton variant="destructive" size="sm" onClick={() => handleDeleteRecipe(recipe.id)} soundOnClick="/sounds/click.mp3"><Trash2 className="h-4 w-4" /></AnimatedButton>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[800px] bg-dairy-cream border-dairy-blue/20 shadow-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-dairy-darkBlue">{currentRecipe ? 'Edit Recipe' : 'Add New Recipe'}</DialogTitle>
            <DialogDescription className="text-dairy-text">{currentRecipe ? 'Make changes to the recipe details here.' : 'Add a new delicious recipe.'}</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                <Label htmlFor="image" className="md:text-right text-dairy-text">Image</Label>
                <div className="md:col-span-3 flex flex-col gap-2">
                  <Input id="image" name="image" type="file" onChange={handleFileChange} className="bg-dairy-cream/50 border-dairy-blue/30" accept="image/*" />
                  {imagePreviewUrl && <img src={imagePreviewUrl} alt="Preview" className="w-24 h-24 object-cover rounded-md mt-2" />}
                </div>
              </div>
              <Tabs defaultValue="en" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="en">English</TabsTrigger>
                  <TabsTrigger value="ar">Arabic</TabsTrigger>
                  <TabsTrigger value="fr">French</TabsTrigger>
                </TabsList>
                <TabsContent value="en" className="space-y-4 pt-4">
                  <FormField control={form.control} name="title_en" render={({ field }) => (<FormItem><FormLabel>Title (EN)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="ingredients_en" render={({ field }) => (<FormItem><FormLabel>Ingredients (one per line)</FormLabel><FormControl><Textarea {...field} rows={5} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="preparation_steps_en" render={({ field }) => (<FormItem><FormLabel>Preparation (one per line)</FormLabel><FormControl><Textarea {...field} rows={7} /></FormControl><FormMessage /></FormItem>)} />
                </TabsContent>
                <TabsContent value="ar" className="space-y-4 pt-4">
                  <FormField control={form.control} name="title_ar" render={({ field }) => (<FormItem><FormLabel>Title (AR)</FormLabel><FormControl><Input {...field} dir="rtl" /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="ingredients_ar" render={({ field }) => (<FormItem><FormLabel>Ingredients (AR)</FormLabel><FormControl><Textarea {...field} rows={5} dir="rtl" /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="preparation_steps_ar" render={({ field }) => (<FormItem><FormLabel>Preparation (AR)</FormLabel><FormControl><Textarea {...field} rows={7} dir="rtl" /></FormControl><FormMessage /></FormItem>)} />
                </TabsContent>
                <TabsContent value="fr" className="space-y-4 pt-4">
                  <FormField control={form.control} name="title_fr" render={({ field }) => (<FormItem><FormLabel>Title (FR)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="ingredients_fr" render={({ field }) => (<FormItem><FormLabel>Ingredients (FR)</FormLabel><FormControl><Textarea {...field} rows={5} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="preparation_steps_fr" render={({ field }) => (<FormItem><FormLabel>Preparation (FR)</FormLabel><FormControl><Textarea {...field} rows={7} /></FormControl><FormMessage /></FormItem>)} />
                </TabsContent>
              </Tabs>
              <div className="flex justify-end">
                <AnimatedButton type="submit" className="bg-dairy-blue text-white hover:bg-dairy-darkBlue" soundOnClick="/sounds/click.mp3" disabled={isSubmitting}>
                  {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : (currentRecipe ? 'Save Changes' : 'Add Recipe')}
                </AnimatedButton>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-[800px] bg-dairy-cream border-dairy-blue/20 shadow-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-dairy-darkBlue">{currentRecipe?.title_en || 'Recipe Preview'}</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-6">
            {currentRecipe?.image_url && <img src={currentRecipe.image_url} alt={currentRecipe.title_en} className="w-full h-64 object-cover rounded-md shadow-sm" />}
            <h3 className="font-bold">Ingredients</h3>
            <ul className="list-disc pl-5">{(currentRecipe?.ingredients_en || []).map((ing, i) => <li key={i}>{ing}</li>)}</ul>
            <h3 className="font-bold">Preparation</h3>
            <ol className="list-decimal pl-5">{(currentRecipe?.preparation_steps_en || []).map((step, i) => <li key={i}>{step}</li>)}</ol>
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setIsPreviewOpen(false)} className="bg-dairy-blue text-white hover:bg-dairy-darkBlue">Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default RecipesManagement;