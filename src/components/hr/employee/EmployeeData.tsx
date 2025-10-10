export const generateEmployees = (count: number): Employee[] => {
  const departments = ['Finance', 'Engineer', 'Product', 'Marketing', 'HR', 'Operations'];
  const roles = [
    'Sr. Accountant', 'Lead Back End Dev', 'Jr. Technical Product', 
    'Lead Accountant', 'Sr. DevOps', 'Jr. Digital Marketing',
    'Jr. Front End Dev', 'Sr. Content Writer', 'Lead Product Manager',
    'UX Designer', 'Data Analyst', 'HR Specialist'
  ];
  const contractTypes: ("Full-time" | "Part-time" | "Freelance" | "Internship")[] = [
    'Full-time', 'Part-time', 'Freelance', 'Internship'
  ];
  const statuses: ("active" | "on-leave")[] = ['active', 'on-leave'];
  
return Array.from({ length: count }, (_, i) => {
  const firstName = ['Jane', 'Brooklyn', 'Leslie', 'Esther', 'Cameron', 'Albert', 'Annette', 'Dafene', 'Grande', 'Aliene'][i % 10];
  const lastName = ['Cooper', 'Simmons', 'Alexander', 'Howard', 'Williamson', 'Flores', 'Black', 'Robertson', 'Ariana', 'McCoy'][i % 10];
    
    return {
      id: `emp-${i}`,
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}${lastName.toLowerCase()}@example.com`,
      payroll: `${Math.floor(100000 + Math.random() * 900000)}${['SH', 'BH', 'DA', 'MM', 'HS', 'NX', 'SJ', 'KA', 'JJ'][i % 9]}${i % 100}`,
      department: departments[i % departments.length],
      role: roles[i % roles.length],
      joiningDate: new Date(Date.now() - Math.floor(Math.random() * 31536000000)).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
      }),
      contractType: contractTypes[i % contractTypes.length],
      status: statuses[i % statuses.length]
    };
  });
};

type Employee = {
  id: string;
  name: string;
  email: string;
  payroll: string;
  department: string;
  role: string;
  joiningDate: string;
  contractType: "Full-time" | "Part-time" | "Freelance" | "Internship";
  status: "active" | "on-leave";
};