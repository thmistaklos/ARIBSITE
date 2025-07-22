import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, Save, Upload } from 'lucide-react';
import AnimatedButton from '@/components/AnimatedButton';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface HeroItem {
  id: string;
  order_index: number;
  title_en: string;
  title_ar: string;
  title_fr: string;
  subtitle_en: string;
  subtitle_ar: string;
  subtitle_fr: string;
  image_url: string;
}

const heroItemSchema = z.object({
  id: z.string(),
  order_index: z.number(),
  title_en: z.string().min(1, 'Title is required'),
  title_ar: z.string().min(1, 'Title is required'),
  title_fr: z.string().min(1, 'Title is required'),
  subtitle_en: z.string().min(1, 'Subtitle is required'),
  subtitle_ar: z.string().min(1, 'Subtitle is required'),
  subtitle_fr: z.string().min(1, 'Subtitle is required'),
  image_url: z.string().url('Must be a valid URL'),
});

const formSchema = z.object({
  heroItems: z.array(heroItemSchema),
});

const HeroCarouselManagement: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      heroItems: [],
    },
  });

  const { fields, replace } = useFieldArray({
    control: form.control,
    name: "heroItems",
  });

  useEffect(() => {
    fetchHeroItems();
  }, []);

  const fetchHeroItems = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('hero_carousel_items')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) {
      toast.error('Failed to fetch hero items', { description: error.message });
    } else if (data) {
      replace(data);
    }
    setLoading(false);
  };

  const handleFileUpload = async (file: File, index: number) => {
    if (!file) return;
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `hero-images/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('hero-images')
      .upload(filePath, file);

    if (uploadError) {
      toast.error('Image upload failed', { description: uploadError.message });
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from('hero-images')
      .getPublicUrl(filePath);
    
    form.setValue(`heroItems.${index}.image_url`, publicUrlData.publicUrl, { shouldValidate: true });
    toast.success('Image uploaded successfully!');
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      for (const item of values.heroItems) {
        const { id, ...updateData } = item;
        const { error } = await supabase
          .from('hero_carousel_items')
          .update(updateData)
          .eq('id', id);

        if (error) {
          throw new Error(`Failed to update slide ${item.order_index}: ${error.message}`);
        }
      }
      toast.success('Hero carousel content updated successfully!');
      fetchHeroItems();
    } catch (error: any) {
      toast.error('Failed to save content', { description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-dairy-blue" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="space-y-6"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-dairy-darkBlue">Hero Carousel Management</CardTitle>
          <CardDescription className="text-dairy-text">Update the content for the 5 slides in your homepage hero carousel.</CardDescription>
        </CardHeader>
      </Card>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
            {fields.map((field, index) => (
              <AccordionItem key={field.id} value={`item-${index}`}>
                <AccordionTrigger className="text-lg font-semibold text-dairy-darkBlue hover:no-underline bg-white p-4 rounded-t-lg border border-dairy-blue/20">
                  Slide {index + 1}
                </AccordionTrigger>
                <AccordionContent className="p-6 bg-white rounded-b-lg border border-t-0 border-dairy-blue/20">
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name={`heroItems.${index}.image_url`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Image URL</FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-dairy-cream/50 border-dairy-blue/30" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormItem>
                      <FormLabel>Or Upload New Image</FormLabel>
                      <div className="flex items-center gap-2">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => e.target.files && handleFileUpload(e.target.files[0], index)}
                          className="bg-dairy-cream/50 border-dairy-blue/30"
                        />
                      </div>
                      {form.watch(`heroItems.${index}.image_url`) && (
                        <img src={form.watch(`heroItems.${index}.image_url`)} alt={`Slide ${index + 1} preview`} className="w-48 h-auto mt-2 rounded-md object-cover" />
                      )}
                    </FormItem>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField control={form.control} name={`heroItems.${index}.title_en`} render={({ field }) => (<FormItem><FormLabel>Title (EN)</FormLabel><FormControl><Input {...field} className="bg-dairy-cream/50 border-dairy-blue/30" /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name={`heroItems.${index}.title_ar`} render={({ field }) => (<FormItem><FormLabel>Title (AR)</FormLabel><FormControl><Input {...field} className="bg-dairy-cream/50 border-dairy-blue/30" /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name={`heroItems.${index}.title_fr`} render={({ field }) => (<FormItem><FormLabel>Title (FR)</FormLabel><FormControl><Input {...field} className="bg-dairy-cream/50 border-dairy-blue/30" /></FormControl><FormMessage /></FormItem>)} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField control={form.control} name={`heroItems.${index}.subtitle_en`} render={({ field }) => (<FormItem><FormLabel>Subtitle (EN)</FormLabel><FormControl><Textarea {...field} className="bg-dairy-cream/50 border-dairy-blue/30" /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name={`heroItems.${index}.subtitle_ar`} render={({ field }) => (<FormItem><FormLabel>Subtitle (AR)</FormLabel><FormControl><Textarea {...field} className="bg-dairy-cream/50 border-dairy-blue/30" /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name={`heroItems.${index}.subtitle_fr`} render={({ field }) => (<FormItem><FormLabel>Subtitle (FR)</FormLabel><FormControl><Textarea {...field} className="bg-dairy-cream/50 border-dairy-blue/30" /></FormControl><FormMessage /></FormItem>)} />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="flex justify-end pt-4">
            <AnimatedButton type="submit" className="bg-dairy-blue text-white hover:bg-dairy-darkBlue" soundOnClick="/sounds/click.mp3" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" /> Save All Changes
                </>
              )}
            </AnimatedButton>
          </div>
        </form>
      </Form>
    </motion.div>
  );
};

export default HeroCarouselManagement;