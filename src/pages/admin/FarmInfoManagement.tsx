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
import { PlusCircle, Edit, Trash2, Loader2 } from 'lucide-react';
import AnimatedButton from '@/components/AnimatedButton';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { LucideIcons } from '@/utils/lucide-icons'; // Import the icon map

interface FarmInfoItem {
  id: string;
  icon_name: string;
  title_en: string;
  title_ar: string;
  title_fr: string;
  description_en: string;
  description_ar: string;
  description_fr: string;
  order_index: number;
}

const farmInfoSchema = z.object({
  icon_name: z.string().min(1, { message: 'Icon name cannot be empty.' }),
  title_en: z.string().min(1, { message: 'English title cannot be empty.' }),
  title_ar: z.string().min(1, { message: 'Arabic title cannot be empty.' }),
  title_fr: z.string().min(1, { message: 'French title cannot be empty.' }),
  description_en: z.string().min(1, { message: 'English description cannot be empty.' }),
  description_ar: z.string().min(1, { message: 'Arabic description cannot be empty.' }),
  description_fr: z.string().min(1, { message: 'French description cannot be empty.' }),
  order_index: z.number().int().min(0, { message: 'Order must be a non-negative integer.' }).optional(),
});

const FarmInfoManagement: React.FC = () => {
  const [farmInfoItems, setFarmInfoItems] = useState<FarmInfoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentFarmInfo, setCurrentFarmInfo] = useState<FarmInfoItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof farmInfoSchema>>({
    resolver: zodResolver(farmInfoSchema),
    defaultValues: {
      icon_name: '',
      title_en: '',
      title_ar: '',
      title_fr: '',
      description_en: '',
      description_ar: '',
      description_fr: '',
      order_index: 0,
    },
  });

  useEffect(() => {
    fetchFarmInfoItems();
  }, []);

  const fetchFarmInfoItems = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('farm_info_items').select('*').order('order_index', { ascending: true });
    if (error) {
      toast.error('Failed to fetch farm info items', { description: error.message });
    } else {
      setFarmInfoItems(data || []);
    }
    setLoading(false);
  };

  const onSubmit = async (values: z.infer<typeof farmInfoSchema>) => {
    setIsSubmitting(true);
    try {
      const farmInfoData = {
        icon_name: values.icon_name,
        title_en: values.title_en,
        title_ar: values.title_ar,
        title_fr: values.title_fr,
        description_en: values.description_en,
        description_ar: values.description_ar,
        description_fr: values.description_fr,
        order_index: values.order_index || 0,
      };

      if (currentFarmInfo) {
        const { error } = await supabase
          .from('farm_info_items')
          .update(farmInfoData)
          .eq('id', currentFarmInfo.id);

        if (error) {
          throw error;
        }
        toast.success('Farm info item updated successfully!');
      } else {
        const { error } = await supabase
          .from('farm_info_items')
          .insert([farmInfoData]);

        if (error) {
          throw error;
        }
        toast.success('Farm info item added successfully!');
      }

      setIsDialogOpen(false);
      fetchFarmInfoItems();
    } catch (error: any) {
      toast.error('Operation Failed', { description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteFarmInfo = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this farm info item?')) {
      const { error } = await supabase.from('farm_info_items').delete().eq('id', id);
      if (error) {
        toast.error('Failed to delete farm info item', { description: error.message });
      } else {
        toast.success('Farm info item deleted successfully!');
        fetchFarmInfoItems();
      }
    }
  };

  const openAddDialog = () => {
    setCurrentFarmInfo(null);
    form.reset({
      icon_name: '',
      title_en: '',
      title_ar: '',
      title_fr: '',
      description_en: '',
      description_ar: '',
      description_fr: '',
      order_index: farmInfoItems.length > 0 ? Math.max(...farmInfoItems.map(f => f.order_index)) + 1 : 0
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (item: FarmInfoItem) => {
    setCurrentFarmInfo(item);
    form.reset(item);
    setIsDialogOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-dairy-darkBlue">Farm Info Management</h1>
        <AnimatedButton onClick={openAddDialog} className="bg-dairy-blue text-white hover:bg-dairy-darkBlue" soundOnClick="/sounds/click.mp3">
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Item
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
                  <TableHead className="w-[80px] text-dairy-darkBlue">Order</TableHead>
                  <TableHead className="w-[100px] text-dairy-darkBlue">Icon</TableHead>
                  <TableHead className="text-dairy-darkBlue">Title (EN)</TableHead>
                  <TableHead className="text-dairy-darkBlue">Description (EN)</TableHead>
                  <TableHead className="text-right text-dairy-darkBlue">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {farmInfoItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-dairy-text">
                      No farm info items found.
                    </TableCell>
                  </TableRow>
                ) : (
                  farmInfoItems.map((item) => {
                    const IconComponent = LucideIcons[item.icon_name];
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium text-dairy-darkBlue">{item.order_index}</TableCell>
                        <TableCell>
                          {IconComponent ? (
                            <IconComponent className="h-8 w-8 text-dairy-blue" />
                          ) : (
                            <span className="text-red-500 text-xs">Invalid Icon</span>
                          )}
                        </TableCell>
                        <TableCell className="font-medium text-dairy-darkBlue">{item.title_en}</TableCell>
                        <TableCell className="text-dairy-text line-clamp-2">{item.description_en}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <AnimatedButton variant="outline" size="sm" onClick={() => openEditDialog(item)} soundOnClick="/sounds/click.mp3">
                              <Edit className="h-4 w-4" />
                            </AnimatedButton>
                            <AnimatedButton variant="destructive" size="sm" onClick={() => handleDeleteFarmInfo(item.id)} soundOnClick="/sounds/click.mp3">
                              <Trash2 className="h-4 w-4" />
                            </AnimatedButton>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] bg-dairy-cream border-dairy-blue/20 shadow-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-dairy-darkBlue">{currentFarmInfo ? 'Edit Farm Info Item' : 'Add New Farm Info Item'}</DialogTitle>
            <DialogDescription className="text-dairy-text">
              {currentFarmInfo ? 'Make changes to the farm info item here.' : 'Add a new item to your farm information section.'}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="icon_name"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                    <FormLabel className="md:text-right text-dairy-text">Icon Name (Lucide)</FormLabel>
                    <FormControl className="md:col-span-3">
                      <Input placeholder="e.g., Leaf, Award, Sprout" {...field} className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue" />
                    </FormControl>
                    <FormMessage className="md:col-span-4 md:col-start-2" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="title_en"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                    <FormLabel className="md:text-right text-dairy-text">Title (English)</FormLabel>
                    <FormControl className="md:col-span-3">
                      <Input {...field} className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue" />
                    </FormControl>
                    <FormMessage className="md:col-span-4 md-col-start-2" />
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
                    <FormMessage className="md:col-span-4 md-col-start-2" />
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
                    <FormMessage className="md:col-span-4 md-col-start-2" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description_en"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-1 md:grid-cols-4 items-start gap-4">
                    <FormLabel className="md:text-right text-dairy-text">Description (English)</FormLabel>
                    <FormControl className="md:col-span-3">
                      <Textarea {...field} rows={3} className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue" />
                    </FormControl>
                    <FormMessage className="md:col-span-4 md-col-start-2" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description_ar"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-1 md:grid-cols-4 items-start gap-4">
                    <FormLabel className="md:text-right text-dairy-text">Description (Arabic)</FormLabel>
                    <FormControl className="md:col-span-3">
                      <Textarea {...field} rows={3} className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue" />
                    </FormControl>
                    <FormMessage className="md:col-span-4 md-col-start-2" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description_fr"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-1 md:grid-cols-4 items-start gap-4">
                    <FormLabel className="md:text-right text-dairy-text">Description (French)</FormLabel>
                    <FormControl className="md:col-span-3">
                      <Textarea {...field} rows={3} className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue" />
                    </FormControl>
                    <FormMessage className="md:col-span-4 md-col-start-2" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="order_index"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                    <FormLabel className="md:text-right text-dairy-text">Order</FormLabel>
                    <FormControl className="md:col-span-3">
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                        className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue"
                      />
                    </FormControl>
                    <FormMessage className="md:col-span-4 md-col-start-2" />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <AnimatedButton type="submit" className="bg-dairy-blue text-white hover:bg-dairy-darkBlue" soundOnClick="/sounds/click.mp3" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {currentFarmInfo ? 'Saving...' : 'Adding...'}
                    </>
                  ) : (
                    currentFarmInfo ? 'Save Changes' : 'Add Item'
                  )}
                </AnimatedButton>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default FarmInfoManagement;