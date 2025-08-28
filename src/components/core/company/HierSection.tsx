import { useState, useEffect, useRef } from 'react';
import { Button } from '../../ui/button';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog';
import { Label } from '../../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';
import { Plus, Trash2, Eye } from 'lucide-react';
import * as d3 from 'd3';

interface Company {
  id: number;
  name: string;
  nameAm: string;
  parentId?: number;
}

interface Connector {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

interface TreeNode {
  id: number;
  name: string;
  nameAm: string;
  children?: TreeNode[];
  parentId?: number;
}

const AddHierarchy = () => {
  const allCompanies: Company[] = [
    { id: 1, name: 'Rohobot Tech', nameAm: 'ሮሆቦት ቴክ', parentId: 0 },
    { id: 2, name: 'EthioDev', nameAm: 'ኢትዮዴቭ', parentId: 0 },
    { id: 3, name: 'Rohobot Group', nameAm: 'ሮሆቦት ግሩፕ', parentId: 1 },
    { id: 4, name: 'Tech Solutions', nameAm: 'ቴክ ሶልዩሽንስ', parentId: 1 },
    { id: 5, name: 'Innovate Ethiopia', nameAm: 'ኢንኖቬት ኢትዮጵያ', parentId: 2 },
  ];

  const [childCompanies, setChildCompanies] = useState<Company[]>(allCompanies.filter(c => c.parentId === 0));
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const [selectedParentId, setSelectedParentId] = useState<string>('');
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [connectors, setConnectors] = useState<Connector[]>([]);
  const [showVisualization, setShowVisualization] = useState<boolean>(false);
  const [hierarchyData, setHierarchyData] = useState<TreeNode | null>(null);

  const parentRef = useRef<HTMLDivElement>(null);
  const childContainerRef = useRef<HTMLDivElement>(null);
  const connectorsRef = useRef<SVGSVGElement>(null);
  const visualizationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateConnectors = () => {
      if (!parentRef.current || !childContainerRef.current || !connectorsRef.current) return;

      const parentRect = parentRef.current.getBoundingClientRect();
      const svgRect = connectorsRef.current.getBoundingClientRect();

      const parentCenterX = parentRect.left + parentRect.width / 2 - svgRect.left;
      const parentBottomY = parentRect.bottom - svgRect.top;

      const newConnectors: Connector[] = [];
      const childRows = childContainerRef.current.querySelectorAll('.child-row');

      childRows.forEach((row) => {
        const rowRect = row.getBoundingClientRect();
        const rowCenterX = rowRect.left + rowRect.width / 2 - svgRect.left;
        const rowTopY = rowRect.top - svgRect.top;

        newConnectors.push({
          x1: parentCenterX,
          y1: parentBottomY,
          x2: rowCenterX,
          y2: rowTopY,
        });
      });

      setConnectors(newConnectors);
    };

    updateConnectors();
    window.addEventListener('resize', updateConnectors);
    return () => window.removeEventListener('resize', updateConnectors);
  }, [childCompanies]);

  useEffect(() => {
    if (showVisualization) {
      buildHierarchy();
    }
  }, [showVisualization, childCompanies]);

  useEffect(() => {
    if (showVisualization && hierarchyData && visualizationRef.current) {
      drawVisualization();
    }
  }, [hierarchyData, showVisualization]);

  const buildHierarchy = () => {
    const companyMap = new Map<number, TreeNode>();
    
    const root: TreeNode = { id: 0, name: 'BDA', nameAm: 'ቢዲኤ' };
    companyMap.set(0, root);
    
    childCompanies.forEach(company => {
      companyMap.set(company.id, { 
        id: company.id, 
        name: company.name, 
        nameAm: company.nameAm,
        parentId: company.parentId
      });
    });
    
    companyMap.forEach(company => {
      if (company.id === 0) return;
      
      const parentId = company.parentId !== undefined ? company.parentId : 0;
      const parent = companyMap.get(parentId);
      
      if (parent) {
        if (!parent.children) {
          parent.children = [];
        }
        parent.children.push(company);
      }
    });
    companyMap.forEach(company => {
      if (company.children && company.children.length === 0) {
        delete company.children;
      }
    });
    
    setHierarchyData(root);
  };

  const drawVisualization = () => {
    if (!hierarchyData || !visualizationRef.current) return;
    d3.select(visualizationRef.current).selectAll('*').remove();
    
    const width = visualizationRef.current.clientWidth;
    const height = 500;
    
    const svg = d3.select(visualizationRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', 'translate(40, 20)');
    const treeLayout = d3.tree<TreeNode>()
      .size([width - 100, height - 100]);
    const root = d3.hierarchy(hierarchyData, d => d.children);
      treeLayout(root);

      svg.selectAll('.link')
      .data(root.links())
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('d', d3.linkVertical()
        .x((d: any) => d.x)
        .y((d: any) => d.y))
      .attr('fill', 'none')
      .attr('stroke', '#6b7280')
      .attr('stroke-width', 2);
    
    const nodes = svg.selectAll('.node')
      .data(root.descendants())
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    
    nodes.append('circle')
      .attr('r', 10)
      .attr('fill', '#10b981');
    
    nodes.append('text')
      .attr('dy', '0.31em')
      .attr('x', (d: any) => d.children ? -12 : 12)
      .attr('text-anchor', (d: any) => d.children ? 'end' : 'start')
      .text((d: any) => d.data.name)
      .clone(true).lower()
      .attr('stroke', 'white')
      .attr('stroke-width', 3);
  };

  const handleAddHierarchy = () => {
    const company = allCompanies.find((c) => c.id.toString() === selectedCompanyId);
    
    if (!company) return;
    const parentId = selectedParentId === "0" ? 0 : parseInt(selectedParentId);
    const companyExists = childCompanies.some(c => c.id === company.id);
    
    if (companyExists) {
      setChildCompanies(prev => 
        prev.map(c => c.id === company.id ? {...c, parentId} : c)
      );
    } else {
      const updatedCompany = { ...company, parentId };
      setChildCompanies((prev) => [...prev, updatedCompany]);
    }
    
    setSelectedCompanyId('');
    setSelectedParentId('');
    setOpenDialog(false);
  };

  const handleRemoveCompany = (id: number) => {
    setChildCompanies(prev => prev.filter(company => company.id !== id));
  };

  const getParentName = (parentId: number) => {
    if (parentId === 0) return 'BDA';
    const parent = allCompanies.find(c => c.id === parentId);
    return parent ? parent.name : 'Unknown';
  };

  const getParentNameAm = (parentId: number) => {
    if (parentId === 0) return 'ቢዲኤ';
    const parent = allCompanies.find(c => c.id === parentId);
    return parent ? parent.nameAm : 'Unknown';
  };

  const toggleVisualization = () => {
    setShowVisualization(!showVisualization);
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
        .org-chart {
          margin: 20px 0;
          padding: 20px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          background-color: white;
        }
        .node circle {
          fill: #10b981;
          stroke: #047857;
          stroke-width: 2px;
        }
        .node text {
          font: 12px sans-serif;
          fill: #333;
        }
        .link {
          fill: none;
          stroke: #6b7280;
          stroke-width: 2px;
        }
      `}</style>

      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Organization Hierarchy</h2>
        <div className="flex gap-2">
          <Button
            onClick={toggleVisualization}
            variant="outline"
            className="flex items-center gap-2 cursor-pointer"
          >
            <Eye size={18} />
            {showVisualization ? 'Hide Visualization' : 'Visualize'}
          </Button>
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button
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
                    <SelectTrigger className="h-12 text-base px-4 w-full">
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
                  <Label>Select Parent Company</Label>
                  <Select
                    value={selectedParentId}
                    onValueChange={setSelectedParentId}
                  >
                    <SelectTrigger className="h-12 text-base px-4 w-full">
                      <SelectValue placeholder="Choose parent company..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">BDA (ቢዲኤ)</SelectItem>
                      {allCompanies.map((c) => (
                        <SelectItem key={c.id} value={c.id.toString()}>
                          {c.nameAm} ({c.name})
                        </SelectItem>
                      ))}
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
      </div>

      {/* Visualization */}
      {showVisualization && (
        <div className="org-chart">
          <h3 className="text-lg font-semibold mb-4">Organization Chart</h3>
          <div ref={visualizationRef} style={{ width: '100%', height: '500px' }} />
        </div>
      )}

      {/* Child Companies */}
      <div ref={childContainerRef} className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Company Name (Amharic)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Company Name (English)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Parent Company
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {childCompanies.map((company, index) => (
              <tr key={index} className="child-row hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {company.nameAm}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {company.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {getParentNameAm(company.parentId || 0)} ({getParentName(company.parentId || 0)})
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleRemoveCompany(company.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {childCompanies.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No companies added yet. Click "Add Hierarchy" to get started.
          </div>
        )}
      </div>
    </div>
  );
};

export default AddHierarchy;