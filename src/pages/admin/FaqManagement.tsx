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
import { PlusCircle, Edit, Trash2, Loader2, HelpCircle } from 'lucide-react';
import AnimatedButton from '@/components/AnimatedButton';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'; // Import Form components

interface FaqItem {
  id: string;
  question_en: string;
  answer_en: string;
  question_ar: string;
  answer_ar: string;
  question_fr: string;
  answer_fr: string;
  order_index: number; // For custom sorting
}

const faqSchema = z.object({
  question_en: z.string().min(5, { message: 'English question must be at least 5 characters.' }),
  answer_en: z.string().min(10, { message: 'English answer must be at least 10 characters.' }),
  question_ar: z.string().min(5, { message: 'Arabic question must be at least 5 characters.' }),
  answer_ar: z.string().min(10, { message: 'Arabic answer must be at least 10 characters.' }),
  question_fr: z.string().min(5, { message: 'French question must be at least 5 characters.' }),
  answer_fr: z.string().min(10, { message: 'French answer must be at least 10 characters.' }),
  order_index: z.number().int().min(0, { message: 'Order must be a non-negative integer.' }).optional(),
});

const FaqManagement: React.FC = () => {
  const [faqItems, setFaqItems] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentFaq, setCurrentFaq] = useState<FaqItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof faqSchema>>({
    resolver: zodResolver(faqSchema),
    defaultValues: {
      question_en: '',
      answer_en: '',
      question_ar: '',
      answer_ar: '',
      question_fr: '',
      answer_fr: '',
      order_index: 0,
    },
  });

  useEffect(() => {
    fetchFaqItems();
  }, []);

  const fetchFaqItems = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('faq_items').select('*').order('order_index', { ascending: true });
    if (error) {
      toast.error('Failed to fetch FAQ items', { description: error.message });
    } else {
      setFaqItems(data || []);
    }
    setLoading(false);
  };

  const onSubmit = async (values: z.infer<typeof faqSchema>) => {
    setIsSubmitting(true);
    try {
      const faqData = {
        question_en: values.question_en,
        answer_en: values.answer_en,
        question_ar: values.question_ar,
        answer_ar: values.answer_ar,
        question_fr: values.question_fr,
        answer_fr: values.answer_fr,
        order_index: values.order_index || 0,
      };

      if (currentFaq) {
        const { error } = await supabase
          .from('faq_items')
          .update(faqData)
          .eq('id', currentFaq.id);

        if (error) {
          throw error;
        }
        toast.success('FAQ item updated successfully!');
      } else {
        const { error } = await supabase
          .from('faq_items')
          .insert([faqData]);

        if (error) {
          throw error;
        }
        toast.success('FAQ item added successfully!');
      }

      setIsDialogOpen(false);
      fetchFaqItems();
    } catch (error: any) {
      toast.error('Operation Failed', { description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteFaq = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this FAQ item?')) {
      const { error } = await supabase.from('faq_items').delete().eq('id', id);
      if (error) {
        toast.error('Failed to delete FAQ item', { description: error.message });
      } else {
        toast.success('FAQ item deleted successfully!');
        fetchFaqItems();
      }
    }
  };

  const openAddDialog = () => {
    setCurrentFaq(null);
    form.reset({
      question_en: '',
      answer_en: '',
      question_ar: '',
      answer_ar: '',
      question_fr: '',
      answer_fr: '',
      order_index: faqItems.length > 0 ? Math.max(...faqItems.map(f => f.order_index)) + 1 : 0
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (faq: FaqItem) => {
    setCurrentFaq(faq);
    form.reset(faq);
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
        <h1 className="text-3xl font-bold text-dairy-darkBlue">FAQ Management</h1>
        <AnimatedButton onClick={openAddDialog} className="bg-dairy-blue text-white hover:bg-dairy-darkBlue" soundOnClick="/sounds/click.mp3">
          <PlusCircle className="mr-2 h-4 w-4" /> Add New FAQ
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
                  <TableHead className="w-[50px] text-dairy-darkBlue">Order</TableHead>
                  <TableHead className="text-dairy-darkBlue">Question (EN)</TableHead>
                  <TableHead className="text-dairy-darkBlue">Answer (EN)</TableHead>
                  <TableHead className="text-right text-dairy-darkBlue">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {faqItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-dairy-text">
                      No FAQ items found.
                    </TableCell>
                  </TableRow>
                ) : (
                  faqItems.map((faq) => (
                    <TableRow key={faq.id}>
                      <TableCell className="font-medium text-dairy-darkBlue">{faq.order_index}</TableCell>
                      <TableCell className="font-medium text-dairy-darkBlue">{faq.question_en}</TableCell>
                      <TableCell className="text-dairy-text line-clamp-2">{faq.answer_en}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <AnimatedButton variant="outline" size="sm" onClick={() => openEditDialog(faq)} soundOnClick="/sounds/click.mp3">
                            <Edit className="h-4 w-4" />
                          </AnimatedButton>
                          <AnimatedButton variant="destructive" size="sm" onClick={() => handleDeleteFaq(faq.id)} soundOnClick="/sounds/click.mp3">
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
        <DialogContent className="sm:max-w-[600px] bg-dairy-cream border-dairy-blue/20 shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-dairy-darkBlue">{currentFaq ? 'Edit FAQ Item' : 'Add New FAQ Item'}</DialogTitle>
            <DialogDescription className="text-dairy-text">
              {currentFaq ? 'Make changes to the FAQ item here.' : 'Add a new question and answer to your FAQ section.'}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="question_en"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right text-dairy-text">Question (English)</FormLabel>
                    <FormControl className="col-span-3">
                      <Input {...field} className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue" />
                    </FormControl>
                    <FormMessage className="col-span-4 col-start-2" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="answer_en"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-start gap-4">
                    <FormLabel className="text-right text-dairy-text">Answer (English)</FormLabel>
                    <FormControl className="col-span-3">
                      <Textarea {...field} rows={5} className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue" />
                    </FormControl>
                    <FormMessage className="col-span-4 col-start-2" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="question_ar"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right text-dairy-text">Question (Arabic)</FormLabel>
                    <FormControl className="col-span-3">
                      <Input {...field} className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue" />
                    </FormControl>
                    <FormMessage className="col-span-4 col-start-2" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="answer_ar"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-start gap-4">
                    <FormLabel className="text-right text-dairy-text">Answer (Arabic)</FormLabel>
                    <FormControl className="col-span-3">
                      <Textarea {...field} rows={5} className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue" />
                    </FormControl>
                    <FormMessage className="col-span-4 col-start-2" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="question_fr"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right text-dairy-text">Question (French)</FormLabel>
                    <FormControl className="col-span-3">
                      <Input {...field} className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue" />
                    </FormControl>
                    <FormMessage className="col-span-4 col-start-2" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="answer_fr"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-start gap-4">
                    <FormLabel className="text-right text-dairy-text">Answer (French)</FormLabel>
                    <FormControl className="col-span-3">
                      <Textarea {...field} rows={5} className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue" />
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
                      {currentFaq ? 'Saving...' : 'Adding...'}
                    </>
                  ) : (
                    currentFaq ? 'Save Changes' : 'Add FAQ'
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

export default FaqManagement;