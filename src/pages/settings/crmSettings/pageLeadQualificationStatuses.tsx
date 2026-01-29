import React from "react";
import { Award } from "lucide-react";
import SimpleCRMSettingsTable from "../../../components/settings/SimpleCRMSettingsTable";
import { useCRMSettings } from "../../../hooks/useCRMSettings";

const PageLeadQualificationStatuses: React.FC = () => {
  const { settings, saveSettings } = useCRMSettings();

  const handleSave = async (updatedLeadQualificationStatuses: any[]) => {
    await saveSettings({ leadQualificationStatuses: updatedLeadQualificationStatuses });
  };

  return (
    <SimpleCRMSettingsTable
      title="Lead Qualification Statuses"
      description="Set up qualification status levels for lead assessment"
      icon={Award}
      iconColor="text-green-600"
      buttonColor="bg-green-600 hover:bg-green-700"
      data={settings.leadQualificationStatuses}
      onSave={handleSave}
      singularName="Lead Qualification Status"
    />
  );
};

export default PageLeadQualificationStatuses;