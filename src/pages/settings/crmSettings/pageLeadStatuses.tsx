import React from "react";
import { BarChart3 } from "lucide-react";
import SimpleCRMSettingsTable from "../../../components/settings/SimpleCRMSettingsTable";
import { useCRMSettings } from "../../../hooks/useCRMSettings";

const PageLeadStatuses: React.FC = () => {
  const { settings, saveSettings } = useCRMSettings();

  const handleSave = async (updatedLeadStatuses: any[]) => {
    await saveSettings({ leadStatuses: updatedLeadStatuses });
  };

  return (
    <SimpleCRMSettingsTable
      title="Lead Statuses"
      description="Configure lead status options and workflow progression stages"
      icon={BarChart3}
      iconColor="text-blue-600"
      buttonColor="bg-blue-600 hover:bg-blue-700"
      data={settings.leadStatuses}
      onSave={handleSave}
      showPriority={true}
      singularName="Lead Status"
    />
  );
};

export default PageLeadStatuses;