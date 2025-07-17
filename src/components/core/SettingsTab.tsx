import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Checkbox } from '../ui/checkbox';
import { Settings, Shield, AlertTriangle } from 'lucide-react';


const SettingsTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Branch Settings</CardTitle>
        <CardDescription>
          Configure branch-specific settings and preferences
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Settings className="h-5 w-5 text-gray-500" />
              General Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Branch Name</label>
                <Input value="Headquarters" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Branch Code</label>
                <Input value="BR-HQ-001" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <Input value="New York, USA" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="setup">Setup</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-gray-500" />
              Access Control
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Default User Permissions</label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Checkbox id="inventory-access" defaultChecked />
                    <label htmlFor="inventory-access" className="text-sm">
                      Inventory Access
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="financial-access" />
                    <label htmlFor="financial-access" className="text-sm">
                      Financial Data Access
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="reporting-access" defaultChecked />
                    <label htmlFor="reporting-access" className="text-sm">
                      Reporting Access
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Danger Zone
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm mb-2">Deactivate this branch. Users will no longer be able to access it.</p>
                <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
                  Deactivate Branch
                </Button>
              </div>
              <div>
                <p className="text-sm mb-2">Permanently delete this branch and all its data. This action cannot be undone.</p>
                <Button variant="destructive">
                  Delete Branch
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t px-6 py-3 bg-gray-50 dark:bg-gray-800/50 flex justify-end">
        <Button size="sm" className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-md shadow-emerald-500/20">
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SettingsTab;