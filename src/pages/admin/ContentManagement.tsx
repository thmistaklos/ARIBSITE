import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Loader2, Save, Eye } from 'lucide-react';
import AnimatedButton from '@/components/AnimatedButton';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const contentSchema = z.object({
  title_en: z.string().min(1, { message: 'Title (EN) is required.' }),
  title_ar: z.string().min(1, { message: 'Title (AR) is required.' }),
  title_fr: z.string().min(1, { message: 'Title (FR) is required.' }),
  subtitle_en: z.string().min(1, { message: 'Subtitle (EN) is required.' }),
  subtitle_ar: z.string().min(1, { message: 'Subtitle (AR) is required.' }),
  subtitle_fr: z.string().min(1, { message: 'Subtitle (FR) is required.' }),
  image_url: z.string().url({ message: 'Must be a valid URL.' }).nullable().optional().or(z.literal('')),
});

interface SiteContentRow {
  id: string;
  section_name: string;
  content_data: z.infer<typeof contentSchema>;
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
      title_en: '', title_ar: '', title_fr: '',
      subtitle_en: '', subtitle_ar: '', subtitle_fr: '',
      image_url: '',
    },
  });

  useEffect(() => {
    fetchSiteContent();
  }, []);

  const fetchSiteContent = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('site_content')
      .select('id, section_name, content_data')
      .eq('section_name', 'farm_info_content')
      .single();

    if (error && error.code !== 'PGRST116') {
      toast.error('Failed to fetch site content', { description: error.message });
    } else if (data) {
      setSiteContentRow(data);
      form.reset({ ...form.getValues(), ...data.content_data });
    }
    setLoading(false);
  };

  const onSubmit = async (values: z.infer<typeof contentSchema>) => {
    setIsSubmitting(true);
    try {
      const contentToSave = {
        section_name: 'farm_info_content',
        content_data: values,
      };

      if (siteContentRow) {
        const { error } = await supabase
          .from('site_content')
          .update(contentToSave)
          .eq('id', siteContentRow.id);
        if (error) throw error;
        toast.success('Farm Info content updated successfully!');
      } else {
        const { error } = await supabase
          .from('site_content')
          .insert([contentToSave]);
        if (error) throw error;
        toast.success('Farm Info content saved successfully!');
      }
      fetchSiteContent();
    } catch (error: any) {
      toast.error('Failed to save content', { description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreview = () => {
    setPreviewContent(form.getValues());
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
                <CardTitle className="text-dairy-darkBlue">Farm Info Section</CardTitle>
                <CardDescription>Update the title, subtitle, and image for the farm information section on the homepage.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Tabs defaultValue="en" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="en">English</TabsTrigger>
                    <TabsTrigger value="ar">Arabic</TabsTrigger>
                    <TabsTrigger value="fr">French</TabsTrigger>
                  </TabsList>
                  <TabsContent value="en" className="space-y-4 pt-4">
                    <FormField control={form.control} name="title_en" render={({ field }) => (<FormItem><FormLabel>Title (EN)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="subtitle_en" render={({ field }) => (<FormItem><FormLabel>Subtitle (EN)</FormLabel><FormControl><Textarea {...field} rows={4} /></FormControl><FormMessage /></FormItem>)} />
                  </TabsContent>
                  <TabsContent value="ar" className="space-y-4 pt-4">
                    <FormField control={form.control} name="title_ar" render={({ field }) => (<FormItem><FormLabel>Title (AR)</FormLabel><FormControl><Input {...field} dir="rtl" /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="subtitle_ar" render={({ field }) => (<FormItem><FormLabel>Subtitle (AR)</FormLabel><FormControl><Textarea {...field} rows={4} dir="rtl" /></FormControl><FormMessage /></FormItem>)} />
                  </TabsContent>
                  <TabsContent value="fr" className="space-y-4 pt-4">
                    <FormField control={form.control} name="title_fr" render={({ field }) => (<FormItem><FormLabel>Title (FR)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="subtitle_fr" render={({ field }) => (<FormItem><FormLabel>Subtitle (FR)</FormLabel><FormControl><Textarea {...field} rows={4} /></FormControl><FormMessage /></FormItem>)} />
                  </TabsContent>
                </Tabs>
                <hr className="my-4" />
                <FormField
                  control={form.control}
                  name="image_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/image.png" {...field} />
                      </FormControl>
                      <FormMessage />
                      {form.watch('image_url') && (
                        <img src={form.watch('image_url') || ''} alt="Preview" className="w-48 h-auto object-contain rounded-md mt-2" />
                      )}
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="flex justify-end space-x-2">
              <AnimatedButton type="button" onClick={handlePreview} variant="outline" className="text-dairy-blue border-dairy-blue hover:bg-dairy-blue hover:text-white" soundOnClick="/sounds/click.mp3">
                <Eye className="mr-2 h-4 w-4" /> Preview
              </AnimatedButton>
              <AnimatedButton type="submit" className="bg-dairy-blue text-white hover:bg-dairy-darkBlue" soundOnClick="/sounds/click.mp3" disabled={isSubmitting}>
                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : <><Save className="mr-2 h-4 w-4" /> Save Changes</>}
              </AnimatedButton>
            </div>
          </form>
        </Form>
      )}

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-[600px] bg-dairy-cream border-dairy-blue/20 shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-dairy-darkBlue">Farm Info Preview</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-center space-y-4">
            <h2 className="text-4xl font-bold text-dairy-darkBlue">{previewContent?.title_en}</h2>
            <p className="text-xl text-dairy-text">{previewContent?.subtitle_en}</p>
            {previewContent?.image_url && <img src={previewContent.image_url} alt="Preview" className="w-full h-auto object-contain rounded-md mt-4" />}
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