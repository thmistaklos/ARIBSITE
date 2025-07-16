import React from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import AnimatedButton from '@/components/AnimatedButton';
import { toast } from 'sonner';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
});

const ContactPage: React.FC = () => {
  const { t } = useTranslation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    toast.success(t('your_message_sent'), {
      description: t('we_will_get_back'),
    });
    form.reset();
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      className="min-h-[calc(100vh-160px)] bg-dairy-cream text-dairy-text py-12 px-4"
    >
      <div className="container mx-auto max-w-4xl">
        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 100, damping: 10 }}
          className="text-4xl md:text-5xl font-bold text-center text-dairy-darkBlue mb-12"
        >
          {t('get_in_touch')}
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div variants={itemVariants} className="bg-white p-8 rounded-xl shadow-md border border-dairy-blue/20">
            <h2 className="text-2xl font-semibold text-dairy-darkBlue mb-6">{t('send_us_a_message')}</h2>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-dairy-text">{t('name')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('your_name_placeholder')} {...field} className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-dairy-text">{t('email')}</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder={t('your_email_placeholder')} {...field} className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-dairy-text">{t('message')}</FormLabel>
                      <FormControl>
                        <Textarea placeholder={t('your_message_placeholder')} {...field} rows={5} className="bg-dairy-cream/50 border-dairy-blue/30 focus-visible:ring-dairy-blue" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <AnimatedButton type="submit" className="w-full bg-dairy-blue text-white hover:bg-dairy-darkBlue" soundOnClick="/sounds/click.mp3">
                  {t('send_message')}
                </AnimatedButton>
              </form>
            </Form>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white p-8 rounded-xl shadow-md border border-dairy-blue/20">
            <h2 className="text-2xl font-semibold text-dairy-darkBlue mb-6">{t('contact_information')}</h2>
            <div className="space-y-6 text-lg text-dairy-text">
              <motion.div whileHover={{ x: 5 }} className="flex items-center space-x-4">
                <Mail className="text-dairy-blue flex-shrink-0" />
                <span>aribgiplait@gmail.com</span>
              </motion.div>
              <motion.div whileHover={{ x: 5 }} className="flex items-center space-x-4">
                <Phone className="text-dairy-blue flex-shrink-0" />
                <span>+213 670 106 308</span>
              </motion.div>
              <motion.div whileHover={{ x: 5 }} className="flex items-center space-x-4">
                <MapPin className="text-dairy-blue flex-shrink-0" />
                <span>{t('arib_address')}</span>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mt-8"
            >
              <img
                src="/images/map-placeholder.png" // Placeholder image for map
                alt="Our Location"
                className="w-full h-48 object-cover rounded-lg shadow-sm"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ContactPage;