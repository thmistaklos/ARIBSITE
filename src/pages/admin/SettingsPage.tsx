import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Loader2, Save, Upload } from 'lucide-react';
import AnimatedButton from '@/components/AnimatedButton';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'; // Import Form components

interface SiteSetting {
  id: string;
  setting_key: string;
  setting_value: string;
  type: 'text' | 'url' | 'color' | 'boolean';
}

const settingsSchema = z.object({
  site_logo_url: z.string().url().nullable().optional(),
  brand_primary_color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, { message: 'Invalid hex color code.' }).optional(),
  seo_title: z.string().min(1, { message: 'SEO Title cannot be empty.' }).optional(),
  seo_description: z.string().min(1, { message: 'SEO Description cannot be empty.' }).optional(),
  maintenance_mode: z.boolean().default(false),
});

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<Record<string, SiteSetting>>({});
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);

  const form = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      site_logo_url: null,
      brand_primary_color: '#2563EB', // Default example
      seo_title: '',
      seo_description: '',
      maintenance_mode: false,
    },
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('site_settings').select('*');

    if (error) {
      toast.error('Failed to fetch site settings', { description: error.message });
    } else {
      const fetchedSettings: Record<string, SiteSetting> = {};
      const formDefaults: Partial<z.infer<typeof settingsSchema>> = {};

      data.forEach(setting => {
        fetchedSettings[setting.setting_key] = setting;
        if (setting.type === 'boolean') {
          formDefaults[setting.setting_key as keyof typeof formDefaults] = setting.setting_value === 'true';
        } else {
          formDefaults[setting.setting_key as keyof typeof formDefaults] = setting.setting_value;
        }
      });
      setSettings(fetchedSettings);
      form.reset(formDefaults);
      setLogoPreviewUrl(fetchedSettings.site_logo_url?.setting_value || null);
    }
    setLoading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setLogoPreviewUrl(URL.createObjectURL(file));
    } else {
      setSelectedFile(null);
      setLogoPreviewUrl(settings.site_logo_url?.setting_value || null);
    }
  };

  const onSubmit = async (values: z.infer<typeof settingsSchema>) => {
    setIsSubmitting(true);
    let logoUrl = settings.site_logo_url?.setting_value || null;

    try {
      if (selectedFile) {
        const fileName = `${Date.now()}-${selectedFile.name}`;
        const filePath = `site-logos/${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('site-logos')
          .upload(filePath, selectedFile, {
            cacheControl: '3600',
            upsert: true, // Upsert to replace existing logo if same name
          });

        if (uploadError) {
          throw uploadError;
        }

        const { data: publicUrlData } = supabase.storage
          .from('site-logos')
          .getPublicUrl(filePath);

        logoUrl = publicUrlData.publicUrl;
      }

      const updates = [
        { key: 'site_logo_url', value: logoUrl, type: 'url' },
        { key: 'brand_primary_color', value: values.brand_primary_color, type: 'color' },
        { key: 'seo_title', value: values.seo_title, type: 'text' },
        { key: 'seo_description', value: values.seo_description, type: 'text' },
        { key: 'maintenance_mode', value: String(values.maintenance_mode), type: 'boolean' },
      ];

      for (const update of updates) {
        const existingSetting = settings[update.key];
        const settingData = {
          setting_key: update.key,
          setting_value: update.value,
          type: update.type,
        };

        if (existingSetting) {
          const { error } = await supabase
            .from('site_settings')
            .update(settingData)
            .eq('id', existingSetting.id);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('site_settings')
            .insert([settingData]);
          if (error) throw error;
        }
      }

      toast.success('Site settings updated successfully!');
      fetchSettings(); // Re-fetch to update state
    } catch (error: any) {
      toast.error('Failed to save settings', { description: error.message });
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
      <h1 className="text-3xl font-bold text-dairy-darkBlue">Site-Wide Settings</h1>
      <p className="text-dairy-text">Configure global settings for your website.</p>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-dairy-blue" />
        </div>
      ) : (
        <Card className="bg-white border-dairy-blue/20 shadow-md">
          <CardHeader>
            <CardTitle className="text-dairy-darkBlue">General Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}> {/* Wrapped the form with Form component */}
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                  <Label htmlFor="site_logo" className="md:text-right text-dairy-text">
                    Site Logo
                  </Label>
                  <div className="md:col-span-3 flex flex-col gap-2">
                    <Input
                      id="site_logo"
                      name="site_logo"
                      type="file"
                      onChange={handleFileChange}
                      className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue"
                      accept="image/*"
                    />
                    {logoPreviewUrl && (
                      <img src={logoPreviewUrl} alt="Site Logo Preview" className="w-24 h-24 object-contain rounded-md mt-2" />
                    )}
                    {!selectedFile && settings.site_logo_url?.setting_value && (
                      <p className="text-xs text-muted-foreground mt-1">Current logo will be used if no new file is selected.</p>
                    )}
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="brand_primary_color"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                      <FormLabel className="md:text-right text-dairy-text">Brand Primary Color (Hex)</FormLabel>
                      <FormControl className="md:col-span-3">
                        <Input {...field} className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue" />
                      </FormControl>
                      <FormMessage className="md:col-span-4 md:col-start-2" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="seo_title"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                      <FormLabel className="md:text-right text-dairy-text">SEO Title</FormLabel>
                      <FormControl className="md:col-span-3">
                        <Input {...field} className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue" />
                      </FormControl>
                      <FormMessage className="md:col-span-4 md:col-start-2" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="seo_description"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-1 md:grid-cols-4 items-start gap-4">
                      <FormLabel className="md:text-right text-dairy-text">SEO Description</FormLabel>
                      <FormControl className="md:col-span-3">
                        <Textarea {...field} rows={4} className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue" />
                      </FormControl>
                      <FormMessage className="md:col-span-4 md:col-start-2" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="maintenance_mode"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                      <FormLabel className="md:text-right text-dairy-text">Maintenance Mode</FormLabel>
                      <FormControl className="md:col-span-3">
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-dairy-blue data-[state=unchecked]:bg-gray-300"
                        />
                      </FormControl>
                      <FormMessage className="md:col-span-4 md:col-start-2" />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end">
                  <AnimatedButton type="submit" className="bg-dairy-blue text-white hover:bg-dairy-darkBlue" soundOnClick="/sounds/click.mp3" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" /> Save Settings
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
            <DialogTitle className="text-dairy-darkBlue">Homepage Hero Preview</DialogTitle>
            <DialogDescription className="text-dairy-text">
              This is how the hero section will look on your homepage.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 text-center space-y-4">
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

export default SettingsPage;