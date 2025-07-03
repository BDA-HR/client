import React, { useState } from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardDescription 
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Progress } from "../../../components/ui/progress";
import { 
   
  Clock, 
  FileText,  
  Settings, 
  User,
  Calendar,
  BarChart2
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Onboarding = () => {
  const [trainingProgram, setTrainingProgram] = useState('');
  const [startDate, setStartDate] = useState('');
  const [trainer, setTrainer] = useState('');

  const employee = {
    name: 'John Smith',
    position: 'Software Engineer',
    department: 'IT',
    startDate: '2023-08-01',
    manager: 'Jane Doe',
    email: 'john.smith@example.com',
    phone: '(555) 123-4567'
  };

  const onboardingTasks = [
    { 
      id: 1, 
      name: 'Employment Contract', 
      status: 'completed',
      completedDate: '2023-07-10',
      icon: <FileText className="w-5 h-5 text-blue-500" />
    },
    { 
      id: 2, 
      name: 'Tax Forms', 
      status: 'completed',
      completedDate: '2023-07-12',
      icon: <FileText className="w-5 h-5 text-blue-500" />
    },
    { 
      id: 3, 
      name: 'System Access Setup', 
      status: 'in-progress',
      assignedTo: 'IT Department',
      icon: <Settings className="w-5 h-5 text-orange-500" />
    },
    { 
      id: 4, 
      name: 'Orientation Schedule', 
      status: 'pending',
      icon: <Clock className="w-5 h-5 text-gray-500" />
    }
  ];

  const onboardingMetrics = [
    { name: 'Completed', value: 24 },
    { name: 'In Progress', value: 12 },
    { name: 'Pending', value: 8 },
  ];

  // Calculate onboarding progress
  const completedTasks = onboardingTasks.filter(t => t.status === 'completed').length;
  const progress = Math.round((completedTasks / onboardingTasks.length) * 100);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Employee Onboarding</h1>
              <p className="text-sm text-gray-500 mt-1">
                Streamlining the onboarding process for {employee.name}
              </p>
            </div>
            <Badge variant="secondary" className="px-3 py-1">
              {progress}% Complete
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={progress} className="h-2 mb-6" />
          
          {/* Employee Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="bg-gray-50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Employee Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">{employee.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Position</p>
                    <p className="font-medium">{employee.position}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Department</p>
                    <p className="font-medium">{employee.department}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Start Date</p>
                    <p className="font-medium">{employee.startDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Manager</p>
                    <p className="font-medium">{employee.manager}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Contact</p>
                    <p className="font-medium">{employee.email}</p>
                    <p className="font-medium">{employee.phone}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Onboarding Analytics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart2 className="w-5 h-5" />
                  Onboarding Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={onboardingMetrics}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Onboarding Tasks */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg">Onboarding Tasks</CardTitle>
              <CardDescription>
                Track progress of onboarding activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {onboardingTasks.map(task => (
                  <div 
                    key={task.id} 
                    className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="mr-4">
                      {task.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{task.name}</h3>
                      <p className="text-sm text-gray-500">
                        {task.status === 'completed' 
                          ? `Completed on ${task.completedDate}` 
                          : task.status === 'in-progress'
                            ? `Assigned to ${task.assignedTo}`
                            : 'Pending assignment'}
                      </p>
                    </div>
                    <div>
                      <Badge 
                        variant={
                          task.status === 'completed' ? 'default' : 
                          task.status === 'in-progress' ? 'secondary' : 'outline'
                        }
                        className="capitalize"
                      >
                        {task.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Training Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Training Schedule</CardTitle>
              <CardDescription>
                Schedule required training sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="trainingProgram">Training Program</Label>
                    <Input
                      id="trainingProgram"
                      value={trainingProgram}
                      onChange={(e) => setTrainingProgram(e.target.value)}
                      placeholder="Enter training program"
                    />
                  </div>
                  <div>
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="trainer">Trainer</Label>
                    <Input
                      id="trainer"
                      value={trainer}
                      onChange={(e) => setTrainer(e.target.value)}
                      placeholder="Assign trainer"
                    />
                  </div>
                  <Button className="mt-4">Schedule Training</Button>
                </div>
                
                <div className="border border-dashed rounded-lg bg-gray-50 flex items-center justify-center p-6">
                  <div className="text-center">
                    <Calendar className="w-12 h-12 mx-auto text-gray-400" />
                    <p className="mt-2 text-gray-500">No training scheduled</p>
                    <p className="text-sm text-gray-400">
                      Schedule will appear here once created
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;