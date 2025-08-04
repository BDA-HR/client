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
  manager: string;
  budget: string;
  employees: number;
  branches: number;
}

const mockCompanies: Company[] = [
  {
    id: 1,
    name: 'Rohobot Tech',
    nameAm: 'ሮሆቦት ቴክ',
    manager: 'John doe',
    budget: '1.2M ETB',
    employees: 50,
    branches: 3,
  },
  {
    id: 2,
    name: 'Rohobot Group',
    nameAm: 'ሮሆቦት ግሩፕ',
    manager: 'anonymous',
    budget: '850K ETB',
    employees: 35,
    branches: 2,
  },
  {
    id: 3,
    name: 'EthioDev',
    nameAm: 'ኢትዮዴቭ',
    manager: 'ethioo',
    budget: '950K ETB',
    employees: 42,
    branches: 4,
  },
];
interface AddCompanyFormProps {
  onClick: () => void;
}
const AddCompanyForm: React.FC<AddCompanyFormProps> = ({ onClick }) => {
  const [companies, setCompanies] = useState<Company[]>(mockCompanies);
  const [newCompany, setNewCompany] = useState({ name: '', nameAm: '' });
  const [openDialog, setOpenDialog] = useState(false);
  const [viewCompany, setViewCompany] = useState<Company | null>(null);

  const amharicRegex = /^[\u1200-\u137F\u1380-\u139F\u2D80-\u2DDF\s]*$/;

  const handleAmharicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (amharicRegex.test(value)) {
      setNewCompany((prev) => ({ ...prev, nameAm: value }));
    }
  };

  const handleSubmit = () => {
    const id = companies.length + 1;
    const newEntry: Company = {
      id,
      name: newCompany.name,
      nameAm: newCompany.nameAm,
      manager: 'To be assigned',
      budget: '0 ETB',
      employees: 0,
      branches: 0,
    };
    setCompanies((prev) => [...prev, newEntry]);
    setNewCompany({ name: '', nameAm: '' });
    setOpenDialog(false);
  };
// const [editCompany, setEditCompany] = useState<Company | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Companies</h2>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button className="bg-green-100 text-green-700 hover:bg-green-200 transition-colors">
              Add Company
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Company</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Company Name
                </Label>
                <Input
                  id="name"
                  value={newCompany.name}
                  onChange={(e) =>
                    setNewCompany((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="col-span-3"
                  placeholder="e.g. Rohobot Tech"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nameAm" className="text-right">
                  የኩባንያው ስም
                </Label>
                <Input
                  id="nameAm"
                  value={newCompany.nameAm}
                  onChange={handleAmharicChange}
                  className="col-span-3"
                  placeholder="ሮሆቦት ቴክ"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleSubmit}>Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.05,
            },
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
              <div className="flex justify-between items-start">
                <div className="flex gap-3 items-center">
                  <div className="p-2 rounded-full bg-blue-100">
                    <span className="text-blue-600 font-bold text-lg">🏢</span>
                  </div>
                  <div>
                    <h4 className="text-md font-semibold leading-none">
                      {company.name}
                    </h4>
                    <p className="text-sm text-gray-500">{company.nameAm}</p>
                  </div>
                </div>
                <div className="text-sm px-2 py-1 bg-gray-100 rounded-full text-gray-700 font-medium mr-8">
                  {company.budget} Budget
                </div>
              </div>
              <div className="rounded-md border bg-gradient-to-b from-white to-gray-50 p-3 text-sm grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500">Manager</p>
                  <p className="font-medium">{company.manager}</p>
                </div>
                <div>
                  <p className="text-gray-500">Employees</p>
                  <p className="font-medium">{company.employees}</p>
                </div>
              </div>
              <div className="text-xs text-gray-500 flex flex-wrap justify-between items-center">Last activity: Today, 9:30 AM
                <Button onClick={onClick}>View Details</Button>
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
                            sessionStorage.setItem('selectedCompany', JSON.stringify(company));
                            const newTab = window.open(`/core/company/${company.id}`, '_blank');
                            if (newTab) newTab.focus();
                        }}
                        >
                        View Details
                        </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setEditCompany(company)}>
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

        {viewCompany && (
        <Dialog open={true} onOpenChange={() => setViewCompany(null)}>
            <DialogContent className="max-w-md">
            <DialogHeader>
                <DialogTitle className="text-xl font-bold text-emerald-600">
                {viewCompany.name} <span className="text-gray-500">({viewCompany.nameAm})</span>
                </DialogTitle>
            </DialogHeader>
            <div className="bg-gray-50 rounded-md p-4 space-y-4 border mt-2">
                <div className="flex items-center justify-between">
                <span className="text-gray-500">👤 Manager:</span>
                <span className="font-medium text-gray-700">{viewCompany.manager}</span>
                </div>
                <div className="flex items-center justify-between">
                <span className="text-gray-500">💰 Budget:</span>
                <span className="font-medium text-gray-700">{viewCompany.budget}</span>
                </div>
                <div className="flex items-center justify-between">
                <span className="text-gray-500">👥 Employees:</span>
                <span className="font-medium text-gray-700">{viewCompany.employees}</span>
                </div>
                <div className="flex items-center justify-between">
                <span className="text-gray-500">🏢 Branches:</span>
                <span className="font-medium text-gray-700">{viewCompany.branches}</span>
                </div>
            </div>
            <div className="pt-2 text-xs text-right text-gray-400">
                Last viewed: {new Date().toLocaleString()}
            </div>
            </DialogContent>
        </Dialog>
        )}

    </div>
  );
};

export default AddCompanyForm;
