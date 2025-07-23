import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { PlusCircle, Edit, Trash2, Loader2, Leaf } from 'lucide-react';
import AnimatedButton from '@/components/AnimatedButton';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { LucideIcons } from '@/utils/lucide-icons';

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
  icon_name: z.string().min(1, { message: 'Icon name is required.' }),
  title_en: z.string().min(1, { message: 'English title is required.' }),
  title_ar: z.string().min(1, { message: 'Arabic title is required.' }),
  title_fr: z.string().min(1, { message: 'French title is required.' }),
  description_en: z.string().min(1, { message: 'English description is required.' }),
  description_ar: z.string().min(1, { message: 'Arabic description is required.' }),
  description_fr: z.string().min(1, { message: 'French description is required.' }),
  order_index: z.number().int().min(0).optional(),
});

const FarmInfoManagement: React.FC = () => {
  const [items, setItems] = useState<FarmInfoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<FarmInfoItem | null>(null);
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
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('farm_info_items').select('*').order('order_index', { ascending: true });
    if (error) {
      toast.error('Failed to fetch farm info items', { description: error.message });
    } else {
      setItems(data || []);
    }
    setLoading(false);
  };

  const onSubmit = async (values: z.infer<typeof farmInfoSchema>) => {
    setIsSubmitting(true);
    try {
      const itemData = { ...values, order_index: values.order_index || 0 };

      if (currentItem) {
        const { error } = await supabase.from('farm_info_items').update(itemData).eq('id', currentItem.id);
        if (error) throw error;
        toast.success('Item updated successfully!');
      } else {
        const { error } = await supabase.from('farm_info_items').insert([itemData]);
        if (error) throw error;
        toast.success('Item added successfully!');
      }
      setIsDialogOpen(false);
      fetchItems();
    } catch (error: any) {
      toast.error('Operation Failed', { description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      const { error } = await supabase.from('farm_info_items').delete().eq('id', id);
      if (error) {
        toast.error('Failed to delete item', { description: error.message });
      } else {
        toast.success('Item deleted successfully!');
        fetchItems();
      }
    }
  };

  const openAddDialog = () => {
    setCurrentItem(null);
    form.reset({
      icon_name: '', title_en: '', title_ar: '', title_fr: '',
      description_en: '', description_ar: '', description_fr: '',
      order_index: items.length > 0 ? Math.max(...items.map(f => f.order_index)) + 1 : 0
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (item: FarmInfoItem) => {
    setCurrentItem(item);
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
        <h1 className="text-3xl font-bold text-dairy-darkBlue">Farm Info Section Management</h1>
        <AnimatedButton onClick={openAddDialog} className="bg-dairy-blue text-white hover:bg-dairy-darkBlue" soundOnClick="/sounds/click.mp3">
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Item
        </AnimatedButton>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-dairy-blue" /></div>
      ) : (
        <div className="rounded-md border border-dairy-blue/20 bg-white shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader><TableRow className="bg-dairy-blue/10">
                <TableHead className="w-[80px] text-dairy-darkBlue">Order</TableHead>
                <TableHead className="w-[100px] text-dairy-darkBlue">Icon</TableHead>
                <TableHead className="text-dairy-darkBlue">Title (EN)</TableHead>
                <TableHead className="text-right text-dairy-darkBlue">Actions</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {items.length === 0 ? (
                  <TableRow><TableCell colSpan={4} className="h-24 text-center text-dairy-text">No items found.</TableCell></TableRow>
                ) : (
                  items.map((item) => {
                    const IconComponent = LucideIcons[item.icon_name];
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium text-dairy-darkBlue">{item.order_index}</TableCell>
                        <TableCell>{IconComponent ? <IconComponent className="h-8 w-8 text-dairy-blue" /> : <span className="text-red-500 text-xs">Invalid</span>}</TableCell>
                        <TableCell className="text-dairy-text">{item.title_en}</TableCell>
                        <TableCell className="text-right"><div className="flex justify-end space-x-2">
                          <AnimatedButton variant="outline" size="sm" onClick={() => openEditDialog(item)}><Edit className="h-4 w-4" /></AnimatedButton>
                          <AnimatedButton variant="destructive" size="sm" onClick={() => handleDeleteItem(item.id)}><Trash2 className="h-4 w-4" /></AnimatedButton>
                        </div></TableCell>
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
        <DialogContent className="sm:max-w-[600px] bg-dairy-cream border-dairy-blue/20 shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-dairy-darkBlue">{currentItem ? 'Edit Item' : 'Add New Item'}</DialogTitle>
            <DialogDescription className="text-dairy-text">{currentItem ? 'Make changes to the item here.' : 'Add a new item to the Farm Info section.'}</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
              <FormField control={form.control} name="icon_name" render={({ field }) => (<FormItem><FormLabel>Icon Name (Lucide)</FormLabel><FormControl><Input placeholder="e.g., Leaf, Award, Heart" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="title_en" render={({ field }) => (<FormItem><FormLabel>Title (EN)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="description_en" render={({ field }) => (<FormItem><FormLabel>Description (EN)</FormLabel><FormControl><Textarea {...field} rows={3} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="title_ar" render={({ field }) => (<FormItem><FormLabel>Title (AR)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="description_ar" render={({ field }) => (<FormItem><FormLabel>Description (AR)</FormLabel><FormControl><Textarea {...field} rows={3} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="title_fr" render={({ field }) => (<FormItem><FormLabel>Title (FR)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="description_fr" render={({ field }) => (<FormItem><FormLabel>Description (FR)</FormLabel><FormControl><Textarea {...field} rows={3} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="order_index" render={({ field }) => (<FormItem><FormLabel>Order</FormLabel><FormControl><Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value, 10))} /></FormControl><FormMessage /></FormItem>)} />
              <DialogFooter>
                <AnimatedButton type="submit" className="bg-dairy-blue text-white hover:bg-dairy-darkBlue" disabled={isSubmitting}>
                  {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : 'Save Changes'}
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