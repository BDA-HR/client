import React from "react";
import { Database } from "lucide-react";
import SimpleCRMSettingsTable from "../../../components/settings/SimpleCRMSettingsTable";
import { useCRMSettings } from "../../../hooks/useCRMSettings";

const PageLeadCategories: React.FC = () => {
  const { settings, saveSettings } = useCRMSettings();

  const handleSave = async (updatedLeadCategories: any[]) => {
    await saveSettings({ leadCategories: updatedLeadCategories });
  };

  return (
    <SimpleCRMSettingsTable
      title="Lead Categories"
      description="Define lead categories for better organization and filtering"
      icon={Database}
      iconColor="text-purple-600"
      buttonColor="bg-purple-600 hover:bg-purple-700"
      data={settings.leadCategories}
      onSave={handleSave}
      singularName="Lead Category"
    />
  );
};

export default PageLeadCategories;