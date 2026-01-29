import React from "react";
import { Workflow } from "lucide-react";
import SimpleCRMSettingsTable from "../../../components/settings/SimpleCRMSettingsTable";
import { useCRMSettings } from "../../../hooks/useCRMSettings";

const PageActivityTypes: React.FC = () => {
  const { settings, saveSettings } = useCRMSettings();

  const handleSave = async (updatedActivityTypes: any[]) => {
    await saveSettings({ activityTypes: updatedActivityTypes });
  };

  return (
    <SimpleCRMSettingsTable
      title="Activity Types"
      description="Configure activity types for tracking lead interactions"
      icon={Workflow}
      iconColor="text-red-600"
      buttonColor="bg-red-600 hover:bg-red-700"
      data={settings.activityTypes}
      onSave={handleSave}
      singularName="Activity Type"
    />
  );
};

export default PageActivityTypes;