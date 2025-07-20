import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion'; // <--- Added this import
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

interface SiteContent {
  id: string;
  section_name: string;
  content_data: {
    [key: string]: string; // Flexible for different content types
  };
}

const contentSchema = z.object({
  homepage_hero_title: z.string().min(1, { message: 'Title cannot be empty.' }),
  homepage_hero_subtitle: z.string().min(1, { message: 'Subtitle cannot be empty.' }),
  farm_info_section_title: z.string().min(1, { message: 'Farm Info Title (English) cannot be empty.' }),
  farm_info_section_subtitle: z.string().min(1, { message: 'Farm Info Subtitle (English) cannot be empty.' }),
  farm_info_section_title_ar: z.string().min(1, { message: 'Farm Info Title (Arabic) cannot be empty.' }),
  farm_info_section_subtitle_ar: z.string().min(1, { message: 'Farm Info Subtitle (Arabic) cannot be empty.' }),
  farm_info_section_title_fr: z.string().min(1, { message: 'Farm Info Title (French) cannot be empty.' }),
  farm_info_section_subtitle_fr: z.string().min(1, { message: 'Farm Info Subtitle (French) cannot be empty.' }),
});

const ContentManagement: React.FC = () => {
  const [siteContent, setSiteContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewContent, setPreviewContent] = useState<z.infer<typeof contentSchema> | null>(null);

  const form = useForm<z.infer<typeof contentSchema>>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      homepage_hero_title: '',
      homepage_hero_subtitle: '',
      farm_info_section_title: '',
      farm_info_section_subtitle: '',
      farm_info_section_title_ar: '',
      farm_info_section_subtitle_ar: '',
      farm_info_section_title_fr: '',
      farm_info_section_subtitle_fr: '',
    },
  });

  React.useEffect(() => {
    fetchSiteContent();
  }, []);

  const fetchSiteContent = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('site_content')
      .select('*')
      .eq('section_name', 'homepage_hero') // Fetch specific section
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
      toast.error('Failed to fetch site content', { description: error.message });
    } else if (data) {
      setSiteContent(data);
      // Merge fetched content data with default values to ensure all fields are present
      form.reset({
        ...form.getValues(), // Keep existing form values if any
        ...data.content_data,
      });
    }
    setLoading(false);
  };

  const onSubmit = async (values: z.infer<typeof contentSchema>) => {
    setIsSubmitting(true);
    try {
      const contentData = {
        section_name: 'homepage_hero', // Still using homepage_hero to store all homepage content
        content_data: values, // All form values are saved here
      };

      if (siteContent) {
        const { error } = await supabase
          .from('site_content')
          .update(contentData)
          .eq('id', siteContent.id);

        if (error) throw error;
        toast.success('Homepage content updated successfully!');
      } else {
        const { error } = await supabase
          .from('site_content')
          .insert([contentData]);

        if (error) throw error;
        toast.success('Homepage content added successfully!');
      }
      fetchSiteContent(); // Re-fetch to update state
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
        <Card className="bg-white border-dairy-blue/20 shadow-md">
          <CardHeader>
            <CardTitle className="text-dairy-darkBlue">Homepage Hero Section</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

                <CardTitle className="text-dairy-darkBlue mt-8">Farm Info Section</CardTitle>
                <FormField
                  control={form.control}
                  name="farm_info_section_title"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                      <FormLabel className="md:text-right text-dairy-text">Farm Info Title (English)</FormLabel>
                      <FormControl className="md:col-span-3">
                        <Input {...field} className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue" />
                      </FormControl>
                      <FormMessage className="md:col-span-4 md:col-start-2" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="farm_info_section_title_ar"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                      <FormLabel className="md:text-right text-dairy-text">Farm Info Title (Arabic)</FormLabel>
                      <FormControl className="md:col-span-3">
                        <Input {...field} className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue" />
                      </FormControl>
                      <FormMessage className="md:col-span-4 md:col-start-2" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="farm_info_section_title_fr"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                      <FormLabel className="md:text-right text-dairy-text">Farm Info Title (French)</FormLabel>
                      <FormControl className="md:col-span-3">
                        <Input {...field} className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue" />
                      </FormControl>
                      <FormMessage className="md:col-span-4 md:col-start-2" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="farm_info_section_subtitle"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-1 md:grid-cols-4 items-start gap-4">
                      <FormLabel className="md:text-right text-dairy-text">Farm Info Subtitle (English)</FormLabel>
                      <FormControl className="md:col-span-3">
                        <Textarea {...field} rows={3} className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue" />
                      </FormControl>
                      <FormMessage className="md:col-span-4 md:col-start-2" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="farm_info_section_subtitle_ar"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-1 md:grid-cols-4 items-start gap-4">
                      <FormLabel className="md:text-right text-dairy-text">Farm Info Subtitle (Arabic)</FormLabel>
                      <FormControl className="md:col-span-3">
                        <Textarea {...field} rows={3} className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue" />
                      </FormControl>
                      <FormMessage className="md:col-span-4 md:col-start-2" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="farm_info_section_subtitle_fr"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-1 md:grid-cols-4 items-start gap-4">
                      <FormLabel className="md:text-right text-dairy-text">Farm Info Subtitle (French)</FormLabel>
                      <FormControl className="md:col-span-3">
                        <Textarea {...field} rows={3} className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue" />
                      </FormControl>
                      <FormMessage className="md:col-span-4 md:col-start-2" />
                    </FormItem>
                  )}
                />

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
          </CardContent>
        </Card>
      )}

      {/* Live Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-[600px] bg-dairy-cream border-dairy-blue/20 shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-dairy-darkBlue">Content Preview</DialogTitle>
            <DialogDescription className="text-dairy-text">
              This is how the sections will look on your homepage.
            </DialogDescription>
          </DialogDescription>
          <div className="py-4 text-center space-y-4">
            <h3 className="text-2xl font-bold text-dairy-darkBlue">Homepage Hero Preview:</h3>
            <h2 className="text-4xl font-bold text-dairy-darkBlue">{previewContent?.homepage_hero_title}</h2>
            <p className="text-xl text-dairy-text">{previewContent?.homepage_hero_subtitle}</p>
            <hr className="my-6 border-dairy-blue/20" />
            <h3 className="text-2xl font-bold text-dairy-darkBlue">Farm Info Section Preview:</h3>
            <h2 className="text-4xl font-bold text-dairy-darkBlue">{previewContent?.farm_info_section_title}</h2>
            <p className="text-xl text-dairy-text">{previewContent?.farm_info_section_subtitle}</p>
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