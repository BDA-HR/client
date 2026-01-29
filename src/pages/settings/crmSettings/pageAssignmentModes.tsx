import React from "react";
import { Users } from "lucide-react";
import SimpleCRMSettingsTable from "../../../components/settings/SimpleCRMSettingsTable";
import { useCRMSettings } from "../../../hooks/useCRMSettings";

const PageAssignmentModes: React.FC = () => {
  const { settings, saveSettings } = useCRMSettings();

  const handleSave = async (updatedAssignmentModes: any[]) => {
    await saveSettings({ assignmentModes: updatedAssignmentModes });
  };

  return (
    <SimpleCRMSettingsTable
      title="Assignment Modes"
      description="Set up lead assignment modes and routing rules"
      icon={Users}
      iconColor="text-yellow-600"
      buttonColor="bg-yellow-600 hover:bg-yellow-700"
      data={settings.assignmentModes}
      onSave={handleSave}
      singularName="Assignment Mode"
    />
  );
};

export default PageAssignmentModes;