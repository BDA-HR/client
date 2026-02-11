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
      title="Lead Industry"
      description="Set up industry categories for lead classification"
      icon={Building}
      iconColor="text-orange-600"
      buttonColor="bg-orange-600 hover:bg-orange-700"
      data={settings.industries}
      onSave={handleSave}
      singularName="Industry"
    />
  );
};

export default PageIndustries;