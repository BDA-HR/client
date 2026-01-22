import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

// Type Definitions
interface ApprovalStep {
  order: number;
  title: string;
  person: string;
  role: 'Manager' | 'HR' | string;
}

interface ApprovalWorkflowData {
  effectiveDate: string;
  expiryDate: string;
  steps: ApprovalStep[];
}

interface Dimensions {
  width: number;
  height: number;
}

interface TreeNodeData {
  name: string;
  person?: string;
  role?: string;
  step?: number;
  type?: string;
  children?: TreeNodeData[];
}

interface Props {
  data: ApprovalWorkflowData;
  width?: number;
  height?: number;
}

const ApprovalWorkflowHierarchy: React.FC<Props> = ({ 
  data, 
  width = 900, 
  height = 400 
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState<Dimensions>({ width, height });

  // Update dimensions on window resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        setDimensions({
          width: Math.min(containerWidth, width),
          height: Math.max(400, containerWidth * 0.45)
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [width]);

  useEffect(() => {
    if (!data || !svgRef.current) return;

    // Clear previous SVG
    d3.select(svgRef.current).selectAll('*').remove();

    // Set up SVG with padding
    const svg = d3.select(svgRef.current)
      .attr('width', dimensions.width)
      .attr('height', dimensions.height)
      .attr('viewBox', [0, 0, dimensions.width, dimensions.height] as [number, number, number, number])
      .attr('class', 'max-w-full h-auto');

    // Add a background
    svg.append('rect')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('fill', '#fef7f1');

    // Create a hierarchy from the data
    const hierarchyData: TreeNodeData = {
      name: 'Approval Workflow',
      children: data.steps.map(step => ({
        name: step.title,
        person: step.person,
        role: step.role,
        step: step.order,
        type: 'step'
      }))
    };

    // Create root for hierarchy
    const root = d3.hierarchy<TreeNodeData>(hierarchyData);
    
    // Use cluster layout for horizontal distribution
    const clusterLayout = d3.tree<TreeNodeData>()
      .size([dimensions.height - 120, dimensions.width - 160])
      .separation(() => 1.2);

    clusterLayout(root);

    // Calculate center offset for better centering
    const nodes = root.descendants();
    const minX = d3.min(nodes, d => d.x) || 0;
    const maxX = d3.max(nodes, d => d.x) || 0;
    const xCenter = (dimensions.height - (maxX - minX)) / 2 - minX;

    // Draw links between nodes
    const links = root.links();
    
    svg.append('g')
      .attr('class', 'links')
      .selectAll('path')
      .data(links)
      .join('path')
      .attr('d', d => {
        const sourceX = d.source.y;
        const sourceY = d.source.x + xCenter;
        const targetX = d.target.y;
        const targetY = d.target.x + xCenter;
        
        // Simple straight line for now
        return `M ${sourceX} ${sourceY} L ${targetX} ${targetY}`;
      })
      .attr('fill', 'none')
      .attr('stroke', '#fb923c')
      .attr('stroke-width', 3)
      .attr('stroke-dasharray', '8,4')
      .attr('opacity', 0.8);

    // Create node groups
    const nodeGroups = svg.append('g')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .attr('transform', d => `translate(${d.y}, ${d.x + xCenter})`);

    // Draw node rectangles - root node
    nodeGroups.filter((d: d3.HierarchyPointNode<TreeNodeData>) => d.depth === 0)
      .append('rect')
      .attr('x', -100)
      .attr('y', -30)
      .attr('width', 200)
      .attr('height', 60)
      .attr('rx', 8)
      .attr('fill', '#f97316')
      .attr('stroke', '#c2410c')
      .attr('stroke-width', 2)
      .attr('filter', 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))');

    // Draw node rectangles - step nodes
    nodeGroups.filter((d: d3.HierarchyPointNode<TreeNodeData>) => d.depth > 0)
      .append('rect')
      .attr('x', -120)
      .attr('y', -50)
      .attr('width', 240)
      .attr('height', 100)
      .attr('rx', 10)
      .attr('fill', '#ffffff')
      .attr('stroke', (d: d3.HierarchyPointNode<TreeNodeData>) => {
        if (d.data.role === 'HR') return '#dc2626';
        if (d.data.role === 'Manager') return '#2563eb';
        return '#f97316';
      })
      .attr('stroke-width', 3)
      .attr('filter', 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15))');

    // Add step numbers for approval steps
    nodeGroups.filter((d: d3.HierarchyPointNode<TreeNodeData>) => d.depth > 0)
      .append('circle')
      .attr('cx', -100)
      .attr('cy', -30)
      .attr('r', 20)
      .attr('fill', (d: d3.HierarchyPointNode<TreeNodeData>) => {
        if (d.data.role === 'HR') return '#dc2626';
        if (d.data.role === 'Manager') return '#2563eb';
        return '#f97316';
      });

    nodeGroups.filter((d: d3.HierarchyPointNode<TreeNodeData>) => d.depth > 0)
      .append('text')
      .attr('x', -100)
      .attr('y', -30)
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('fill', 'white')
      .attr('font-weight', 'bold')
      .attr('font-size', '14px')
      .text((d: d3.HierarchyPointNode<TreeNodeData>) => d.data.step?.toString() || '');

    // Add text for root node
    nodeGroups.filter((d: d3.HierarchyPointNode<TreeNodeData>) => d.depth === 0)
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('fill', 'white')
      .attr('font-weight', 'bold')
      .attr('font-size', '16px')
      .text('Approval Workflow');

    // Add text for step nodes - title
    nodeGroups.filter((d: d3.HierarchyPointNode<TreeNodeData>) => d.depth > 0)
      .append('text')
      .attr('x', -70)
      .attr('y', -30)
      .attr('text-anchor', 'start')
      .attr('dy', '0.35em')
      .attr('fill', '#1f2937')
      .attr('font-weight', 'bold')
      .attr('font-size', '14px')
      .text((d: d3.HierarchyPointNode<TreeNodeData>) => d.data.name);

    // Add person name
    nodeGroups.filter((d: d3.HierarchyPointNode<TreeNodeData>) => d.depth > 0)
      .append('text')
      .attr('x', 0)
      .attr('y', 10)
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('fill', '#4b5563')
      .attr('font-size', '13px')
      .attr('font-weight', '500')
      .text((d: d3.HierarchyPointNode<TreeNodeData>) => d.data.person || '');

    // Add role
    nodeGroups.filter((d: d3.HierarchyPointNode<TreeNodeData>) => d.depth > 0)
      .append('text')
      .attr('x', 0)
      .attr('y', 32)
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('fill', (d: d3.HierarchyPointNode<TreeNodeData>) => {
        if (d.data.role === 'HR') return '#dc2626';
        if (d.data.role === 'Manager') return '#2563eb';
        return '#f97316';
      })
      .attr('font-weight', '600')
      .attr('font-size', '12px')
      .text((d: d3.HierarchyPointNode<TreeNodeData>) => d.data.role || '');

    // Add arrowheads
    svg.append('defs').append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 8)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#fb923c');

    svg.selectAll('.links path')
      .attr('marker-end', 'url(#arrowhead)');

  }, [data, dimensions]);

  return (
    <div 
      ref={containerRef} 
      className="w-full flex flex-col items-center justify-center"
    >
      <svg 
        ref={svgRef} 
        className="w-full h-auto"
        style={{ minHeight: '400px' }}
      ></svg>
    </div>
  );
};

export default ApprovalWorkflowHierarchy;