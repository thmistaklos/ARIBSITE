import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { PlusCircle, Edit, Trash2, Loader2, Eye, ToggleLeft, ToggleRight } from 'lucide-react';
import AnimatedButton from '@/components/AnimatedButton';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from 'react-i18next';

interface BlogPost {
  id: string;
  title_en: string;
  title_ar: string | null;
  title_fr: string | null;
  content_en: string;
  content_ar: string | null;
  content_fr: string | null;
  image_url: string | null;
  author: string;
  published: boolean;
  created_at: string;
}

const blogPostSchema = z.object({
  title_en: z.string().min(2, { message: 'English title is required.' }),
  title_ar: z.string().min(2, { message: 'Arabic title is required.' }),
  title_fr: z.string().min(2, { message: 'French title is required.' }),
  content_en: z.string().min(10, { message: 'English content is required.' }),
  content_ar: z.string().min(10, { message: 'Arabic content is required.' }),
  content_fr: z.string().min(10, { message: 'French content is required.' }),
  image_url: z.string().url({ message: 'Must be a valid URL or empty.' }).nullable().optional().or(z.literal('')),
  author: z.string().min(2, { message: 'Author must be at least 2 characters.' }),
  published: z.boolean().default(false),
});

const BlogManagement: React.FC = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState<BlogPost | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const { t } = useTranslation();

  const form = useForm<z.infer<typeof blogPostSchema>>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title_en: '', title_ar: '', title_fr: '',
      content_en: '', content_ar: '', content_fr: '',
      image_url: '',
      author: t('arib_dairy_team'),
      published: false,
    },
  });

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
    if (error) {
      toast.error('Failed to fetch blog posts', { description: error.message });
    } else {
      setBlogPosts(data || []);
    }
    setLoading(false);
  };

  const onSubmit = async (values: z.infer<typeof blogPostSchema>) => {
    setIsSubmitting(true);
    const imageUrl = values.image_url === '' ? null : values.image_url;

    try {
      const postData = {
        ...values,
        image_url: imageUrl,
      };

      if (currentPost) {
        const { error } = await supabase.from('blog_posts').update(postData).eq('id', currentPost.id);
        if (error) throw error;
        toast.success('Blog post updated successfully!');
      } else {
        const { error } = await supabase.from('blog_posts').insert([postData]);
        if (error) throw error;
        toast.success('Blog post added successfully!');
      }

      setIsDialogOpen(false);
      fetchBlogPosts();
    } catch (error: any) {
      toast.error('Operation Failed', { description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePost = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      const { error } = await supabase.from('blog_posts').delete().eq('id', id);
      if (error) {
        toast.error('Failed to delete blog post', { description: error.message });
      } else {
        toast.success('Blog post deleted successfully!');
        fetchBlogPosts();
      }
    }
  };

  const togglePublishStatus = async (post: BlogPost) => {
    const newStatus = !post.published;
    const { error } = await supabase.from('blog_posts').update({ published: newStatus }).eq('id', post.id);
    if (error) {
      toast.error('Failed to update publish status', { description: error.message });
    } else {
      toast.success(`Post ${newStatus ? 'published' : 'unpublished'} successfully!`);
      fetchBlogPosts();
    }
  };

  const openAddDialog = () => {
    setCurrentPost(null);
    form.reset({
      title_en: '', title_ar: '', title_fr: '',
      content_en: '', content_ar: '', content_fr: '',
      image_url: '', author: t('arib_dairy_team'), published: false
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (post: BlogPost) => {
    setCurrentPost(post);
    form.reset({
      ...post,
      image_url: post.image_url || '',
      title_ar: post.title_ar || '',
      title_fr: post.title_fr || '',
      content_ar: post.content_ar || '',
      content_fr: post.content_fr || '',
    });
    setIsDialogOpen(true);
  };

  const openPreviewDialog = (post: BlogPost) => {
    setCurrentPost(post);
    setIsPreviewOpen(true);
  };

  const quillModules = {
    toolbar: [['bold', 'italic', 'underline'], [{ 'list': 'ordered' }, { 'list': 'bullet' }], ['link'], ['clean']],
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-dairy-darkBlue">Blog Management</h1>
        <AnimatedButton onClick={openAddDialog} className="bg-dairy-blue text-white hover:bg-dairy-darkBlue" soundOnClick="/sounds/click.mp3">
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Post
        </AnimatedButton>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-dairy-blue" /></div>
      ) : (
        <div className="rounded-md border border-dairy-blue/20 bg-white shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader><TableRow className="bg-dairy-blue/10">
                <TableHead className="w-[80px] text-dairy-darkBlue">Image</TableHead>
                <TableHead className="text-dairy-darkBlue">Title (EN)</TableHead>
                <TableHead className="text-dairy-darkBlue">Author</TableHead>
                <TableHead className="text-dairy-darkBlue">Published</TableHead>
                <TableHead className="text-right text-dairy-darkBlue">Actions</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {blogPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>{post.image_url && <img src={post.image_url} alt={post.title_en} className="w-12 h-12 object-cover rounded-md" />}</TableCell>
                    <TableCell className="font-medium text-dairy-darkBlue">{post.title_en}</TableCell>
                    <TableCell className="text-dairy-text">{post.author}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => togglePublishStatus(post)} className={post.published ? "text-green-600 hover:text-green-700" : "text-red-600 hover:text-red-700"}>
                        {post.published ? <ToggleRight className="h-5 w-5" /> : <ToggleLeft className="h-5 w-5" />}
                      </Button>
                    </TableCell>
                    <TableCell className="text-right"><div className="flex justify-end space-x-2">
                      <AnimatedButton variant="outline" size="sm" onClick={() => openPreviewDialog(post)}><Eye className="h-4 w-4" /></AnimatedButton>
                      <AnimatedButton variant="outline" size="sm" onClick={() => openEditDialog(post)}><Edit className="h-4 w-4" /></AnimatedButton>
                      <AnimatedButton variant="destructive" size="sm" onClick={() => handleDeletePost(post.id)}><Trash2 className="h-4 w-4" /></AnimatedButton>
                    </div></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[800px] bg-dairy-cream border-dairy-blue/20 shadow-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-dairy-darkBlue">{currentPost ? 'Edit Blog Post' : 'Add New Blog Post'}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
              <FormField control={form.control} name="image_url" render={({ field }) => (<FormItem><FormLabel>Image URL</FormLabel><FormControl><Input placeholder="https://example.com/image.jpg" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="author" render={({ field }) => (<FormItem><FormLabel>Author</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              
              <Tabs defaultValue="en" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="en">English</TabsTrigger>
                  <TabsTrigger value="ar">Arabic</TabsTrigger>
                  <TabsTrigger value="fr">French</TabsTrigger>
                </TabsList>
                <TabsContent value="en" className="space-y-4 pt-4">
                  <FormField control={form.control} name="title_en" render={({ field }) => (<FormItem><FormLabel>Title (EN)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="content_en" render={({ field }) => (<FormItem><FormLabel>Content (EN)</FormLabel><FormControl><ReactQuill theme="snow" value={field.value} onChange={field.onChange} modules={quillModules} className="bg-white" /></FormControl><FormMessage /></FormItem>)} />
                </TabsContent>
                <TabsContent value="ar" className="space-y-4 pt-4">
                  <FormField control={form.control} name="title_ar" render={({ field }) => (<FormItem><FormLabel>Title (AR)</FormLabel><FormControl><Input {...field} dir="rtl" /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="content_ar" render={({ field }) => (<FormItem><FormLabel>Content (AR)</FormLabel><FormControl><ReactQuill theme="snow" value={field.value} onChange={field.onChange} modules={quillModules} className="bg-white" dir="rtl" /></FormControl><FormMessage /></FormItem>)} />
                </TabsContent>
                <TabsContent value="fr" className="space-y-4 pt-4">
                  <FormField control={form.control} name="title_fr" render={({ field }) => (<FormItem><FormLabel>Title (FR)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="content_fr" render={({ field }) => (<FormItem><FormLabel>Content (FR)</FormLabel><FormControl><ReactQuill theme="snow" value={field.value} onChange={field.onChange} modules={quillModules} className="bg-white" /></FormControl><FormMessage /></FormItem>)} />
                </TabsContent>
              </Tabs>

              <FormField control={form.control} name="published" render={({ field }) => (<FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mt-4"><FormLabel>Publish</FormLabel><FormControl><input type="checkbox" checked={field.value} onChange={field.onChange} className="h-5 w-5" /></FormControl></FormItem>)} />
              
              <DialogFooter>
                <AnimatedButton type="submit" className="bg-dairy-blue text-white hover:bg-dairy-darkBlue" disabled={isSubmitting}>
                  {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : (currentPost ? 'Save Changes' : 'Add Post')}
                </AnimatedButton>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-[800px] bg-dairy-cream border-dairy-blue/20 shadow-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-dairy-darkBlue">{currentPost?.title_en || 'Blog Post Preview'}</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-6">
            {currentPost?.image_url && <img src={currentPost.image_url} alt={currentPost.title_en} className="w-full h-64 object-cover rounded-md shadow-sm" />}
            <div className="prose max-w-none text-dairy-text" dangerouslySetInnerHTML={{ __html: currentPost?.content_en || '' }} />
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default BlogManagement;