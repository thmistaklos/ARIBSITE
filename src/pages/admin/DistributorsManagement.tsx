import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { PlusCircle, Edit, Trash2, Loader2, Search } from 'lucide-react';
import AnimatedButton from '@/components/AnimatedButton';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

interface Distributor {
  id: string;
  name: string;
  location: string; // Changed from 'region' to 'location'
  phone: string;
  email: string;
  address: string;
  logo_url: string | null;
}

const distributorSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  location: z.string().min(2, { message: 'Location must be at least 2 characters.' }), // Changed from 'region' to 'location'
  phone: z.string().min(7, { message: 'Phone must be at least 7 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  address: z.string().min(5, { message: 'Address must be at least 5 characters.' }),
  logo_url: z.string().url().nullable().optional(),
});

const DistributorsManagement: React.FC = () => {
  const [distributors, setDistributors] = useState<Distributor[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentDistributor, setCurrentDistributor] = useState<Distributor | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const form = useForm<z.infer<typeof distributorSchema>>({
    resolver: zodResolver(distributorSchema),
    defaultValues: {
      name: '',
      location: '', // Changed from 'region' to 'location'
      phone: '',
      email: '',
      address: '',
      logo_url: null,
    },
  });

  useEffect(() => {
    fetchDistributors();
  }, []);

  const fetchDistributors = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('distributors').select('*').order('name', { ascending: true });
    if (error) {
      toast.error('Failed to fetch distributors', { description: error.message });
    } else {
      setDistributors(data || []);
    }
    setLoading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setImagePreviewUrl(URL.createObjectURL(file));
    } else {
      setSelectedFile(null);
      setImagePreviewUrl(currentDistributor?.logo_url || null);
    }
  };

  const handleAddEditDistributor = async (values: z.infer<typeof distributorSchema>) => { // Renamed function
    setIsSubmitting(true);
    let logoUrl = currentDistributor?.logo_url || null;

    try {
      if (selectedFile) {
        const fileName = `${Date.now()}-${selectedFile.name}`;
        const filePath = `distributor-logos/${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('distributor-logos')
          .upload(filePath, selectedFile, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) {
          throw uploadError;
        }

        const { data: publicUrlData } = supabase.storage
          .from('distributor-logos')
          .getPublicUrl(filePath);

        logoUrl = publicUrlData.publicUrl;
      } else if (!currentDistributor && !logoUrl) {
        toast.error('Logo required', { description: 'Please upload a logo for the new distributor.' });
        setIsSubmitting(false);
        return;
      }

      const distributorData = {
        name: values.name,
        location: values.location, // Changed from 'region' to 'location'
        phone: values.phone,
        email: values.email,
        address: values.address,
        logo_url: logoUrl,
      };

      if (currentDistributor) {
        const { error } = await supabase
          .from('distributors')
          .update(distributorData)
          .eq('id', currentDistributor.id);

        if (error) {
          throw error;
        }
        toast.success('Distributor updated successfully!');
      } else {
        const { error } = await supabase
          .from('distributors')
          .insert([distributorData]);

        if (error) {
          throw error;
        }
        toast.success('Distributor added successfully!');
      }

      setIsDialogOpen(false);
      fetchDistributors();
    } catch (error: any) {
      toast.error('Operation Failed', { description: error.message });
    } finally {
      setIsSubmitting(false);
      setSelectedFile(null);
      setImagePreviewUrl(null);
    }
  };

  const handleDeleteDistributor = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this distributor?')) {
      const { error } = await supabase.from('distributors').delete().eq('id', id);
      if (error) {
        toast.error('Failed to delete distributor', { description: error.message });
      } else {
        toast.success('Distributor deleted successfully!');
        fetchDistributors();
      }
    }
  };

  const openAddDialog = () => {
    setCurrentDistributor(null);
    form.reset({ name: '', location: '', phone: '', email: '', address: '', logo_url: null }); // Changed from 'region' to 'location'
    setSelectedFile(null);
    setImagePreviewUrl(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (distributor: Distributor) => {
    setCurrentDistributor(distributor);
    form.reset(distributor);
    setSelectedFile(null);
    setImagePreviewUrl(distributor.logo_url);
    setIsDialogOpen(true);
  };

  const filteredDistributors = distributors.filter(distributor =>
    distributor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    distributor.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    distributor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-dairy-darkBlue">Distributors Management</h1>
        <AnimatedButton onClick={openAddDialog} className="bg-dairy-blue text-white hover:bg-dairy-darkBlue" soundOnClick="/sounds/click.mp3">
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Distributor
        </AnimatedButton>
      </div>

      <div className="relative max-w-md">
        <Input
          type="text"
          placeholder="Search distributors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg border-2 border-dairy-blue/30 bg-white text-dairy-darkBlue focus-visible:ring-dairy-blue focus-visible:ring-offset-0"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-dairy-blue" />
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
                <TableHead className="w-[80px] text-dairy-darkBlue">Logo</TableHead>
                <TableHead className="text-dairy-darkBlue">Name</TableHead>
                <TableHead className="text-dairy-darkBlue">Location</TableHead> {/* Changed from 'Region' to 'Location' */}
                <TableHead className="text-dairy-darkBlue">Contact</TableHead>
                <TableHead className="text-right text-dairy-darkBlue">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDistributors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-dairy-text">
                    No distributors found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredDistributors.map((distributor) => (
                  <TableRow key={distributor.id}>
                    <TableCell>
                      {distributor.logo_url && (
                        <img src={distributor.logo_url} alt={distributor.name} className="w-12 h-12 object-contain rounded-md" />
                      )}
                    </TableCell>
                    <TableCell className="font-medium text-dairy-darkBlue">{distributor.name}</TableCell>
                    <TableCell className="text-dairy-text">{distributor.location}</TableCell> {/* Changed from 'region' to 'location' */}
                    <TableCell className="text-dairy-text">
                      <p>{distributor.email}</p>
                      <p>{distributor.phone}</p>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <AnimatedButton variant="outline" size="sm" onClick={() => openEditDialog(distributor)} soundOnClick="/sounds/click.mp3">
                          <Edit className="h-4 w-4" />
                        </AnimatedButton>
                        <AnimatedButton variant="destructive" size="sm" onClick={() => handleDeleteDistributor(distributor.id)} soundOnClick="/sounds/click.mp3">
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
            <DialogTitle className="text-dairy-darkBlue">{currentDistributor ? 'Edit Distributor' : 'Add New Distributor'}</DialogTitle>
            <DialogDescription className="text-dairy-text">
              {currentDistributor ? 'Make changes to the distributor details here.' : 'Add a new distributor to your list.'}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddEditDistributor)} className="grid gap-4 py-4"> {/* Updated onSubmit handler */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right text-dairy-text">Name</FormLabel>
                    <FormControl className="col-span-3">
                      <Input {...field} className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue" />
                    </FormControl>
                    <FormMessage className="col-span-4 col-start-2" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location" // Changed from 'region' to 'location'
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right text-dairy-text">Location</FormLabel> {/* Changed from 'Region' to 'Location' */}
                    <FormControl className="col-span-3">
                      <Input {...field} className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue" />
                    </FormControl>
                    <FormMessage className="col-span-4 col-start-2" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right text-dairy-text">Phone</FormLabel>
                    <FormControl className="col-span-3">
                      <Input {...field} className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue" />
                    </FormControl>
                    <FormMessage className="col-span-4 col-start-2" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right text-dairy-text">Email</FormLabel>
                    <FormControl className="col-span-3">
                      <Input type="email" {...field} className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue" />
                    </FormControl>
                    <FormMessage className="col-span-4 col-start-2" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right text-dairy-text">Address</FormLabel>
                    <FormControl className="col-span-3">
                      <Input {...field} className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue" />
                    </FormControl>
                    <FormMessage className="col-span-4 col-start-2" />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="logo" className="text-right text-dairy-text">
                  Logo
                </Label>
                <div className="col-span-3 flex flex-col gap-2">
                  <Input
                    id="logo"
                    name="logo"
                    type="file"
                    onChange={handleFileChange}
                    className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue"
                    accept="image/*"
                  />
                  {imagePreviewUrl && (
                    <img src={imagePreviewUrl} alt="Logo Preview" className="w-24 h-24 object-contain rounded-md mt-2" />
                  )}
                  {!selectedFile && currentDistributor?.logo_url && (
                    <p className="text-xs text-muted-foreground mt-1">Current logo will be used if no new file is selected.</p>
                  )}
                </div>
              </div>
              <DialogFooter>
                <AnimatedButton type="submit" className="bg-dairy-blue text-white hover:bg-dairy-darkBlue" soundOnClick="/sounds/click.mp3" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {currentDistributor ? 'Saving...' : 'Adding...'}
                    </>
                  ) : (
                    currentDistributor ? 'Save Changes' : 'Add Distributor'
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

export default DistributorsManagement;