import { useState } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { MapPin, MoreVertical, Plus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '../../components/ui/dropdown-menu';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { motion } from 'framer-motion';
import DialogOverlay from '../ui/dialog-overlay';
import { companies as importedCompanies } from '../../data/company-branches';
import type { Company } from '../../data/company-branches';

interface AddCompanyFormProps {
  onClick: (companyId: number) => void;
}

const AddCompanyForm: React.FC<AddCompanyFormProps> = ({ onClick }) => {
  const [companies, setCompanies] = useState<Company[]>(importedCompanies);
  const [openDialog, setOpenDialog] = useState(false);
  const [newCompany, setNewCompany] = useState({ name: '', nameAm: '' });
  const [editCompany, setEditCompany] = useState<Company | null>(null);
  const [viewingBranches, setViewingBranches] = useState<{companyId: number, branches: Branch[]} | null>(null);

  const amharicRegex = /^[\u1200-\u137F\u1380-\u139F\u2D80-\u2DDF\s]*$/;

  const handleAmharicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (amharicRegex.test(value)) {
      setNewCompany((prev) => ({ ...prev, nameAm: value }));
    }
  };

  const handleSubmit = () => {
    if (!newCompany.name || !newCompany.nameAm) return;
    const id = companies.length > 0 ? Math.max(...companies.map(c => c.id)) + 1 : 1;
    const entry: Company = {
      id,
      name: newCompany.name,
      nameAm: newCompany.nameAm,
      branches: []
    };
    setCompanies((prev) => [...prev, entry]);
    setNewCompany({ name: '', nameAm: '' });
    setOpenDialog(false);
  };

  const handleEditSave = () => {
    if (!editCompany) return;
    setCompanies((prev) =>
      prev.map((comp) => (comp.id === editCompany.id ? editCompany : comp))
    );
    setEditCompany(null);
  };

  const handleViewBranches = (companyId: number) => {
    const company = companies.find(c => c.id === companyId);
    if (company) {
      setViewingBranches({
        companyId,
        branches: company.branches
      });
      onClick(companyId);
    }
  };

  const handleBackToCompanies = () => {
    setViewingBranches(null);
  };


  if (viewingBranches) {
    const company = companies.find(c => c.id === viewingBranches.companyId);
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            Branches of {company?.name}
          </h2>
          <Button 
            onClick={handleBackToCompanies}
            variant="outline"
          >
            Back to Companies
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {viewingBranches.branches.map((branch) => (
            <Card key={branch.id} className="p-4 space-y-3">
              <h4 className="text-md font-semibold">{branch.name}</h4>
              <p className="text-sm text-gray-600">ID: {branch.branchId}</p>
              <div className="flex items-center text-sm">
                <MapPin className="mr-2 h-4 w-4" />
                {branch.city}, {branch.country}
              </div>
              <div className="flex items-center text-sm">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  branch.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 
                  branch.status === 'inactive' ? 'bg-red-100 text-red-800' : 
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {branch.status}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
      <motion.h1 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-500 to-emerald-700 bg-clip-text text-transparent dark:text-white"
      >Companies
      </motion.h1>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button  type="submit"
              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:bg-emerald-700 rounded-md text-white flex items-center gap-2 cursor-pointer"
            >
              <Plus size={18} />
              Add Company
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Company</DialogTitle>
            </DialogHeader>
            <div className="grid grid-row-2 gap-4 py-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="nameAm">የኩባንያው ስም</Label>
                <input
                  id="nameAm"
                  value={newCompany.nameAm}
                  onChange={handleAmharicChange}
                  placeholder="ምሳሌ፡ አክሜ ኢንት"
                  className={`w-full px-3 py-2 focus:outline-none focus:border-emerald-500 focus:outline-2 border rounded-md`} 
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Company Name</Label>
                <input
                  id="name"
                  value={newCompany.name}
                  onChange={(e) =>
                    setNewCompany((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className={`w-full px-3 py-2 focus:outline-none focus:border-emerald-500 focus:outline-2 border rounded-md`} 
                  placeholder="Eg. Acme int"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer" onClick={handleSubmit}
              >
                Save
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>


      {/* Cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.05 },
          },
        }}
      >
        {companies.map((company) => (
          <motion.div
            key={company.id}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <Card className="relative rounded-xl border border-gray-200 shadow-sm p-4 space-y-3 transition hover:shadow-md">
              <div>
                <h4 className="text-md font-semibold text-black ">{company.nameAm}</h4>
                <p className="text-sm text-gray-600 ">{company.name}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {company.branches?.length || 0} branches
                </p>
              </div>

              <div className="flex justify-between items-center">
                <Button
                  className="text-emerald-600 bg-emerald-50 hover:bg-emerald-100 cursor-pointer"
                  size="sm"
                  onClick={() => handleViewBranches(company.id)}
                  disabled={!company.branches || company.branches.length === 0}
                >
                  View Branches
                </Button>
              </div>

              <div className="absolute top-2 right-2 z-10">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <MoreVertical className="w-4 h-4 text-gray-500" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {
                        setEditCompany(company);
                      }}
                    >
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        setCompanies((prev) => prev.filter((c) => c.id !== company.id))
                      }
                      className="text-red-500"
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>


      {/* Edit Dialog */}
      {editCompany && (
        <Dialog open={true} onOpenChange={() => setEditCompany(null)}>
          <DialogOverlay>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Edit Company</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className='flex gap-4 flex-col'>
                  <Label htmlFor="editNameAm">የኩባንያው ስም</Label>
                  <Input
                    id="editNameAm"
                    value={editCompany.nameAm}
                    onChange={(e) =>
                      setEditCompany((prev) => ({ ...prev!, nameAm: e.target.value }))
                    }
                  />
                </div>
                <div className='flex gap-4 flex-col'>
                  <Label htmlFor="editName">Company Name</Label>
                  <Input
                    id="editName"
                    value={editCompany.name}
                    onChange={(e) =>
                      setEditCompany((prev) => ({ ...prev!, name: e.target.value }))
                    }
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={handleEditSave}
                  className="bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer"
                >
                  Save Changes
                </Button>
              </div>
            </DialogContent>
          </DialogOverlay>
        </Dialog>
      )}
    </div>
  );
};

export default AddCompanyForm;
