import React from "react";
import { Building } from "lucide-react";
import SimpleCRMSettingsTable from "../../../components/settings/SimpleCRMSettingsTable";
import { useCRMSettings } from "../../../hooks/useCRMSettings";

const PageIndustries: React.FC = () => {
  const { settings, saveSettings } = useCRMSettings();

  const handleSave = async (updatedIndustries: any[]) => {
    await saveSettings({ industries: updatedIndustries });
  };

  return (
    <SimpleCRMSettingsTable
      title="Industries"
      description="Set up industry categories for lead and company classification"
      icon={Building}
      iconColor="text-indigo-600"
      buttonColor="bg-indigo-600 hover:bg-indigo-700"
      data={settings.industries}
      onSave={handleSave}
      singularName="Industry"
    />
  );
};

export default PageIndustries;