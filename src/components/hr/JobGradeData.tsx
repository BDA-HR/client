import { 
  Briefcase, Layers, TrendingUp, Award, ShieldCheck 
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export const generateJobGrades = (count: number): JobGrade[] => {
  const icons: LucideIcon[] = [Briefcase, Layers, TrendingUp, Award, ShieldCheck];  const categories = ['Engineering', 'Marketing', 'Finance', 'HR', 'Operations', 'IT', 'Sales'];
  const departments = ['Product', 'Growth', 'Corporate', 'Support', 'R&D'];
  const skills = ['Basic', 'Foundational', 'Intermediate', 'Advanced', 'Expert'];
  
  return Array.from({ length: count }, (_, i) => {
    const gradeNum = Math.floor(i / 20) + 1;
    const level = (i % 5) + 1;
    
    return {
      id: `grade-${i}`,
      grade: `G${gradeNum}-L${level}`,
      title: `${['Entry', 'Junior', 'Mid', 'Senior', 'Lead'][level - 1]} ${categories[i % categories.length]} ${['Specialist', 'Analyst', 'Engineer', 'Manager', 'Director'][level - 1]}`,
      experience: `${level * 2}-${level * 2 + 2} years`,
      roles: [
        `${['Associate', 'Junior', '', 'Senior', 'Lead'][level - 1]} ${categories[i % categories.length]} ${['Assistant', 'Analyst', 'Developer', 'Manager', 'Director'][level - 1]}`,
        `${categories[i % categories.length]} ${['Technician', 'Coordinator', 'Specialist', 'Consultant', 'Architect'][level - 1]}`
      ],
      salary: {
        min: `$${30 + (gradeNum * 10) + (level * 5)}K`,
        mid: `$${35 + (gradeNum * 10) + (level * 5)}K`,
        max: `$${40 + (gradeNum * 10) + (level * 5)}K`
      },
      skill: skills[level - 1],
      icon: icons[level - 1],
      department: departments[i % departments.length],
      category: categories[i % categories.length],
      descriptions: Array.from({ length: 3 + (i % 3) }, (_, j) => ({
        id: j,
        text: `Responsibility ${j + 1}: ${[
          'Lead cross-functional initiatives',
          'Develop and implement strategies',
          'Mentor junior team members',
          'Optimize operational processes',
          'Conduct market research',
          'Manage budget and resources',
          'Ensure compliance with regulations'
        ][(i + j) % 7]} for ${categories[i % categories.length]} department.`
      }))
    };
  });
};

type JobGrade = {
  id: string;
  grade: string;
  title: string;
  experience: string;
  roles: string[];
  salary: SalaryRange;
  skill: string;
  icon: React.ElementType;
  descriptions: JobDescription[];
  department?: string;
  category?: string;
};

type SalaryRange = {
  min: string;
  mid: string;
  max: string;
};

type JobDescription = {
  id: number;
  text: string;
};