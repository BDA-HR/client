import React from "react";
import { MessageSquare } from "lucide-react";
import SimpleCRMSettingsTable from "../../../components/settings/SimpleCRMSettingsTable";
import { useCRMSettings } from "../../../hooks/useCRMSettings";

const PageSMSTemplates: React.FC = () => {
  const { settings, saveSettings } = useCRMSettings();

  const handleSave = async (updatedSMSTemplates: any[]) => {
    await saveSettings({ smsTemplates: updatedSMSTemplates });
  };

  return (
    <SimpleCRMSettingsTable
      title="SMS Templates"
      description="Create and manage SMS templates for quick messaging"
      icon={MessageSquare}
      iconColor="text-orange-600"
      buttonColor="bg-orange-600 hover:bg-orange-700"
      data={settings.smsTemplates || []}
      onSave={handleSave}
      singularName="SMS Template"
    />
  );
};

export default PageSMSTemplates;
