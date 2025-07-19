import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { PlusCircle, Edit, Trash2, Loader2, Eye, ToggleLeft, ToggleRight } from 'lucide-react';
import AnimatedButton from '@/components/AnimatedButton';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'; // Import Form components

interface BlogPost {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  author: string;
  published: boolean;
  created_at: string;
}

const blogPostSchema = z.object({
  title: z.string().min(2, { message: 'Title must be at least 2 characters.' }),
  content: z.string().min(10, { message: 'Content must be at least 10 characters.' }),
  image_url: z.string().url({ message: 'Must be a valid URL or empty.' }).nullable().optional().or(z.literal('')), // Changed to accept URL or empty string
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

  const form = useForm<z.infer<typeof blogPostSchema>>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: '',
      content: '',
      image_url: '', // Initialize as empty string for URL input
      author: '',
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

  // Removed handleFileChange as we are now using URL input

  const onSubmit = async (values: z.infer<typeof blogPostSchema>) => {
    setIsSubmitting(true);
    // Directly use the image_url from form values, convert empty string to null if needed by DB schema
    const imageUrl = values.image_url === '' ? null : values.image_url;

    try {
      const postData = {
        title: values.title,
        content: values.content,
        image_url: imageUrl, // Use the URL directly
        author: values.author,
        published: values.published,
      };

      if (currentPost) {
        const { error } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', currentPost.id);

        if (error) {
          throw error;
        }
        toast.success('Blog post updated successfully!');
      } else {
        const { error } = await supabase
          .from('blog_posts')
          .insert([postData]);

        if (error) {
          throw error;
        }
        toast.success('Blog post added successfully!');
      }

      setIsDialogOpen(false);
      fetchBlogPosts();
    } catch (error: any) {
      toast.error('Operation Failed', { description: error.message });
    } finally {
      setIsSubmitting(false);
      // No file to clear
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
    const { error } = await supabase
      .from('blog_posts')
      .update({ published: newStatus })
      .eq('id', post.id);

    if (error) {
      toast.error('Failed to update publish status', { description: error.message });
    } else {
      toast.success(`Post ${newStatus ? 'published' : 'unpublished'} successfully!`);
      fetchBlogPosts();
    }
  };

  const openAddDialog = () => {
    setCurrentPost(null);
    form.reset({ title: '', content: '', image_url: '', author: '', published: false }); // Reset image_url to empty string
    setIsDialogOpen(true);
  };

  const openEditDialog = (post: BlogPost) => {
    setCurrentPost(post);
    form.reset({ ...post, image_url: post.image_url || '' }); // Ensure image_url is string for input
    setIsDialogOpen(true);
  };

  const openPreviewDialog = (post: BlogPost) => {
    setCurrentPost(post);
    setIsPreviewOpen(true);
  };

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      ['link', 'image'],
      ['clean']
    ],
  };

  const quillFormats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
  ];

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
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-dairy-blue" />
        </div>
      ) : (
        <div className="rounded-md border border-dairy-blue/20 bg-white shadow-md overflow-hidden">
          <div className="overflow-x-auto"> {/* Added for horizontal scrolling */}
            <Table>
              <TableHeader>
                <TableRow className="bg-dairy-blue/10">
                  <TableHead className="w-[80px] text-dairy-darkBlue">Image</TableHead>
                  <TableHead className="text-dairy-darkBlue">Title</TableHead>
                  <TableHead className="text-dairy-darkBlue">Author</TableHead>
                  <TableHead className="text-dairy-darkBlue">Published</TableHead>
                  <TableHead className="text-right text-dairy-darkBlue">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {blogPosts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-dairy-text">
                      No blog posts found.
                    </TableCell>
                  </TableRow>
                ) : (
                  blogPosts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell>
                        {post.image_url && (
                          <img src={post.image_url} alt={post.title} className="w-12 h-12 object-cover rounded-md" />
                        )}
                      </TableCell>
                      <TableCell className="font-medium text-dairy-darkBlue">{post.title}</TableCell>
                      <TableCell className="text-dairy-text">{post.author}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => togglePublishStatus(post)}
                          className={post.published ? "text-green-600 hover:text-green-700" : "text-red-600 hover:text-red-700"}
                        >
                          {post.published ? <ToggleRight className="h-5 w-5" /> : <ToggleLeft className="h-5 w-5" />}
                        </Button>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <AnimatedButton variant="outline" size="sm" onClick={() => openPreviewDialog(post)} soundOnClick="/sounds/click.mp3">
                            <Eye className="h-4 w-4" />
                          </AnimatedButton>
                          <AnimatedButton variant="outline" size="sm" onClick={() => openEditDialog(post)} soundOnClick="/sounds/click.mp3">
                            <Edit className="h-4 w-4" />
                          </AnimatedButton>
                          <AnimatedButton variant="destructive" size="sm" onClick={() => handleDeletePost(post.id)} soundOnClick="/sounds/click.mp3">
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
            <DialogTitle className="text-dairy-darkBlue">{currentPost ? 'Edit Blog Post' : 'Add New Blog Post'}</DialogTitle>
            <DialogDescription className="text-dairy-text">
              {currentPost ? 'Make changes to the blog post here.' : 'Create a new blog post.'}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}> {/* Wrapped the form with Form component */}
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                    <FormLabel className="md:text-right text-dairy-text">Title</FormLabel>
                    <FormControl className="md:col-span-3">
                      <Input {...field} className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue" />
                    </FormControl>
                    <FormMessage className="md:col-span-4 md:col-start-2" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                    <FormLabel className="md:text-right text-dairy-text">Author</FormLabel>
                    <FormControl className="md:col-span-3">
                      <Input {...field} className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue" />
                    </FormControl>
                    <FormMessage className="md:col-span-4 md:col-start-2" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image_url" // Changed to image_url
                render={({ field }) => (
                  <FormItem className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                    <FormLabel className="md:text-right text-dairy-text">Image URL</FormLabel> {/* Changed label */}
                    <FormControl className="md:col-span-3">
                      <Input
                        type="text" // Changed type to text
                        placeholder="e.g., https://example.com/image.jpg" // Added placeholder
                        {...field}
                        className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue"
                      />
                    </FormControl>
                    <FormMessage className="md:col-span-4 md:col-start-2" />
                  </FormItem>
                )}
              />
              {form.watch('image_url') && ( // Preview based on watched URL
                <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                  <Label className="md:text-right text-dairy-text">Preview</Label>
                  <div className="md:col-span-3 flex flex-col gap-2">
                    {/\.(jpeg|jpg|gif|png|svg|webp)$/i.test(form.watch('image_url') || '') ? (
                      <img src={form.watch('image_url') || ''} alt="Post Image Preview" className="w-24 h-24 object-cover rounded-md mt-2" />
                    ) : (
                      <p className="text-red-500 text-sm">Invalid image URL format.</p>
                    )}
                  </div>
                </div>
              )}
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-1 md:grid-cols-4 items-start gap-4">
                    <FormLabel className="md:text-right text-dairy-text">Content</FormLabel>
                    <FormControl className="md:col-span-3">
                      <ReactQuill
                        theme="snow"
                        value={field.value}
                        onChange={field.onChange}
                        modules={quillModules}
                        formats={quillFormats}
                        className="bg-white rounded-md"
                      />
                    </FormControl>
                    <FormMessage className="md:col-span-4 md:col-start-2" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="published"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                    <FormLabel className="md:text-right text-dairy-text">Publish</FormLabel>
                    <FormControl className="md:col-span-3">
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="h-5 w-5 text-dairy-blue focus:ring-dairy-blue border-gray-300 rounded"
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
                      {currentPost ? 'Saving...' : 'Adding...'}
                    </>
                  ) : (
                    currentPost ? 'Save Changes' : 'Add Post'
                  )}
                </AnimatedButton>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Blog Post Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-[800px] bg-dairy-cream border-dairy-blue/20 shadow-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-dairy-darkBlue">{currentPost?.title || 'Blog Post Preview'}</DialogTitle>
            <DialogDescription className="text-dairy-text">
              By {currentPost?.author} - {currentPost?.published ? 'Published' : 'Draft'}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-6">
            {currentPost?.image_url && (
              <img src={currentPost.image_url} alt={currentPost.title} className="w-full h-64 object-cover rounded-md shadow-sm" />
            )}
            <div className="prose max-w-none text-dairy-text" dangerouslySetInnerHTML={{ __html: currentPost?.content || '' }} />
          </div>
          <DialogFooter>
            <Button onClick={() => setIsPreviewOpen(false)} className="bg-dairy-blue text-white hover:bg-dairy-darkBlue">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default BlogManagement;