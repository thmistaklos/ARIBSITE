import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, Save, Upload, PlusCircle, Trash2, Image as ImageIcon, Text, AlignLeft, List } from 'lucide-react';
import AnimatedButton from '@/components/AnimatedButton';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { LucideIcons } from '@/utils/lucide-icons'; // Import the icon map

// Define schema for a single feature item
const featureItemSchema = z.object({
  icon_name: z.string().min(1, { message: 'Icon name cannot be empty.' }),
  title_en: z.string().min(1, { message: 'English title cannot be empty.' }),
  title_ar: z.string().min(1, { message: 'Arabic title cannot be empty.' }),
  title_fr: z.string().min(1, { message: 'French title cannot be empty.' }),
  description_en: z.string().min(1, { message: 'English description cannot be empty.' }),
  description_ar: z.string().min(1, { message: 'Arabic description cannot be empty.' }),
  description_fr: z.string().min(1, { message: 'French description cannot be empty.' }),
});

// Define the main schema for the banner content
const bannerContentSchema = z.object({
  banner_image_url: z.string().url({ message: 'Must be a valid URL or empty.' }).nullable().optional().or(z.literal('')),
  main_title_en: z.string().min(1, { message: 'English title cannot be empty.' }),
  main_title_ar: z.string().min(1, { message: 'Arabic title cannot be empty.' }),
  main_title_fr: z.string().min(1, { message: 'French title cannot be empty.' }),
  main_paragraph_en: z.string().min(1, { message: 'English paragraph cannot be empty.' }),
  main_paragraph_ar: z.string().min(1, { message: 'Arabic paragraph cannot be empty.' }),
  main_paragraph_fr: z.string().min(1, { message: 'French paragraph cannot be empty.' }),
  feature_items: z.array(featureItemSchema).max(4, { message: 'You can add a maximum of 4 feature items.' }),
});

interface BannerContent {
  id: string;
  banner_image_url: string | null;
  main_title_en: string;
  main_title_ar: string;
  main_title_fr: string;
  main_paragraph_en: string;
  main_paragraph_ar: string;
  main_paragraph_fr: string;
  feature_items: Array<{
    icon_name: string;
    title_en: string;
    title_ar: string;
    title_fr: string;
    description_en: string;
    description_ar: string;
    description_fr: string;
  }>;
}

const BannerManagement: React.FC = () => {
  const [bannerData, setBannerData] = useState<BannerContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  const form = useForm<z.infer<typeof bannerContentSchema>>({
    resolver: zodResolver(bannerContentSchema),
    defaultValues: {
      banner_image_url: '',
      main_title_en: '',
      main_title_ar: '',
      main_title_fr: '',
      main_paragraph_en: '',
      main_paragraph_ar: '',
      main_paragraph_fr: '',
      feature_items: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'feature_items',
  });

  useEffect(() => {
    fetchBannerContent();
  }, []);

  const fetchBannerContent = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('banner_content')
      .select('*')
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
      toast.error('Failed to fetch banner content', { description: error.message });
      setBannerData(null);
    } else if (data) {
      setBannerData(data);
      form.reset({
        ...data,
        banner_image_url: data.banner_image_url || '', // Ensure empty string for input
      });
      setImagePreviewUrl(data.banner_image_url);
    } else {
      setBannerData(null);
      form.reset(form.defaultValues);
      setImagePreviewUrl(null);
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
      setImagePreviewUrl(bannerData?.banner_image_url || null);
    }
  };

  const onSubmit = async (values: z.infer<typeof bannerContentSchema>) => {
    setIsSubmitting(true);
    let imageUrl = bannerData?.banner_image_url || null;

    try {
      if (selectedFile) {
        const fileName = `${Date.now()}-${selectedFile.name}`;
        const filePath = `banner-images/${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('site-assets') // Using a generic bucket for site assets
          .upload(filePath, selectedFile, {
            cacheControl: '3600',
            upsert: true,
          });

        if (uploadError) {
          throw uploadError;
        }

        const { data: publicUrlData } = supabase.storage
          .from('site-assets')
          .getPublicUrl(filePath);

        imageUrl = publicUrlData.publicUrl;
      } else if (values.banner_image_url === '') {
        imageUrl = null; // If user clears the URL input
      } else {
        imageUrl = values.banner_image_url; // Use the URL from the input if no new file
      }

      const contentToSave = {
        banner_image_url: imageUrl,
        main_title_en: values.main_title_en,
        main_title_ar: values.main_title_ar,
        main_title_fr: values.main_title_fr,
        main_paragraph_en: values.main_paragraph_en,
        main_paragraph_ar: values.main_paragraph_ar,
        main_paragraph_fr: values.main_paragraph_fr,
        feature_items: values.feature_items,
      };

      if (bannerData) {
        const { error } = await supabase
          .from('banner_content')
          .update(contentToSave)
          .eq('id', bannerData.id);

        if (error) {
          throw error;
        }
        toast.success('Banner content updated successfully!');
      } else {
        const { error } = await supabase
          .from('banner_content')
          .insert([contentToSave]);

        if (error) {
          throw error;
        }
        toast.success('Banner content added successfully!');
      }
      fetchBannerContent();
    } catch (error: any) {
      toast.error('Failed to save banner content', { description: error.message });
    } finally {
      setIsSubmitting(false);
      setSelectedFile(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="space-y-6"
    >
      <h1 className="text-3xl font-bold text-dairy-darkBlue">Banner Management</h1>
      <p className="text-dairy-text">Manage the main banner content and features on your homepage.</p>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-dairy-blue" />
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card className="bg-white border-dairy-blue/20 shadow-md">
              <CardHeader>
                <CardTitle className="text-dairy-darkBlue">Main Banner Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                  <Label htmlFor="banner_image" className="md:text-right text-dairy-text">
                    Banner Image
                  </Label>
                  <div className="md:col-span-3 flex flex-col gap-2">
                    <Input
                      id="banner_image"
                      name="banner_image"
                      type="file"
                      onChange={handleFileChange}
                      className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue"
                      accept="image/*"
                    />
                    <FormField
                      control={form.control}
                      name="banner_image_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-dairy-text">Or Image URL</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Paste image URL here"
                              {...field}
                              className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {imagePreviewUrl && (
                      <img src={imagePreviewUrl} alt="Banner Image Preview" className="w-48 h-auto object-contain rounded-md mt-2" />
                    )}
                    {!selectedFile && bannerData?.banner_image_url && (
                      <p className="text-xs text-muted-foreground mt-1">Current image will be used if no new file or URL is provided.</p>
                    )}
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="main_title_en"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                      <FormLabel className="md:text-right text-dairy-text">Main Title (English)</FormLabel>
                      <FormControl className="md:col-span-3">
                        <Input {...field} className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue" />
                      </FormControl>
                      <FormMessage className="md:col-span-4 md:col-start-2" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="main_title_ar"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                      <FormLabel className="md:text-right text-dairy-text">Main Title (Arabic)</FormLabel>
                      <FormControl className="md:col-span-3">
                        <Input {...field} className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue" />
                      </FormControl>
                      <FormMessage className="md:col-span-4 md:col-start-2" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="main_title_fr"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                      <FormLabel className="md:text-right text-dairy-text">Main Title (French)</FormLabel>
                      <FormControl className="md:col-span-3">
                        <Input {...field} className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue" />
                      </FormControl>
                      <FormMessage className="md:col-span-4 md:col-start-2" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="main_paragraph_en"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-1 md:grid-cols-4 items-start gap-4">
                      <FormLabel className="md:text-right text-dairy-text">Main Paragraph (English)</FormLabel>
                      <FormControl className="md:col-span-3">
                        <Textarea {...field} rows={4} className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue" />
                      </FormControl>
                      <FormMessage className="md:col-span-4 md:col-start-2" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="main_paragraph_ar"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-1 md:grid-cols-4 items-start gap-4">
                      <FormLabel className="md:text-right text-dairy-text">Main Paragraph (Arabic)</FormLabel>
                      <FormControl className="md:col-span-3">
                        <Textarea {...field} rows={4} className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue" />
                      </FormControl>
                      <FormMessage className="md:col-span-4 md:col-start-2" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="main_paragraph_fr"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-1 md:grid-cols-4 items-start gap-4">
                      <FormLabel className="md:text-right text-dairy-text">Main Paragraph (French)</FormLabel>
                      <FormControl className="md:col-span-3">
                        <Textarea {...field} rows={4} className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue" />
                      </FormControl>
                      <FormMessage className="md:col-span-4 md:col-start-2" />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card className="bg-white border-dairy-blue/20 shadow-md">
              <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle className="text-dairy-darkBlue">Feature Items (Max 4)</CardTitle>
                {fields.length < 4 && (
                  <AnimatedButton
                    type="button"
                    onClick={() => append({
                      icon_name: '',
                      title_en: '', title_ar: '', title_fr: '',
                      description_en: '', description_ar: '', description_fr: '',
                    })}
                    className="bg-dairy-blue text-white hover:bg-dairy-darkBlue"
                    soundOnClick="/sounds/click.mp3"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Feature
                  </AnimatedButton>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                {fields.length === 0 && (
                  <p className="text-center text-dairy-text">No feature items added yet.</p>
                )}
                {fields.map((item, index) => (
                  <div key={item.id} className="border border-dairy-blue/10 p-4 rounded-md space-y-4 relative">
                    <h3 className="text-lg font-semibold text-dairy-darkBlue mb-2">Feature #{index + 1}</h3>
                    <AnimatedButton
                      type="button"
                      onClick={() => remove(index)}
                      variant="destructive"
                      size="sm"
                      className="absolute top-4 right-4"
                      soundOnClick="/sounds/click.mp3"
                    >
                      <Trash2 className="h-4 w-4" />
                    </AnimatedButton>

                    <FormField
                      control={form.control}
                      name={`feature_items.${index}.icon_name`}
                      render={({ field }) => (
                        <FormItem className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                          <FormLabel className="md:text-right text-dairy-text">Icon Name (Lucide)</FormLabel>
                          <FormControl className="md:col-span-3">
                            <Input placeholder="e.g., Leaf, Award, Heart" {...field} className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue" />
                          </FormControl>
                          <FormMessage className="md:col-span-4 md:col-start-2" />
                          {field.value && LucideIcons[field.value] && (
                            <div className="md:col-span-4 md:col-start-2 flex items-center gap-2 text-sm text-muted-foreground">
                              <LucideIcons[field.value] className="h-5 w-5 text-dairy-blue" /> Preview
                            </div>
                          )}
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`feature_items.${index}.title_en`}
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
                      name={`feature_items.${index}.title_ar`}
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
                      name={`feature_items.${index}.title_fr`}
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
                      name={`feature_items.${index}.description_en`}
                      render={({ field }) => (
                        <FormItem className="grid grid-cols-1 md:grid-cols-4 items-start gap-4">
                          <FormLabel className="md:text-right text-dairy-text">Description (English)</FormLabel>
                          <FormControl className="md:col-span-3">
                            <Textarea {...field} rows={3} className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue" />
                          </FormControl>
                          <FormMessage className="md:col-span-4 md:col-start-2" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`feature_items.${index}.description_ar`}
                      render={({ field }) => (
                        <FormItem className="grid grid-cols-1 md:grid-cols-4 items-start gap-4">
                          <FormLabel className="md:text-right text-dairy-text">Description (Arabic)</FormLabel>
                          <FormControl className="md:col-span-3">
                            <Textarea {...field} rows={3} className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue" />
                          </FormControl>
                          <FormMessage className="md:col-span-4 md:col-start-2" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`feature_items.${index}.description_fr`}
                      render={({ field }) => (
                        <FormItem className="grid grid-cols-1 md:grid-cols-4 items-start gap-4">
                          <FormLabel className="md:text-right text-dairy-text">Description (French)</FormLabel>
                          <FormControl className="md:col-span-3">
                            <Textarea {...field} rows={3} className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue" />
                          </FormControl>
                          <FormMessage className="md:col-span-4 md:col-start-2" />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <AnimatedButton type="submit" className="bg-dairy-blue text-white hover:bg-dairy-darkBlue" soundOnClick="/sounds/click.mp3" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" /> Save Banner Content
                  </>
                )}
              </AnimatedButton>
            </div>
          </form>
        </Form>
      )}
    </motion.div>
  );
};

export default BannerManagement;