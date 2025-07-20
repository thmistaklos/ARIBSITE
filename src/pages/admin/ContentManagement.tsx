import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, Save, Eye } from 'lucide-react';
import AnimatedButton from '@/components/AnimatedButton';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

// Define the schema for the content stored in the 'value' jsonb column
const contentSchema = z.object({
  homepage_hero_title: z.string().min(1, { message: 'Title cannot be empty.' }),
  homepage_hero_subtitle: z.string().min(1, { message: 'Subtitle cannot be empty.' }),

  // Farm Info Section
  farm_section_title_en: z.string().min(1, { message: 'English title cannot be empty.' }),
  farm_section_title_ar: z.string().min(1, { message: 'Arabic title cannot be empty.' }),
  farm_section_title_fr: z.string().min(1, { message: 'French title cannot be empty.' }),
  farm_section_subtitle_en: z.string().min(1, { message: 'English subtitle cannot be empty.' }),
  farm_section_subtitle_ar: z.string().min(1, { message: 'Arabic subtitle cannot be empty.' }),
  farm_section_subtitle_fr: z.string().min(1, { message: 'French subtitle cannot be empty.' }),

  // Farm Facts
  farm_fact1_icon: z.string().min(1, { message: 'Icon name cannot be empty.' }),
  farm_fact1_title_en: z.string().min(1, { message: 'English title cannot be empty.' }),
  farm_fact1_description_en: z.string().min(1, { message: 'English description cannot be empty.' }),
  farm_fact1_title_ar: z.string().min(1, { message: 'Arabic title cannot be empty.' }),
  farm_fact1_description_ar: z.string().min(1, { message: 'Arabic description cannot be empty.' }),
  farm_fact1_title_fr: z.string().min(1, { message: 'French title cannot be empty.' }),
  farm_fact1_description_fr: z.string().min(1, { message: 'French description cannot be empty.' }),

  farm_fact2_icon: z.string().min(1, { message: 'Icon name cannot be empty.' }),
  farm_fact2_title_en: z.string().min(1, { message: 'English title cannot be empty.' }),
  farm_fact2_description_en: z.string().min(1, { message: 'English description cannot be empty.' }),
  farm_fact2_title_ar: z.string().min(1, { message: 'Arabic title cannot be empty.' }),
  farm_fact2_description_ar: z.string().min(1, { message: 'Arabic description cannot be empty.' }),
  farm_fact2_title_fr: z.string().min(1, { message: 'French title cannot be empty.' }),
  farm_fact2_description_fr: z.string().min(1, { message: 'French description cannot be empty.' }),

  farm_fact3_icon: z.string().min(1, { message: 'Icon name cannot be empty.' }),
  farm_fact3_title_en: z.string().min(1, { message: 'English title cannot be empty.' }),
  farm_fact3_description_en: z.string().min(1, { message: 'English description cannot be empty.' }),
  farm_fact3_title_ar: z.string().min(1, { message: 'Arabic title cannot be empty.' }),
  farm_fact3_description_ar: z.string().min(1, { message: 'Arabic description cannot be empty.' }),
  farm_fact3_title_fr: z.string().min(1, { message: 'French title cannot be empty.' }),
  farm_fact3_description_fr: z.string().min(1, { message: 'French description cannot be empty.' }),

  farm_fact4_icon: z.string().min(1, { message: 'Icon name cannot be empty.' }),
  farm_fact4_title_en: z.string().min(1, { message: 'English title cannot be empty.' }),
  farm_fact4_description_en: z.string().min(1, { message: 'English description cannot be empty.' }),
  farm_fact4_title_ar: z.string().min(1, { message: 'Arabic title cannot be empty.' }),
  farm_fact4_description_ar: z.string().min(1, { message: 'Arabic description cannot be empty.' }),
  farm_fact4_title_fr: z.string().min(1, { message: 'French title cannot be empty.' }),
  farm_fact4_description_fr: z.string().min(1, { message: 'French description cannot be empty.' }),
});

// Define the interface for the Supabase row
interface SiteContentRow {
  id: string;
  key: string;
  value: z.infer<typeof contentSchema>; // The content_data will be stored in the 'value' column
}

const ContentManagement: React.FC = () => {
  const [siteContentRow, setSiteContentRow] = useState<SiteContentRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewContent, setPreviewContent] = useState<z.infer<typeof contentSchema> | null>(null);

  const form = useForm<z.infer<typeof contentSchema>>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      homepage_hero_title: '',
      homepage_hero_subtitle: '',
      farm_section_title_en: 'From Our Farms to Your Table',
      farm_section_title_ar: 'من مزارعنا إلى مائدتك',
      farm_section_title_fr: 'De nos fermes à votre table',
      farm_section_subtitle_en: 'Discover the journey of our dairy products, from the lush green pastures to your home. We are committed to quality, freshness, and sustainable practices.',
      farm_section_subtitle_ar: 'اكتشف رحلة منتجات الألبان لدينا، من المراعي الخضراء المورقة إلى منزلك. نحن ملتزمون بالجودة والنضارة والممارسات المستدامة.',
      farm_section_subtitle_fr: 'Découvrez le parcours de nos produits laitiers, des pâturages verdoyants à votre domicile. Nous nous engageons pour la qualité, la fraîcheur et les pratiques durables.',
      farm_fact1_icon: 'Leaf',
      farm_fact1_title_en: 'Organic Farming',
      farm_fact1_description_en: 'Our cows graze on organic pastures, ensuring pure and natural milk.',
      farm_fact1_title_ar: 'زراعة عضوية',
      farm_fact1_description_ar: 'ترعى أبقارنا في مراعي عضوية، مما يضمن حليبًا نقيًا وطبيعيًا.',
      farm_fact1_title_fr: 'Agriculture Biologique',
      farm_fact1_description_fr: 'Nos vaches paissent dans des pâturages biologiques, garantissant un lait pur et naturel.',
      farm_fact2_icon: 'Award',
      farm_fact2_title_en: 'Award-Winning Dairy',
      farm_fact2_description_en: 'Recognized for excellence in taste and quality across the region.',
      farm_fact2_title_ar: 'ألبان حائزة على جوائز',
      farm_fact2_description_ar: 'معترف بها للتميز في الذوق والجودة في جميع أنحاء المنطقة.',
      farm_fact2_title_fr: 'Produits Laitiers Primés',
      farm_fact2_description_fr: 'Reconnus pour l\'excellence du goût et de la qualité dans toute la région.',
      farm_fact3_icon: 'Heart',
      farm_fact3_title_en: 'Healthy & Nutritious',
      farm_fact3_description_en: 'Packed with essential vitamins and minerals for a healthy lifestyle.',
      farm_fact3_title_ar: 'صحي ومغذي',
      farm_fact3_description_ar: 'مليء بالفيتامينات والمعادن الأساسية لنمط حياة صحي.',
      farm_fact3_title_fr: 'Sain et Nutritif',
      farm_fact3_description_fr: 'Riche en vitamines et minéraux essentiels pour un mode de vie sain.',
      farm_fact4_icon: 'Droplet', // Changed from Leaf to Droplet for variety
      farm_fact4_title_en: 'Pure Water Source',
      farm_fact4_description_en: 'Our farms utilize pristine natural water sources for irrigation and livestock.',
      farm_fact4_title_ar: 'مصدر مياه نقي',
      farm_fact4_description_ar: 'تستخدم مزارعنا مصادر مياه طبيعية نقية للري والماشية.',
      farm_fact4_title_fr: 'Source d\'Eau Pure',
      farm_fact4_description_fr: 'Nos fermes utilisent des sources d\'eau naturelles pures pour l\'irrigation et le bétail.',
    },
  });

  React.useEffect(() => {
    fetchSiteContent();
  }, []);

  const fetchSiteContent = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('site_content')
      .select('id, key, value') // Select all columns as per new schema
      .eq('key', 'homepage_content') // Query by the specific key for homepage content
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
      toast.error('Failed to fetch site content', { description: error.message });
      setSiteContentRow(null);
    } else if (data) {
      setSiteContentRow(data); // Store the full row data
      form.reset(data.value); // Reset form with the 'value' (jsonb) content
    } else {
      // If no row found, initialize with default values
      setSiteContentRow(null);
      form.reset(form.defaultValues); // Reset to default form values
    }
    setLoading(false);
  };

  const onSubmit = async (values: z.infer<typeof contentSchema>) => {
    setIsSubmitting(true);
    try {
      const contentToSave = {
        key: 'homepage_content', // The fixed key for homepage content
        value: values, // The entire form values object goes into the 'value' jsonb column
      };

      if (siteContentRow) { // If an existing row was fetched
        const { error } = await supabase
          .from('site_content')
          .update(contentToSave)
          .eq('id', siteContentRow.id); // Update by ID

        if (error) throw error;
        toast.success('Homepage content updated successfully!');
      } else { // If no existing row, insert a new one
        const { error } = await supabase
          .from('site_content')
          .insert([contentToSave]);

        if (error) throw error;
        toast.success('Homepage content added successfully!');
      }
      fetchSiteContent(); // Re-fetch to update state and form
    } catch (error: any) {
      toast.error('Failed to save content', { description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreview = () => {
    const currentValues = form.getValues();
    setPreviewContent(currentValues);
    setIsPreviewOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="space-y-6"
    >
      <h1 className="text-3xl font-bold text-dairy-darkBlue">Website Content Management</h1>
      <p className="text-dairy-text">Update dynamic content sections of your website.</p>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-dairy-blue" />
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card className="bg-white border-dairy-blue/20 shadow-md">
              <CardHeader>
                <CardTitle className="text-dairy-darkBlue">Homepage Hero Section</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="homepage_hero_title"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                      <FormLabel className="md:text-right text-dairy-text">Hero Title</FormLabel>
                      <FormControl className="md:col-span-3">
                        <Input {...field} className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue" />
                      </FormControl>
                      <FormMessage className="md:col-span-4 md:col-start-2" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="homepage_hero_subtitle"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-1 md:grid-cols-4 items-start gap-4">
                      <FormLabel className="md:text-right text-dairy-text">Hero Subtitle</FormLabel>
                      <FormControl className="md:col-span-3">
                        <Textarea {...field} rows={3} className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue" />
                      </FormControl>
                      <FormMessage className="md:col-span-4 md:col-start-2" />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card className="bg-white border-dairy-blue/20 shadow-md">
              <CardHeader>
                <CardTitle className="text-dairy-darkBlue">Farm Info Section</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="farm_section_title_en"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                      <FormLabel className="md:text-right text-dairy-text">Title (English)</FormLabel>
                      <FormControl className="md:col-span-3">
                        <Input {...field} className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue" />
                      </FormControl>
                      <FormMessage className="md:col-span-4 md:col-start-2" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="farm_section_title_ar"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                      <FormLabel className="md:text-right text-dairy-text">Title (Arabic)</FormLabel>
                      <FormControl className="md:col-span-3">
                        <Input {...field} className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue" />
                      </FormControl>
                      <FormMessage className="md:col-span-4 md:col-start-2" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="farm_section_title_fr"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                      <FormLabel className="md:text-right text-dairy-text">Title (French)</FormLabel>
                      <FormControl className="md:col-span-3">
                        <Input {...field} className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue" />
                      </FormControl>
                      <FormMessage className="md:col-span-4 md:col-start-2" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="farm_section_subtitle_en"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-1 md:grid-cols-4 items-start gap-4">
                      <FormLabel className="md:text-right text-dairy-text">Subtitle (English)</FormLabel>
                      <FormControl className="md:col-span-3">
                        <Textarea {...field} rows={3} className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue" />
                      </FormControl>
                      <FormMessage className="md:col-span-4 md:col-start-2" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="farm_section_subtitle_ar"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-1 md:grid-cols-4 items-start gap-4">
                      <FormLabel className="md:text-right text-dairy-text">Subtitle (Arabic)</FormLabel>
                      <FormControl className="md:col-span-3">
                        <Textarea {...field} rows={3} className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue" />
                      </FormControl>
                      <FormMessage className="md:col-span-4 md:col-start-2" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="farm_section_subtitle_fr"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-1 md:grid-cols-4 items-start gap-4">
                      <FormLabel className="md:text-right text-dairy-text">Subtitle (French)</FormLabel>
                      <FormControl className="md:col-span-3">
                        <Textarea {...field} rows={3} className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue" />
                      </FormControl>
                      <FormMessage className="md:col-span-4 md:col-start-2" />
                    </FormItem>
                  )}
                />

                {/* Fact 1 */}
                <h3 className="text-xl font-semibold text-dairy-darkBlue mt-6">Fact Item 1</h3>
                <FormField
                  control={form.control}
                  name="farm_fact1_icon"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                      <FormLabel className="md:text-right text-dairy-text">Icon Name</FormLabel>
                      <FormControl className="md:col-span-3">
                        <Input {...field} placeholder="e.g., Leaf, Award, Heart, Droplet" className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue" />
                      </FormControl>
                      <FormMessage className="md:col-span-4 md:col-start-2" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="farm_fact1_title_en"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                      <FormLabel className="md:text-right text-dairy-text">Title (English)</FormLabel>
                      <FormControl className="md:col-span-3">
                        <Input {...field} className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue" />
                      </FormControl>
                      <FormMessage className="md:col-span-4 md:col-start-2" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="farm_fact1_description_en"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-1 md:grid-cols-4 items-start gap-4">
                      <FormLabel className="md:text-right text-dairy-text">Description (English)</FormLabel>
                      <FormControl className="md:col-span-3">
                        <Textarea {...field} rows={2} className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue" />
                      </FormControl>
                      <FormMessage className="md:col-span-4 md:col-start-2" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="farm_fact1_title_ar"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                      <FormLabel className="md:text-right text-dairy-text">Title (Arabic)</FormLabel>
                      <FormControl className="md:col-span-3">
                        <Input {...field} className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue" />
                      </FormControl>
                      <FormMessage className="md:col-span-4 md:col-start-2" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="farm_fact1_description_ar"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-1 md:grid-cols-4 items-start gap-4">
                      <FormLabel className="md:text-right text-dairy-text">Description (Arabic)</FormLabel>
                      <FormControl className="md:col-span-3">
                        <Textarea {...field} rows={2} className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue" />
                      </FormControl>
                      <FormMessage className="md:col-span-4 md:col-start-2" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="farm_fact1_title_fr"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                      <FormLabel className="md:text-right text-dairy-text">Title (French)</FormLabel>
                      <FormControl className="md:col-span-3">
                        <Input {...field} className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue" />
                      </FormControl>
                      <FormMessage className="md:col-span-4 md:col-start-2" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="farm_fact1_description_fr"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-1 md:grid-cols-4 items-start gap-4">
                      <FormLabel className="md:text-right text-dairy-text">Description (French)</FormLabel>
                      <FormControl className="md:col-span-3">
                        <Textarea {...field} rows={2} className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue" />
                      </FormControl>
                      <FormMessage className="md:col-span-4 md:col-start-2" />
                    </FormItem>
                  )}
                />

                {/* Fact 2 */}
                <h3 className="text-xl font-semibold text-dairy-darkBlue mt-6">Fact Item 2</h3>
                <FormField
                  control={form.control}
                  name="farm_fact2_icon"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                      <FormLabel className="md:text-right text-dairy-text">Icon Name</FormLabel>
                      <FormControl className="md:col-span-3">
                        <Input {...field} placeholder="e.g., Leaf, Award, Heart, Droplet" className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue" />
                      </FormControl>
                      <FormMessage className="md:col-span-4 md:col-start-2" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="farm_fact2_title_en"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                      <FormLabel className="md:text-right text-dairy-text">Title (English)</FormLabel>
                      <FormControl className="md:col-span-3">
                        <Input {...field} className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue" />
                      </FormControl>
                      <FormMessage className="md:col-span-4 md:col-start-2" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="farm_fact2_description_en"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-1 md:grid-cols-4 items-start gap-4">
                      <FormLabel className="md:text-right text-dairy-text">Description (English)</FormLabel>
                      <FormControl className="md:col-span-3">
                        <Textarea {...field} rows={2} className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue" />
                      </FormControl>
                      <FormMessage className="md:col-span-4 md:col-start-2" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="farm_fact2_title_ar"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                      <FormLabel className="md:text-right text-dairy-text">Title (Arabic)</FormLabel>
                      <FormControl className="md:col-span-3">
                        <Input {...field} className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue" />
                      </FormControl>
                      <FormMessage className="md:col-span-4 md:col-start-2" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="farm_fact2_description_ar"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-1 md:grid-cols-4 items-start gap-4">
                      <FormLabel className="md:text-right text-dairy-text">Description (Arabic)</FormLabel>
                      <FormControl className="md:col-span-3">
                        <Textarea {...field} rows={2} className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue" />
                      </FormControl>
                      <FormMessage className="md:col-span-4 md:col-start-2" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="farm_fact2_title_fr"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                      <FormLabel className="md:text-right text-dairy-text">Title (French)</FormLabel>
                      <FormControl className="md:col-span-3">
                        <Input {...field} className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue" />
                      </FormControl>
                      <FormMessage className="md:col-span-4 md:col-start-2" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="farm_fact2_description_fr"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-1 md:grid-cols-4 items-start gap-4">
                      <FormLabel className="md:text-right text-dairy-text">Description (French)</FormLabel>
                      <FormControl className="md:col-span-3">
                        <Textarea {...field} rows={2} className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue" />
                      </FormControl>
                      <FormMessage className="md:col-span-4 md:col-start-2" />
                    </FormItem>
                  )}
                />

                {/* Fact 3 */}
                <h3 className="text-xl font-semibold text-dairy-darkBlue mt-6">Fact Item 3</h3>
                <FormField
                  control={form.control}
                  name="farm_fact3_icon"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                      <FormLabel className="md:text-right text-dairy-text">Icon Name</FormLabel>
                      <FormControl className="md:col-span-3">
                        <Input {...field} placeholder="e.g., Leaf, Award, Heart, Droplet" className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue" />
                      </FormControl>
                      <FormMessage className="md:col-span-4 md:col-start-2" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="farm_fact3_title_en"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                      <FormLabel className="md:text-right text-dairy-text">Title (English)</FormLabel>
                      <FormControl className="md:col-span-3">
                        <Input {...field} className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue" />
                      </FormControl>
                      <FormMessage className="md:col-span-4 md:col-start-2" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="farm_fact3_description_en"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-1 md:grid-cols-4 items-start gap-4">
                      <FormLabel className="md:text-right text-dairy-text">Description (English)</FormLabel>
                      <FormControl className="md:col-span-3">
                        <Textarea {...field} rows={2} className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue" />
                      </FormControl>
                      <FormMessage className="md:col-span-4 md:col-start-2" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="farm_fact3_title_ar"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                      <FormLabel className="md:text-right text-dairy-text">Title (Arabic)</FormLabel>
                      <FormControl className="md:col-span-3">
                        <Input {...field} className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue" />
                      </FormControl>
                      <FormMessage className="md:col-span-4 md:col-start-2" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="farm_fact3_description_ar"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-1 md:grid-cols-4 items-start gap-4">
                      <FormLabel className="md:text-right text-dairy-text">Description (Arabic)</FormLabel>
                      <FormControl className="md:col-span-3">
                        <Textarea {...field} rows={2} className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue" />
                      </FormControl>
                      <FormMessage className="md:col-span-4 md:col-start-2" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="farm_fact3_title_fr"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                      <FormLabel className="md:text-right text-dairy-text">Title (French)</FormLabel>
                      <FormControl className="md:col-span-3">
                        <Input {...field} className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue" />
                      </FormControl>
                      <FormMessage className="md:col-span-4 md:col-start-2" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="farm_fact3_description_fr"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-1 md:grid-cols-4 items-start gap-4">
                      <FormLabel className="md:text-right text-dairy-text">Description (French)</FormLabel>
                      <FormControl className="md:col-span-3">
                        <Textarea {...field} rows={2} className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue" />
                      </FormControl>
                      <FormMessage className="md:col-span-4 md:col-start-2" />
                    </FormItem>
                  )}
                />

                {/* Fact 4 */}
                <h3 className="text-xl font-semibold text-dairy-darkBlue mt-6">Fact Item 4</h3>
                <FormField
                  control={form.control}
                  name="farm_fact4_icon"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                      <FormLabel className="md:text-right text-dairy-text">Icon Name</FormLabel>
                      <FormControl className="md:col-span-3">
                        <Input {...field} placeholder="e.g., Leaf, Award, Heart, Droplet" className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue" />
                      </FormControl>
                      <FormMessage className="md:col-span-4 md:col-start-2" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="farm_fact4_title_en"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                      <FormLabel className="md:text-right text-dairy-text">Title (English)</FormLabel>
                      <FormControl className="md:col-span-3">
                        <Input {...field} className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue" />
                      </FormControl>
                      <FormMessage className="md:col-span-4 md:col-start-2" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="farm_fact4_description_en"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-1 md:grid-cols-4 items-start gap-4">
                      <FormLabel className="md:text-right text-dairy-text">Description (English)</FormLabel>
                      <FormControl className="md:col-span-3">
                        <Textarea {...field} rows={2} className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue" />
                      </FormControl>
                      <FormMessage className="md:col-span-4 md:col-start-2" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="farm_fact4_title_ar"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                      <FormLabel className="md:text-right text-dairy-text">Title (Arabic)</FormLabel>
                      <FormControl className="md:col-span-3">
                        <Input {...field} className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue" />
                      </FormControl>
                      <FormMessage className="md:col-span-4 md:col-start-2" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="farm_fact4_description_ar"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-1 md:grid-cols-4 items-start gap-4">
                      <FormLabel className="md:text-right text-dairy-text">Description (Arabic)</FormLabel>
                      <FormControl className="md:col-span-3">
                        <Textarea {...field} rows={2} className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue" />
                      </FormControl>
                      <FormMessage className="md:col-span-4 md:col-start-2" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="farm_fact4_title_fr"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                      <FormLabel className="md:text-right text-dairy-text">Title (French)</FormLabel>
                      <FormControl className="md:col-span-3">
                        <Input {...field} className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue" />
                      </FormControl>
                      <FormMessage className="md:col-span-4 md:col-start-2" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="farm_fact4_description_fr"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-1 md:grid-cols-4 items-start gap-4">
                      <FormLabel className="md:text-right text-dairy-text">Description (French)</FormLabel>
                      <FormControl className="md:col-span-3">
                        <Textarea {...field} rows={2} className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue" />
                      </FormControl>
                      <FormMessage className="md:col-span-4 md:col-start-2" />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="flex justify-end space-x-2">
              <AnimatedButton
                type="button"
                onClick={handlePreview}
                variant="outline"
                className="text-dairy-blue border-dairy-blue hover:bg-dairy-blue hover:text-white"
                soundOnClick="/sounds/click.mp3"
              >
                <Eye className="mr-2 h-4 w-4" /> Live Preview
              </AnimatedButton>
              <AnimatedButton type="submit" className="bg-dairy-blue text-white hover:bg-dairy-darkBlue" soundOnClick="/sounds/click.mp3" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" /> Save Changes
                  </>
                )}
              </AnimatedButton>
            </div>
          </form>
        </Form>
      )}

      {/* Live Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-[600px] bg-dairy-cream border-dairy-blue/20 shadow-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-dairy-darkBlue">Content Preview</DialogTitle>
            <DialogDescription className="text-dairy-text">
              This is how the sections will look on your homepage.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 text-center space-y-4">
            <h3 className="text-2xl font-bold text-dairy-darkBlue">Homepage Hero Preview:</h3>
            <h2 className="text-4xl font-bold text-dairy-darkBlue">{previewContent?.homepage_hero_title}</h2>
            <p className="text-xl text-dairy-text">{previewContent?.homepage_hero_subtitle}</p>

            <h3 className="text-2xl font-bold text-dairy-darkBlue mt-8">Farm Info Section Preview:</h3>
            <h2 className="text-3xl font-bold text-dairy-darkBlue">{previewContent?.farm_section_title_en}</h2>
            <p className="text-lg text-dairy-text">{previewContent?.farm_section_subtitle_en}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              {previewContent?.farm_fact1_title_en && (
                <div className="p-2 border rounded-md">
                  <p className="font-semibold">{previewContent.farm_fact1_title_en}</p>
                  <p className="text-sm">{previewContent.farm_fact1_description_en}</p>
                </div>
              )}
              {previewContent?.farm_fact2_title_en && (
                <div className="p-2 border rounded-md">
                  <p className="font-semibold">{previewContent.farm_fact2_title_en}</p>
                  <p className="text-sm">{previewContent.farm_fact2_description_en}</p>
                </div>
              )}
              {previewContent?.farm_fact3_title_en && (
                <div className="p-2 border rounded-md">
                  <p className="font-semibold">{previewContent.farm_fact3_title_en}</p>
                  <p className="text-sm">{previewContent.farm_fact3_description_en}</p>
                </div>
              )}
              {previewContent?.farm_fact4_title_en && (
                <div className="p-2 border rounded-md">
                  <p className="font-semibold">{previewContent.farm_fact4_title_en}</p>
                  <p className="text-sm">{previewContent.farm_fact4_description_en}</p>
                </div>
              )}
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

export default ContentManagement;