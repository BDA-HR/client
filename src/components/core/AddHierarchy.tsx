import { useState } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';

const AddHierarchy = () => {
  const allCompanies = [
    { id: 1, name: 'Rohobot Tech', nameAm: 'ሮሆቦት ቴክ' },
    { id: 2, name: 'EthioDev', nameAm: 'ኢትዮዴቭ' },
    { id: 3, name: 'Shega Systems', nameAm: 'ሸጋ ሲስተምስ' },
  ];

  const [subCompanies, setSubCompanies] = useState<{ name: string; nameAm: string; level: string }[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<string>('Level 2');
  const [openDialog, setOpenDialog] = useState(false);

  const handleAddHierarchy = () => {
    const company = allCompanies.find((c) => c.id.toString() === selectedCompanyId);
    if (company) {
      setSubCompanies([...subCompanies, { ...company, level: selectedLevel }]);
      setSelectedCompanyId('');
      setSelectedLevel('Level 2');
      setOpenDialog(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Organization Level</h2>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button className="bg-green-100 text-green-700 hover:bg-green-200 transition-colors">
              Add Hierarchy
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Hierarchy</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Select Company</Label>
                <Select value={selectedCompanyId} onValueChange={setSelectedCompanyId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose company..." />
                  </SelectTrigger>
                  <SelectContent>
                    {allCompanies.map((c) => (
                      <SelectItem key={c.id} value={c.id.toString()}>
                        {c.nameAm} ({c.name})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Select Level</Label>
                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose level..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Level 2">Level 2</SelectItem>
                    <SelectItem value="Level 3">Level 3</SelectItem>
                    <SelectItem value="Level 4">Level 4</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleAddHierarchy} className="bg-green-600 text-white hover:bg-green-700">
                  Add
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Level 1 Card */}
      <Card className="w-full p-6 shadow-md border border-gray-200 bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Level 1</h3>
      <div className="flex justify-center">
        <Card className="max-w-lg w-full p-6 shadow-md border border-gray-200 bg-white text-center">
        
          <h3 className="text-2xl font-bold text-gray-800">ቢዲኤ</h3>
          <p className="text-lg text-gray-600">BDA</p>
        </Card>
      </div>
      </Card>

      {/* Level 2 Container */}
      {subCompanies.length > 0 && (
        <Card className="w-full p-6 shadow-md border border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">{selectedLevel}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {subCompanies.map((company, index) => (
              <Card
                key={index}
                className="p-6 border border-gray-200 bg-white shadow-lg hover:shadow-xl transition-all"
              >
                <h4 className="text-base font-semibold text-gray-800">{company.nameAm}</h4>
                <p className="text-sm text-gray-500">{company.name}</p>
              </Card>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default AddHierarchy;
