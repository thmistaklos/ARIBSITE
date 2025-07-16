import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, ShoppingCart, Users, DollarSign } from 'lucide-react';

const DashboardOverview: React.FC = () => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      className="space-y-8"
    >
      <h1 className="text-3xl font-bold text-dairy-darkBlue">Admin Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <motion.div variants={cardVariants}>
          <Card className="bg-white border-dairy-blue/20 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-dairy-text">Total Sales</CardTitle>
              <DollarSign className="h-4 w-4 text-dairy-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-dairy-darkBlue">$45,231.89</div>
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={cardVariants}>
          <Card className="bg-white border-dairy-blue/20 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-dairy-text">Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-dairy-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-dairy-darkBlue">2,350</div>
              <p className="text-xs text-muted-foreground">+180.1% from last month</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={cardVariants}>
          <Card className="bg-white border-dairy-blue/20 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-dairy-text">Products</CardTitle>
              <Package className="h-4 w-4 text-dairy-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-dairy-darkBlue">12</div>
              <p className="text-xs text-muted-foreground">Total active products</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={cardVariants}>
          <Card className="bg-white border-dairy-blue/20 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-dairy-text">Users</CardTitle>
              <Users className="h-4 w-4 text-dairy-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-dairy-darkBlue">573</div>
              <p className="text-xs text-muted-foreground">+19% from last month</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Placeholder for charts */}
      <motion.div variants={cardVariants}>
        <Card className="bg-white border-dairy-blue/20 shadow-md">
          <CardHeader>
            <CardTitle className="text-dairy-darkBlue">Revenue Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-dairy-text">
              [Chart.js or Recharts Placeholder]
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default DashboardOverview;