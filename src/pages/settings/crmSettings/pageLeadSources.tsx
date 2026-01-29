import React from "react";
import { Target } from "lucide-react";
import SimpleCRMSettingsTable from "../../../components/settings/SimpleCRMSettingsTable";
import { useCRMSettings } from "../../../hooks/useCRMSettings";

const PageLeadSources: React.FC = () => {
  const { settings, saveSettings } = useCRMSettings();

  const handleSave = async (updatedLeadSources: any[]) => {
    await saveSettings({ leadSources: updatedLeadSources });
  };

  return (
    <SimpleCRMSettingsTable
      title="Lead Sources"
      description="Manage and configure lead source options for tracking lead origins"
      icon={Target}
      iconColor="text-orange-600"
      buttonColor="bg-orange-600 hover:bg-orange-700"
      data={settings.leadSources}
      onSave={handleSave}
      singularName="Lead Source"
    />
  );
};

export default PageLeadSources;