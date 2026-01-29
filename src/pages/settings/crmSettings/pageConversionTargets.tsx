import React from "react";
import { Settings } from "lucide-react";
import SimpleCRMSettingsTable from "../../../components/settings/SimpleCRMSettingsTable";
import { useCRMSettings } from "../../../hooks/useCRMSettings";

const PageConversionTargets: React.FC = () => {
  const { settings, saveSettings } = useCRMSettings();

  const handleSave = async (updatedConversionTargets: any[]) => {
    await saveSettings({ conversionTargets: updatedConversionTargets });
  };

  return (
    <SimpleCRMSettingsTable
      title="Conversion Targets"
      description="Define conversion targets and goals for lead management"
      icon={Settings}
      iconColor="text-teal-600"
      buttonColor="bg-teal-600 hover:bg-teal-700"
      data={settings.conversionTargets}
      onSave={handleSave}
      singularName="Conversion Target"
    />
  );
};

export default PageConversionTargets;