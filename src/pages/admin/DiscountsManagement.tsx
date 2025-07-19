import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { PlusCircle, Edit, Trash2, Loader2, Eye, ToggleLeft, ToggleRight } from 'lucide-react';
import AnimatedButton from '@/components/AnimatedButton';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

interface Discount {
  id: string;
  title_en: string;
  title_ar: string;
  title_fr: string;
  subtitle_en: string;
  subtitle_ar: string;
  subtitle_fr: string;
  price_text_en: string;
  price_text_ar: string;
  price_text_fr: string;
  image_url: string | null;
  link_url: string | null;
  is_active: boolean;
  created_at: string;
}

const discountSchema = z.object({
  title_en: z.string().min(1, { message: 'English title cannot be empty.' }),
  title_ar: z.string().min(1, { message: 'Arabic title cannot be empty.' }),
  title_fr: z.string().min(1, { message: 'French title cannot be empty.' }),
  subtitle_en: z.string().min(1, { message: 'English subtitle cannot be empty.' }),
  subtitle_ar: z.string().min(1, { message: 'Arabic subtitle cannot be empty.' }),
  subtitle_fr: z.string().min(1, { message: 'French subtitle cannot be empty.' }),
  price_text_en: z.string().min(1, { message: 'English price text cannot be empty.' }),
  price_text_ar: z.string().min(1, { message: 'Arabic price text cannot be empty.' }),
  price_text_fr: z.string().min(1, { message: 'French price text cannot be empty.' }),
  image_url: z.string().url({ message: 'Must be a valid URL or empty.' }).nullable().optional().or(z.literal('')),
  link_url: z.string().url({ message: 'Must be a valid URL or empty.' }).nullable().optional().or(z.literal('')),
  is_active: z.boolean().default(false),
});

const DiscountsManagement: React.FC = () => {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentDiscount, setCurrentDiscount] = useState<Discount | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const form = useForm<z.infer<typeof discountSchema>>({
    resolver: zodResolver(discountSchema),
    defaultValues: {
      title_en: '',
      title_ar: '',
      title_fr: '',
      subtitle_en: '',
      subtitle_ar: '',
      subtitle_fr: '',
      price_text_en: '',
      price_text_ar: '',
      price_text_fr: '',
      image_url: '',
      link_url: '',
      is_active: false,
    },
  });

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const fetchDiscounts = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('discounts').select('*').order('created_at', { ascending: false });
    if (error) {
      toast.error('Failed to fetch discounts', { description: error.message });
    } else {
      setDiscounts(data || []);
    }
    setLoading(false);
  };

  const onSubmit = async (values: z.infer<typeof discountSchema>) => {
    setIsSubmitting(true);
    const discountData = {
      ...values,
      image_url: values.image_url === '' ? null : values.image_url,
      link_url: values.link_url === '' ? null : values.link_url,
    };

    try {
      // If this discount is being set to active, deactivate all others
      if (discountData.is_active) {
        const { error: deactivateError } = await supabase
          .from('discounts')
          .update({ is_active: false })
          .neq('id', currentDiscount?.id || ''); // Exclude current one if editing
        if (deactivateError) {
          console.error('Error deactivating other discounts:', deactivateError.message);
          // Don't throw, just log, as it's not critical to prevent the current update
        }
      }

      if (currentDiscount) {
        const { error } = await supabase
          .from('discounts')
          .update(discountData)
          .eq('id', currentDiscount.id);

        if (error) {
          throw error;
        }
        toast.success('Discount updated successfully!');
      } else {
        const { error } = await supabase
          .from('discounts')
          .insert([discountData]);

        if (error) {
          throw error;
        }
        toast.success('Discount added successfully!');
      }

      setIsDialogOpen(false);
      fetchDiscounts();
    } catch (error: any) {
      toast.error('Operation Failed', { description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteDiscount = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this discount?')) {
      const { error } = await supabase.from('discounts').delete().eq('id', id);
      if (error) {
        toast.error('Failed to delete discount', { description: error.message });
      } else {
        toast.success('Discount deleted successfully!');
        fetchDiscounts();
      }
    }
  };

  const toggleActiveStatus = async (discount: Discount) => {
    const newStatus = !discount.is_active;
    setIsSubmitting(true);
    try {
      // If activating this discount, deactivate all others first
      if (newStatus) {
        const { error: deactivateError } = await supabase
          .from('discounts')
          .update({ is_active: false })
          .neq('id', discount.id);
        if (deactivateError) {
          console.error('Error deactivating other discounts:', deactivateError.message);
        }
      }

      const { error } = await supabase
        .from('discounts')
        .update({ is_active: newStatus })
        .eq('id', discount.id);

      if (error) {
        throw error;
      }
      toast.success(`Discount ${newStatus ? 'activated' : 'deactivated'} successfully!`);
      fetchDiscounts();
    } catch (error: any) {
      toast.error('Failed to update status', { description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const openAddDialog = () => {
    setCurrentDiscount(null);
    form.reset({
      title_en: '', title_ar: '', title_fr: '',
      subtitle_en: '', subtitle_ar: '', subtitle_fr: '',
      price_text_en: '', price_text_ar: '', price_text_fr: '',
      image_url: '', link_url: '', is_active: false,
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (discount: Discount) => {
    setCurrentDiscount(discount);
    form.reset({
      ...discount,
      image_url: discount.image_url || '',
      link_url: discount.link_url || '',
    });
    setIsDialogOpen(true);
  };

  const openPreviewDialog = (discount: Discount) => {
    setCurrentDiscount(discount);
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
        <h1 className="text-3xl font-bold text-dairy-darkBlue">Discounts Management</h1>
        <AnimatedButton onClick={openAddDialog} className="bg-dairy-blue text-white hover:bg-dairy-darkBlue" soundOnClick="/sounds/click.mp3">
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Discount
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
                  <TableHead className="text-dairy-darkBlue">Subtitle (EN)</TableHead>
                  <TableHead className="text-dairy-darkBlue">Price (EN)</TableHead>
                  <TableHead className="text-dairy-darkBlue">Active</TableHead>
                  <TableHead className="text-right text-dairy-darkBlue">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {discounts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-dairy-text">
                      No discounts found.
                    </TableCell>
                  </TableRow>
                ) : (
                  discounts.map((discount) => (
                    <TableRow key={discount.id}>
                      <TableCell>
                        {discount.image_url && (
                          <img src={discount.image_url} alt={discount.title_en} className="w-12 h-12 object-cover rounded-md" />
                        )}
                      </TableCell>
                      <TableCell className="font-medium text-dairy-darkBlue">{discount.title_en}</TableCell>
                      <TableCell className="text-dairy-text line-clamp-2">{discount.subtitle_en}</TableCell>
                      <TableCell className="text-dairy-blue font-semibold">{discount.price_text_en}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleActiveStatus(discount)}
                          className={discount.is_active ? "text-green-600 hover:text-green-700" : "text-red-600 hover:text-red-700"}
                          disabled={isSubmitting}
                        >
                          {discount.is_active ? <ToggleRight className="h-5 w-5" /> : <ToggleLeft className="h-5 w-5" />}
                        </Button>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <AnimatedButton variant="outline" size="sm" onClick={() => openPreviewDialog(discount)} soundOnClick="/sounds/click.mp3">
                            <Eye className="h-4 w-4" />
                          </AnimatedButton>
                          <AnimatedButton variant="outline" size="sm" onClick={() => openEditDialog(discount)} soundOnClick="/sounds/click.mp3">
                            <Edit className="h-4 w-4" />
                          </AnimatedButton>
                          <AnimatedButton variant="destructive" size="sm" onClick={() => handleDeleteDiscount(discount.id)} soundOnClick="/sounds/click.mp3">
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
        <DialogContent className="sm:max-w-[800px] bg-dairy-cream border-dairy-blue/20 shadow-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-dairy-darkBlue">{currentDiscount ? 'Edit Discount' : 'Add New Discount'}</DialogTitle>
            <DialogDescription className="text-dairy-text">
              {currentDiscount ? 'Make changes to the discount details here.' : 'Add a new discount flyer.'}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="title_en"
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
                name="title_ar"
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
                name="title_fr"
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
                name="subtitle_en"
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
                name="subtitle_ar"
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
                name="subtitle_fr"
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

              <FormField
                control={form.control}
                name="price_text_en"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                    <FormLabel className="md:text-right text-dairy-text">Price Text (English)</FormLabel>
                    <FormControl className="md:col-span-3">
                      <Input {...field} className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue" />
                    </FormControl>
                    <FormMessage className="md:col-span-4 md:col-start-2" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price_text_ar"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                    <FormLabel className="md:text-right text-dairy-text">Price Text (Arabic)</FormLabel>
                    <FormControl className="md:col-span-3">
                      <Input {...field} className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue" />
                    </FormControl>
                    <FormMessage className="md:col-span-4 md:col-start-2" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price_text_fr"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                    <FormLabel className="md:text-right text-dairy-text">Price Text (French)</FormLabel>
                    <FormControl className="md:col-span-3">
                      <Input {...field} className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue" />
                    </FormControl>
                    <FormMessage className="md:col-span-4 md:col-start-2" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="image_url"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                    <FormLabel className="md:text-right text-dairy-text">Image URL</FormLabel>
                    <FormControl className="md:col-span-3">
                      <Input placeholder="e.g., https://example.com/image.jpg" {...field} className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue" />
                    </FormControl>
                    <FormMessage className="md:col-span-4 md:col-start-2" />
                  </FormItem>
                )}
              />
              {form.watch('image_url') && (
                <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                  <Label className="md:text-right text-dairy-text">Image Preview</Label>
                  <div className="md:col-span-3">
                    {/\.(jpeg|jpg|gif|png|svg|webp)$/i.test(form.watch('image_url') || '') ? (
                      <img src={form.watch('image_url') || ''} alt="Image Preview" className="w-24 h-24 object-contain rounded-md" />
                    ) : (
                      <p className="text-red-500 text-sm">Invalid image URL format.</p>
                    )}
                  </div>
                </div>
              )}

              <FormField
                control={form.control}
                name="link_url"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                    <FormLabel className="md:text-right text-dairy-text">Link URL</FormLabel>
                    <FormControl className="md:col-span-3">
                      <Input placeholder="e.g., /products/amir-cheese" {...field} className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue" />
                    </FormControl>
                    <FormMessage className="md:col-span-4 md:col-start-2" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                    <FormLabel className="md:text-right text-dairy-text">Active</FormLabel>
                    <FormControl className="md:col-span-3">
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-dairy-blue data-[state=unchecked]:bg-gray-300"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage className="md:col-span-4 md:col-start-2" />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <AnimatedButton type="submit" className="bg-dairy-blue text-white hover:bg-dairy-darkBlue" soundOnClick="/sounds/click.mp3" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {currentDiscount ? 'Saving...' : 'Adding...'}
                    </>
                  ) : (
                    currentDiscount ? 'Save Changes' : 'Add Discount'
                  )}
                </AnimatedButton>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Discount Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-[600px] bg-dairy-cream border-dairy-blue/20 shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-dairy-darkBlue">Discount Flyer Preview</DialogTitle>
            <DialogDescription className="text-dairy-text">
              This is how the discount flyer will look on your homepage.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 text-center space-y-4">
            {currentDiscount?.image_url && (
              <img src={currentDiscount.image_url} alt={currentDiscount.title_en} className="w-48 h-48 object-contain mx-auto mb-4" />
            )}
            <h2 className="text-4xl font-bold text-dairy-darkBlue">{currentDiscount?.title_en}</h2>
            <p className="text-xl text-dairy-text">{currentDiscount?.subtitle_en}</p>
            <p className="text-2xl font-semibold text-dairy-blue">{currentDiscount?.price_text_en}</p>
            <p className="text-sm text-gray-500">Status: {currentDiscount?.is_active ? 'Active' : 'Inactive'}</p>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsPreviewOpen(false)} className="bg-dairy-blue text-white hover:bg-dairy-darkBlue">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default DiscountsManagement;