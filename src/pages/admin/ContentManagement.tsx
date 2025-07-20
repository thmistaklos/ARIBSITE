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
          </DialogHeader>
          <div className="py-4 text-center space-y-4">
            <h3 className="text-2xl font-bold text-dairy-darkBlue">Homepage Hero Preview:</h3>
            <h2 className="text-4xl font-bold text-dairy-darkBlue">{previewContent?.homepage_hero_title}</h2>
            <p className="text-xl text-dairy-text">{previewContent?.homepage_hero_subtitle}</p>
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