import { motion } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import UsersTab from './UsersTab';
import InventoryTab from './InventoryTab';
import FinancialsTab from './FinancialsTab';
import SettingsTab from './SettingsTab';
import { DollarSign, Package, Settings, Users } from 'lucide-react';

const BranchTabs = () => {
  return (
    <motion.div variants={itemVariants}>
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users">
            <Users className="h-4 w-4 mr-2" />
            Users
          </TabsTrigger>
          <TabsTrigger value="inventory">
            <Package className="h-4 w-4 mr-2" />
            Inventory
          </TabsTrigger>
          <TabsTrigger value="financials">
            <DollarSign className="h-4 w-4 mr-2" />
            Financials
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="users">
          <UsersTab />
        </TabsContent>
        
        <TabsContent value="inventory">
          <InventoryTab />
        </TabsContent>
        
        <TabsContent value="financials">
          <FinancialsTab />
        </TabsContent>
        
        <TabsContent value="settings">
          <SettingsTab />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1, 
    transition: { 
      type: 'spring', 
      stiffness: 260, 
      damping: 20 
    }
  }
};

export default BranchTabs;