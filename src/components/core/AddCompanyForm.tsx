import { useState } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { MoreVertical } from 'lucide-react';
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

interface Company {
  id: number;
  name: string;
  nameAm: string;
 
}

const mockCompanies: Company[] = [
  {
    id: 1,
    name: 'Rohobot Tech',
    nameAm: 'ሮሆቦት ቴክ',
  
  },
  {
    id: 2,
    name: 'Rohobot Group',
    nameAm: 'ሮሆቦት ግሩፕ',
  
  },
  {
    id: 3,
    name: 'EthioDev',
    nameAm: 'ኢትዮዴቭ',

  },
];

interface AddCompanyFormProps {
  onClick: () => void;
}
const AddCompanyForm: React.FC<AddCompanyFormProps> = ({ onClick }) => {  const [companies, setCompanies] = useState<Company[]>(mockCompanies);
  const [openDialog, setOpenDialog] = useState(false);
  const [newCompany, setNewCompany] = useState({ name: '', nameAm: '' });
  const [editCompany, setEditCompany] = useState<Company | null>(null);

  const amharicRegex = /^[\u1200-\u137F\u1380-\u139F\u2D80-\u2DDF\s]*$/;

  const handleAmharicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (amharicRegex.test(value)) {
      setNewCompany((prev) => ({ ...prev, nameAm: value }));
    }
  };

  const handleSubmit = () => {
    if (!newCompany.name || !newCompany.nameAm) return;
    const id = companies.length + 1;
    const entry: Company = {
      id,
      name: newCompany.name,
      nameAm: newCompany.nameAm,
    
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Companies</h2>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button className="bg-green-100 text-green-700 hover:bg-green-200 transition-colors">
              Add Company
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Company</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div>
                <Label htmlFor="nameAm">የኩባንያው ስም</Label>
                <Input
                  id="nameAm"
                  value={newCompany.nameAm}
                  onChange={handleAmharicChange}
                  placeholder="ሮሆቦት ቴክ"
                />
              </div>
              <div>
                <Label htmlFor="name">Company Name</Label>
                <Input
                  id="name"
                  value={newCompany.name}
                  onChange={(e) =>
                    setNewCompany((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Rohobot Tech"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={handleSubmit}>
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
                <h4 className="text-md font-semibold text-black">{company.nameAm}</h4>
                <p className="text-sm text-gray-600">{company.name}</p>
              </div>
           

              <div className="flex justify-between items-center">
                <Button
                  className="text-green-600 bg-green-50 hover:bg-green-100"
                  size="sm"
                  onClick={onClick}>View Details</Button>
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
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Company</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div>
                <Label htmlFor="editNameAm">የኩባንያው ስም</Label>
                <Input
                  id="editNameAm"
                  value={editCompany.nameAm}
                  onChange={(e) =>
                    setEditCompany((prev) => ({ ...prev!, nameAm: e.target.value }))
                  }
                />
              </div>
              <div>
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
                className="bg-green-600 text-white hover:bg-green-700"
              >
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AddCompanyForm;
