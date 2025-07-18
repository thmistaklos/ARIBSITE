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

interface FactItem {
  id: string;
  icon_name: string;
  text_content_en: string;
  text_content_ar: string;
  text_content_fr: string;
  order_index: number;
}

const factSchema = z.object({
  icon_name: z.string().min(1, { message: 'Icon name cannot be empty.' }),
  text_content_en: z.string().min(1, { message: 'English content cannot be empty.' }),
  text_content_ar: z.string().min(1, { message: 'Arabic content cannot be empty.' }),
  text_content_fr: z.string().min(1, { message: 'French content cannot be empty.' }),
  order_index: z.number().int().min(0, { message: 'Order must be a non-negative integer.' }).optional(),
});

const FactsManagement: React.FC = () => {
  const [factItems, setFactItems] = useState<FactItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentFact, setCurrentFact] = useState<FactItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof factSchema>>({
    resolver: zodResolver(factSchema),
    defaultValues: {
      icon_name: '',
      text_content_en: '',
      text_content_ar: '',
      text_content_fr: '',
      order_index: 0,
    },
  });

  useEffect(() => {
    fetchFactItems();
  }, []);

  const fetchFactItems = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('facts_items').select('*').order('order_index', { ascending: true });
    if (error) {
      toast.error('Failed to fetch fact items', { description: error.message });
    } else {
      setFactItems(data || []);
    }
    setLoading(false);
  };

  const onSubmit = async (values: z.infer<typeof factSchema>) => {
    setIsSubmitting(true);
    try {
      const factData = {
        icon_name: values.icon_name,
        text_content_en: values.text_content_en,
        text_content_ar: values.text_content_ar,
        text_content_fr: values.text_content_fr,
        order_index: values.order_index || 0,
      };

      if (currentFact) {
        const { error } = await supabase
          .from('facts_items')
          .update(factData)
          .eq('id', currentFact.id);

        if (error) {
          throw error;
        }
        toast.success('Fact item updated successfully!');
      } else {
        const { error } = await supabase
          .from('facts_items')
          .insert([factData]);

        if (error) {
          throw error;
        }
        toast.success('Fact item added successfully!');
      }

      setIsDialogOpen(false);
      fetchFactItems();
    } catch (error: any) {
      toast.error('Operation Failed', { description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteFact = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this fact item?')) {
      const { error } = await supabase.from('facts_items').delete().eq('id', id);
      if (error) {
        toast.error('Failed to delete fact item', { description: error.message });
      } else {
        toast.success('Fact item deleted successfully!');
        fetchFactItems();
      }
    }
  };

  const openAddDialog = () => {
    setCurrentFact(null);
    form.reset({
      icon_name: '',
      text_content_en: '',
      text_content_ar: '',
      text_content_fr: '',
      order_index: factItems.length > 0 ? Math.max(...factItems.map(f => f.order_index)) + 1 : 0
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (fact: FactItem) => {
    setCurrentFact(fact);
    form.reset(fact);
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
        <h1 className="text-3xl font-bold text-dairy-darkBlue">Facts Management</h1>
        <AnimatedButton onClick={openAddDialog} className="bg-dairy-blue text-white hover:bg-dairy-darkBlue" soundOnClick="/sounds/click.mp3">
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Fact
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
                  <TableHead className="text-dairy-darkBlue">Text Content (EN)</TableHead>
                  <TableHead className="text-right text-dairy-darkBlue">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {factItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-dairy-text">
                      No fact items found.
                    </TableCell>
                  </TableRow>
                ) : (
                  factItems.map((fact) => {
                    const IconComponent = LucideIcons[fact.icon_name];
                    return (
                      <TableRow key={fact.id}>
                        <TableCell className="font-medium text-dairy-darkBlue">{fact.order_index}</TableCell>
                        <TableCell>
                          {IconComponent ? (
                            <IconComponent className="h-8 w-8 text-dairy-blue" />
                          ) : (
                            <span className="text-red-500 text-xs">Invalid Icon</span>
                          )}
                        </TableCell>
                        <TableCell className="text-dairy-text line-clamp-2">{fact.text_content_en}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <AnimatedButton variant="outline" size="sm" onClick={() => openEditDialog(fact)} soundOnClick="/sounds/click.mp3">
                              <Edit className="h-4 w-4" />
                            </AnimatedButton>
                            <AnimatedButton variant="destructive" size="sm" onClick={() => handleDeleteFact(fact.id)} soundOnClick="/sounds/click.mp3">
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
        <DialogContent className="sm:max-w-[600px] bg-dairy-cream border-dairy-blue/20 shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-dairy-darkBlue">{currentFact ? 'Edit Fact Item' : 'Add New Fact Item'}</DialogTitle>
            <DialogDescription className="text-dairy-text">
              {currentFact ? 'Make changes to the fact item here.' : 'Add a new fact to your homepage section.'}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="icon_name"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right text-dairy-text">Icon Name (Lucide)</FormLabel>
                    <FormControl className="col-span-3">
                      <Input placeholder="e.g., Droplet, Truck, FlaskConical" {...field} className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue" />
                    </FormControl>
                    <FormMessage className="col-span-4 col-start-2" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="text_content_en"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-start gap-4">
                    <FormLabel className="text-right text-dairy-text">Text Content (English)</FormLabel>
                    <FormControl className="col-span-3">
                      <Textarea {...field} rows={3} className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue" />
                    </FormControl>
                    <FormMessage className="col-span-4 col-start-2" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="text_content_ar"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-start gap-4">
                    <FormLabel className="text-right text-dairy-text">Text Content (Arabic)</FormLabel>
                    <FormControl className="col-span-3">
                      <Textarea {...field} rows={3} className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue" />
                    </FormControl>
                    <FormMessage className="col-span-4 col-start-2" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="text_content_fr"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-start gap-4">
                    <FormLabel className="text-right text-dairy-text">Text Content (French)</FormLabel>
                    <FormControl className="col-span-3">
                      <Textarea {...field} rows={3} className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue" />
                    </FormControl>
                    <FormMessage className="col-span-4 col-start-2" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="order_index"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right text-dairy-text">Order</FormLabel>
                    <FormControl className="col-span-3">
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                        className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue"
                      />
                    </FormControl>
                    <FormMessage className="col-span-4 col-start-2" />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <AnimatedButton type="submit" className="bg-dairy-blue text-white hover:bg-dairy-darkBlue" soundOnClick="/sounds/click.mp3" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {currentFact ? 'Saving...' : 'Adding...'}
                    </>
                  ) : (
                    currentFact ? 'Save Changes' : 'Add Fact'
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

export default FactsManagement;