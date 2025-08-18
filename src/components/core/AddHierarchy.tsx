import { useState, useEffect, useRef } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Plus } from 'lucide-react';

interface Company {
  id: number;
  name: string;
  nameAm: string;
}

interface Connector {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

const AddHierarchy = () => {
  const allCompanies: Company[] = [
    { id: 1, name: 'Rohobot Tech', nameAm: 'ሮሆቦት ቴክ' },
    { id: 2, name: 'EthioDev', nameAm: 'ኢትዮዴቭ' },
    { id: 3, name: 'Rohobot Group', nameAm: 'ሮሆቦት ግሩፕ' },
  ];

  const [level2Companies, setLevel2Companies] = useState<Company[]>(allCompanies);
  const [level3Companies, setLevel3Companies] = useState<Company[]>([]);
  const [level4Companies, setLevel4Companies] = useState<Company[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<string>('Level 2');
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [connectors, setConnectors] = useState<Connector[]>([]);

  const level1Ref = useRef<HTMLDivElement>(null);
  const level2ContainerRef = useRef<HTMLDivElement>(null);
  const connectorsRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const updateConnectors = () => {
      if (!level1Ref.current || !level2ContainerRef.current || !connectorsRef.current) return;

      const level1Rect = level1Ref.current.getBoundingClientRect();
      const containerRect = level2ContainerRef.current.getBoundingClientRect();
      const svgRect = connectorsRef.current.getBoundingClientRect();

      const level1CenterX = level1Rect.left + level1Rect.width / 2 - svgRect.left;
      const level1BottomY = level1Rect.bottom - svgRect.top;

      const newConnectors: Connector[] = [];
      const level2Cards = level2ContainerRef.current.querySelectorAll('.level2-card');

      level2Cards.forEach((card) => {
        const cardRect = card.getBoundingClientRect();
        const cardCenterX = cardRect.left + cardRect.width / 2 - svgRect.left;
        const cardTopY = cardRect.top - svgRect.top;

        newConnectors.push({
          x1: level1CenterX,
          y1: level1BottomY,
          x2: cardCenterX,
          y2: cardTopY,
        });
      });

      setConnectors(newConnectors);
    };

    updateConnectors();
    window.addEventListener('resize', updateConnectors);
    return () => window.removeEventListener('resize', updateConnectors);
  }, [level2Companies]);

  const handleAddHierarchy = () => {
    const company = allCompanies.find((c) => c.id.toString() === selectedCompanyId);
    if (!company) return;

    if (selectedLevel === 'Level 2') {
      setLevel2Companies((prev) => [...prev, company]);
    } else if (selectedLevel === 'Level 3') {
      setLevel3Companies((prev) => [...prev, company]);
    } else if (selectedLevel === 'Level 4') {
      setLevel4Companies((prev) => [...prev, company]);
    }

    setSelectedCompanyId('');
    setSelectedLevel('Level 2');
    setOpenDialog(false);
  };

  const renderLevelSection = (
    title: string,
    companies: Company[],
    level: number
  ) => {
    if (companies.length === 0) return null;

    return (
      <div className="relative">
        <Card className="w-full p-6 shadow-md border border-gray-200 bg-gray-50 space-y-4 relative z-10">
          <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
          <div
            ref={level === 2 ? level2ContainerRef : null}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {companies.map((company, index) => (
              <Card
                key={`${level}-${index}`}
                className={`p-6 border border-gray-200 bg-white shadow hover:shadow-lg transition-all ${
                  level === 2 ? 'level2-card' : ''
                }`}
              >
                <h4 className="text-base font-semibold text-gray-800">
                  {company.nameAm}
                </h4>
                <p className="text-sm text-gray-500">{company.name}</p>
              </Card>
            ))}
          </div>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6 relative">
      <style>{`
        @keyframes draw {
          to { stroke-dashoffset: 0; }
        }
        .connector-path {
          animation: draw 1s ease-in-out forwards;
        }
      `}</style>

      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Organization Level</h2>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button  type="submit"
              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:bg-emerald-700 rounded-md text-white flex items-center gap-2 cursor-pointer"
            >
              <Plus size={18} />
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
                <Select
                  value={selectedCompanyId}
                  onValueChange={setSelectedCompanyId}
                >
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
                <Select
                  value={selectedLevel}
                  onValueChange={setSelectedLevel}
                >
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
                <Button
                  onClick={handleAddHierarchy}
                  className="bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer"
                >
                  Add
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Level 1 */}
      <div ref={level1Ref}>
        <Card className="w-full p-6 shadow-md border border-gray-200 bg-gray-50 space-y-4">
          <h2 className="text-lg font-semibold text-gray-700">Level 1</h2>
          <div className="flex justify-center">
            <Card className="max-w-lg w-full p-6 shadow-md border border-gray-200 bg-white text-center">
              <h3 className="text-2xl font-bold text-gray-800">ቢዲኤ</h3>
              <p className="text-lg text-gray-600">BDA</p>
            </Card>
          </div>
        </Card>
      </div>

      {/* Connector SVG - Placed right after Level 1 */}
      <svg
        ref={connectorsRef}
        className="absolute w-full h-[200px] top-[calc(100%-20px)] left-0 pointer-events-none z-0"
        style={{ height: '200px' }}
      >
        {connectors.map((conn, index) => (
          <path
            key={index}
            d={`M${conn.x1},${conn.y1} C${conn.x1},${conn.y1 + 50} ${conn.x2},${conn.y2 - 50} ${conn.x2},${conn.y2}`}
            stroke="#6b7280"
            strokeWidth="2"
            fill="none"
            strokeDasharray="1000"
            strokeDashoffset="1000"
            className="connector-path"
            style={{ animationDelay: `${index * 0.2}s` }}
          />
        ))}
      </svg>

      {/* Level 2 and below */}
      {renderLevelSection('Level 2', level2Companies, 2)}
      {renderLevelSection('Level 3', level3Companies, 3)}
      {renderLevelSection('Level 4', level4Companies, 4)}
    </div>
  );
};

export default AddHierarchy;