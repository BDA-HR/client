import React from "react";
import { Ticket } from "lucide-react";
import SimpleCRMSettingsTable from "../../../components/settings/SimpleCRMSettingsTable";
import { useCRMSettings } from "../../../hooks/useCRMSettings";

const PageTicketStatus: React.FC = () => {
  const { settings, saveSettings } = useCRMSettings();

  const handleSave = async (updatedTicketStatus: any[]) => {
    await saveSettings({ ticketStatus: updatedTicketStatus });
  };

  return (
    <SimpleCRMSettingsTable
      title="Ticket Status"
      description="Manage ticket status options for customer support workflow"
      icon={Ticket}
      iconColor="text-orange-600"
      buttonColor="bg-orange-600 hover:bg-orange-700"
      data={settings.ticketStatus || []}
      onSave={handleSave}
      singularName="Ticket Status"
    />
  );
};

export default PageTicketStatus;
