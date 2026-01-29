import React from "react";
import { Mail } from "lucide-react";
import SimpleCRMSettingsTable from "../../../components/settings/SimpleCRMSettingsTable";
import { useCRMSettings } from "../../../hooks/useCRMSettings";

const PageContactMethods: React.FC = () => {
  const { settings, saveSettings } = useCRMSettings();

  const handleSave = async (updatedContactMethods: any[]) => {
    await saveSettings({ contactMethods: updatedContactMethods });
  };

  return (
    <SimpleCRMSettingsTable
      title="Contact Methods"
      description="Manage preferred contact method options for lead communication"
      icon={Mail}
      iconColor="text-pink-600"
      buttonColor="bg-pink-600 hover:bg-pink-700"
      data={settings.contactMethods}
      onSave={handleSave}
      singularName="Contact Method"
    />
  );
};

export default PageContactMethods;