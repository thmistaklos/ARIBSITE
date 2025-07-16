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

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string; // Still stores the URL
}

const ProductsManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [formState, setFormState] = useState({
    name: '',
    description: '',
    price: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // New state for the file object
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null); // New state for image preview
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('products').select('*').order('name', { ascending: true });
    if (error) {
      toast.error('Failed to fetch products', { description: error.message });
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setImagePreviewUrl(URL.createObjectURL(file)); // Create a preview URL for the selected file
    } else {
      setSelectedFile(null);
      // If no file is selected, revert preview to current product's image or null
      setImagePreviewUrl(currentProduct?.image || null);
    }
  };

  const handleAddEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    let imageUrl = currentProduct?.image || ''; // Start with existing image URL if editing

    try {
      if (selectedFile) {
        // Upload new image if a file is selected
        const fileExtension = selectedFile.name.split('.').pop();
        const fileName = `${Date.now()}-${selectedFile.name}`; // Unique file name
        const filePath = `product-images/${fileName}`; // Assuming 'product-images' is your bucket name

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, selectedFile, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) {
          throw uploadError;
        }

        const { data: publicUrlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        imageUrl = publicUrlData.publicUrl;
      } else if (!currentProduct && !imageUrl) {
        // If adding a new product and no file is selected, require an image
        toast.error('Image required', { description: 'Please upload an image for the new product.' });
        setIsSubmitting(false);
        return;
      }

      const productData = {
        name: formState.name,
        description: formState.description,
        price: formState.price,
        image: imageUrl, // Use the obtained URL
      };

      if (currentProduct) {
        // Edit product
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', currentProduct.id);

        if (error) {
          throw error;
        }
        toast.success('Product updated successfully!');
      } else {
        // Add new product
        const { error } = await supabase
          .from('products')
          .insert([productData]);

        if (error) {
          throw error;
        }
        toast.success('Product added successfully!');
      }

      setIsDialogOpen(false);
      fetchProducts();
    } catch (error: any) {
      toast.error('Operation Failed', { description: error.message });
    } finally {
      setIsSubmitting(false);
      setSelectedFile(null); // Clear selected file after submission
      setImagePreviewUrl(null); // Clear preview
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) {
        toast.error('Failed to delete product', { description: error.message });
      } else {
        toast.success('Product deleted successfully!');
        fetchProducts();
      }
    }
  };

  const openAddDialog = () => {
    setCurrentProduct(null);
    setFormState({ name: '', description: '', price: '' });
    setSelectedFile(null); // Clear file
    setImagePreviewUrl(null); // Clear preview
    setIsDialogOpen(true);
  };

  const openEditDialog = (product: Product) => {
    setCurrentProduct(product);
    setFormState({
      name: product.name,
      description: product.description,
      price: product.price,
    });
    setSelectedFile(null); // No new file selected initially for edit
    setImagePreviewUrl(product.image); // Show existing image
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
        <h1 className="text-3xl font-bold text-dairy-darkBlue">Products Management</h1>
        <AnimatedButton onClick={openAddDialog} className="bg-dairy-blue text-white hover:bg-dairy-darkBlue" soundOnClick="/sounds/click.mp3">
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Product
        </AnimatedButton>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-dairy-blue" />
        </div>
      ) : (
        <div className="rounded-md border border-dairy-blue/20 bg-white shadow-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-dairy-blue/10">
                <TableHead className="w-[100px] text-dairy-darkBlue">Image</TableHead>
                <TableHead className="text-dairy-darkBlue">Name</TableHead>
                <TableHead className="text-dairy-darkBlue">Description</TableHead>
                <TableHead className="text-dairy-darkBlue">Price</TableHead>
                <TableHead className="text-right text-dairy-darkBlue">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-dairy-text">
                    No products found.
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded-md" />
                    </TableCell>
                    <TableCell className="font-medium text-dairy-darkBlue">{product.name}</TableCell>
                    <TableCell className="text-dairy-text">{product.description}</TableCell>
                    <TableCell className="text-dairy-blue font-semibold">{product.price}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <AnimatedButton variant="outline" size="sm" onClick={() => openEditDialog(product)} soundOnClick="/sounds/click.mp3">
                          <Edit className="h-4 w-4" />
                        </AnimatedButton>
                        <AnimatedButton variant="destructive" size="sm" onClick={() => handleDeleteProduct(product.id)} soundOnClick="/sounds/click.mp3">
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
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] bg-dairy-cream border-dairy-blue/20 shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-dairy-darkBlue">{currentProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            <DialogDescription className="text-dairy-text">
              {currentProduct ? 'Make changes to your product here.' : 'Add a new product to your inventory.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddEditProduct} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right text-dairy-text">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                value={formState.name}
                onChange={handleInputChange}
                className="col-span-3 bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right text-dairy-text">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formState.description}
                onChange={handleInputChange}
                className="col-span-3 bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right text-dairy-text">
                Price
              </Label>
              <Input
                id="price"
                name="price"
                value={formState.price}
                onChange={handleInputChange}
                className="col-span-3 bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image" className="text-right text-dairy-text">
                Image
              </Label>
              <div className="col-span-3 flex flex-col gap-2">
                <Input
                  id="image"
                  name="image"
                  type="file"
                  onChange={handleFileChange}
                  className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue"
                  accept="image/*" // Restrict to image files
                />
                {imagePreviewUrl && (
                  <img src={imagePreviewUrl} alt="Image Preview" className="w-24 h-24 object-cover rounded-md mt-2" />
                )}
                {!selectedFile && currentProduct?.image && (
                  <p className="text-xs text-muted-foreground mt-1">Current image will be used if no new file is selected.</p>
                )}
              </div>
            </div>
            <DialogFooter>
              <AnimatedButton type="submit" className="bg-dairy-blue text-white hover:bg-dairy-darkBlue" soundOnClick="/sounds/click.mp3" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {currentProduct ? 'Saving...' : 'Adding...'}
                  </>
                ) : (
                  currentProduct ? 'Save Changes' : 'Add Product'
                )}
              </AnimatedButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default ProductsManagement;