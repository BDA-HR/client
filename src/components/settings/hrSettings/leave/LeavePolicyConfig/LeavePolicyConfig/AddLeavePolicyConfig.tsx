import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  X,
  BadgePlus,
  Calendar,
  Clock,
  AlertCircle,
  UserCheck,
} from "lucide-react";
import { Button } from "../../../../../ui/button";
import { Label } from "../../../../../ui/label";
import { Input } from "../../../../../ui/input";
import List from "../../../../../List/list";
import type { ListItem } from "../../../../../../types/List/list";
import type {
  LeavePolicyConfigAddDto,
  UUID,
} from "../../../../../../types/core/Settings/leavePolicyConfig";
import type { NameListItem } from "../../../../../../types/NameList/nameList";
import toast from "react-hot-toast";
import { useCreateLeavePolicyConfig } from "../../../../../../services/core/settings/ModHrm/LeavePolicyConfigService/leavePolicyConfig.queries";
import { AccrualFrequency } from "../../../../../../types/core/enum";

interface AddLeavePolicyConfigModalProps {
  onClose: () => void;
  isOpen: boolean;
  leavePolicyId: UUID;
  fiscalYear: NameListItem[];
  onAddLeavePolicyConfig: (
    leavePolicyConfig: LeavePolicyConfigAddDto,
  ) => Promise<void>;
}

const AddLeavePolicyConfigModal: React.FC<AddLeavePolicyConfigModalProps> = ({
  isOpen,
  onClose,
  leavePolicyId,
  fiscalYear,
  onAddLeavePolicyConfig,
}) => {
 const activeFiscalYearId = fiscalYear[0]?.id as UUID;
  const [newConfig, setNewConfig] = useState<LeavePolicyConfigAddDto>({
    annualEntitlement: 0,
    accrualFrequency: "", // enum.AccrualFrequency (0/1)
    accrualRate: 0,
    maxDaysPerReq: 0,
    maxCarryOverDays: 0,
    minServiceMonths: 0,
    fiscalYearId: activeFiscalYearId,
    leavePolicyId: leavePolicyId,
  });

  const [errors, setErrors] = useState<{
    annualEntitlement?: string;
    accrualFrequency?: string;
    accrualRate?: string;
    maxDaysPerReq?: string;
    maxCarryOverDays?: string;
    minServiceMonths?: string;
  }>({});

  // Use the create mutation hook
  const createMutation = useCreateLeavePolicyConfig();
  const isLoading = createMutation.isPending;

  // State for dropdown lists - You'll need to fetch these from your API
  const [leavePolicyNames, setLeavePolicyNames] = useState<NameListItem[]>([]);
  const [isFetchingLists, setIsFetchingLists] = useState(false);
  const [listError, setListError] = useState<string | null>(null);

  // Accrual frequency options
  const accrualFrequencyOptions = Object.entries(AccrualFrequency).map(
    ([key, value]) => ({
      id: key,
      name: value,
    }),
  );

  // Fetch all lists when modal opens
  const fetchAllLists = async () => {
    setIsFetchingLists(true);
    setListError(null);
    try {
      const leavePolicies: NameListItem[] = [
        { id: "policy-1" as UUID, name: "Annual Leave" },
        { id: "policy-2" as UUID, name: "Sick Leave" },
      ];

      setLeavePolicyNames(leavePolicies);
    } catch (error: any) {
      const errorMessage = error.message || "Failed to load configuration data";
      console.error("Error fetching lists:", error);
      setListError(errorMessage);
    } finally {
      setIsFetchingLists(false);
    }
  };

  useEffect(() => {
    fetchAllLists();
  }, []);


  const handleSelectAccrualFrequency = (item: ListItem) => {
    setNewConfig((prev) => ({ ...prev, accrualFrequency: item.id}));
    if (errors.accrualFrequency)
      setErrors((prev) => ({ ...prev, accrualFrequency: undefined }));
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!newConfig.annualEntitlement || newConfig.annualEntitlement <= 0) {
      newErrors.annualEntitlement = "Annual entitlement must be greater than 0";
    }

    if (!newConfig.accrualFrequency.trim()) {
      newErrors.accrualFrequency = "Accrual frequency is required";
    }

    if (!newConfig.accrualRate || newConfig.accrualRate <= 0) {
      newErrors.accrualRate = "Accrual rate must be greater than 0";
    }

    if (!newConfig.maxDaysPerReq || newConfig.maxDaysPerReq <= 0) {
      newErrors.maxDaysPerReq =
        "Maximum days per request must be greater than 0";
    }

    if (newConfig.maxCarryOverDays < 0) {
      newErrors.maxCarryOverDays = "Maximum carry over days cannot be negative";
    }

    if (!newConfig.minServiceMonths || newConfig.minServiceMonths < 0) {
      newErrors.minServiceMonths =
        "Minimum service months must be 0 or greater";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      const dataToSend = {
        annualEntitlement: Number(newConfig.annualEntitlement),
        accrualFrequency: newConfig.accrualFrequency,
        accrualRate: Number(newConfig.accrualRate),
        maxDaysPerReq: Number(newConfig.maxDaysPerReq),
        maxCarryOverDays: Number(newConfig.maxCarryOverDays),
        minServiceMonths: Number(newConfig.minServiceMonths),
        fiscalYearId: activeFiscalYearId,
        leavePolicyId: leavePolicyId,
      };

      console.log("Sending data to API:", dataToSend);

      await onAddLeavePolicyConfig(dataToSend);

      toast.success("Leave policy configuration added successfully!");

      handleClose();
    } catch (error: any) {
      const errorMessage =
        error.message || "Failed to add leave policy configuration";
      toast.error(errorMessage);
      console.error("Error adding leave policy configuration:", error);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setNewConfig({
        annualEntitlement: 0,
        accrualFrequency: "",
        accrualRate: 0,
        maxDaysPerReq: 0,
        maxCarryOverDays: 0,
        minServiceMonths: 0,
        fiscalYearId: "" as UUID,
        leavePolicyId: leavePolicyId,
      });
      setErrors({});
      setListError(null);
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === "Escape") {
      handleClose();
    }
  };

  const isFormValid =
    newConfig.annualEntitlement > 0 &&
    newConfig.accrualFrequency.trim() &&
    newConfig.accrualRate > 0 &&
    newConfig.maxDaysPerReq > 0 &&
    newConfig.maxCarryOverDays >= 0 &&
    newConfig.minServiceMonths >= 0 &&
    newConfig.leavePolicyId &&
    !errors.annualEntitlement &&
    !errors.accrualFrequency &&
    !errors.accrualRate &&
    !errors.maxDaysPerReq &&
    !errors.maxCarryOverDays &&
    !errors.minServiceMonths;

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-6"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoading) {
          handleClose();
        }
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-white rounded-xl shadow-xl max-w-xl w-full max-h-[80vh] overflow-y-auto"
        onKeyDown={handleKeyDown}
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b px-6 py-2 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <Calendar size={20} className="text-green-500" />
            <div>
              <h2 className="text-lg font-bold text-gray-800">
                Add Leave Policy Configuration
              </h2>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            disabled={isLoading}
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="px-4 py-2">
          {/* two Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Left Column - Entitlement & Accrual */}
            <div className="">
              {/* Annual Entitlement */}
              <div className="space-y-1 min-h-[76px]">
                <Label
                  htmlFor="annualEntitlement"
                  className="text-sm font-medium text-gray-700"
                >
                  Annual Entitlement <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="annualEntitlement"
                  type="number"
                  min="0"
                  step="0.5"
                  value={
                    newConfig.annualEntitlement === 0
                      ? ""
                      : newConfig.annualEntitlement
                  }
                  onChange={(e) => {
                    const value =
                      e.target.value === ""
                        ? 0
                        : parseFloat(e.target.value) || 0;
                    setNewConfig((prev) => ({
                      ...prev,
                      annualEntitlement: value,
                    }));
                    if (errors.annualEntitlement)
                      setErrors((prev) => ({
                        ...prev,
                        annualEntitlement: undefined,
                      }));
                  }}
                  placeholder="Enter days (e.g., 21)"
                  className={`w-full ${
                    errors.annualEntitlement
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : ""
                  }`}
                  disabled={isLoading || isFetchingLists}
                />
                {errors.annualEntitlement && (
                  <p className="text-sm text-red-500">
                    {errors.annualEntitlement}
                  </p>
                )}
              </div>

              {/* Accrual Rate */}
              <div className="space-y-1 min-h-[76px]">
                <Label
                  htmlFor="accrualRate"
                  className="text-sm font-medium text-gray-700"
                >
                  Accrual Rate <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="accrualRate"
                  type="number"
                  min="0"
                  step="0.25"
                  value={
                    newConfig.accrualRate === 0 ? "" : newConfig.accrualRate
                  }
                  onChange={(e) => {
                    const value =
                      e.target.value === ""
                        ? 0
                        : parseFloat(e.target.value) || 0;
                    setNewConfig((prev) => ({ ...prev, accrualRate: value }));
                    if (errors.accrualRate)
                      setErrors((prev) => ({
                        ...prev,
                        accrualRate: undefined,
                      }));
                  }}
                  placeholder="Enter rate (e.g., 1.75)"
                  className={`w-full ${
                    errors.accrualRate
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : ""
                  }`}
                  disabled={isLoading || isFetchingLists}
                />
                {errors.accrualRate && (
                  <p className="text-sm text-red-500">{errors.accrualRate}</p>
                )}
              </div>
              {/* Max Days Per Request */}
              <div className="space-y-1 min-h-[76px]">
                <Label
                  htmlFor="maxDaysPerReq"
                  className="text-sm font-medium text-gray-700"
                >
                  Max Days Per Request <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="maxDaysPerReq"
                  type="number"
                  min="0"
                  step="0.5"
                  value={
                    newConfig.maxDaysPerReq === 0 ? "" : newConfig.maxDaysPerReq
                  }
                  onChange={(e) => {
                    const value =
                      e.target.value === ""
                        ? 0
                        : parseFloat(e.target.value) || 0;
                    setNewConfig((prev) => ({ ...prev, maxDaysPerReq: value }));
                    if (errors.maxDaysPerReq)
                      setErrors((prev) => ({
                        ...prev,
                        maxDaysPerReq: undefined,
                      }));
                  }}
                  placeholder="Enter days (e.g., 14)"
                  className={`w-full ${
                    errors.maxDaysPerReq
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : ""
                  }`}
                  disabled={isLoading || isFetchingLists}
                />
                {errors.maxDaysPerReq && (
                  <p className="text-sm text-red-500">{errors.maxDaysPerReq}</p>
                )}
              </div>
            </div>

            {/* Right Column - Eligibility & References */}
            <div className="space-y-0">
              {/* Min Service Months */}
              <div className="space-y-1 min-h-[76px]">
                <Label
                  htmlFor="minServiceMonths"
                  className="text-sm font-medium text-gray-700"
                >
                  Minimum Service Months
                </Label>
                <Input
                  id="minServiceMonths"
                  type="number"
                  min="0"
                  value={
                    newConfig.minServiceMonths === 0
                      ? ""
                      : newConfig.minServiceMonths
                  }
                  onChange={(e) => {
                    const value =
                      e.target.value === "" ? 0 : parseInt(e.target.value) || 0;
                    setNewConfig((prev) => ({
                      ...prev,
                      minServiceMonths: value,
                    }));
                    if (errors.minServiceMonths)
                      setErrors((prev) => ({
                        ...prev,
                        minServiceMonths: undefined,
                      }));
                  }}
                  placeholder="Enter months (e.g., 3)"
                  className={`w-full ${
                    errors.minServiceMonths
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : ""
                  }`}
                  disabled={isLoading || isFetchingLists}
                />
                {errors.minServiceMonths && (
                  <p className="text-sm text-red-500">
                    {errors.minServiceMonths}
                  </p>
                )}
              </div>

              {/* Accrual Frequency */}
              <div className="space-y-1 min-h-[76px]">
                <Label className="text-sm font-medium text-gray-700">
                  Accrual Frequency <span className="text-red-500">*</span>
                </Label>
                <List
                  items={accrualFrequencyOptions as any}
                  selectedValue={newConfig.accrualFrequency as UUID}
                  onSelect={handleSelectAccrualFrequency}
                  label=""
                  placeholder="Select frequency"
                  required
                  disabled={isLoading || isFetchingLists}
                />
                {errors.accrualFrequency && (
                  <p className="text-sm text-red-500">
                    {errors.accrualFrequency}
                  </p>
                )}
              </div>
              {/* Max Carry Over Days */}
              <div className="space-y-1 min-h-[76px]">
                <Label
                  htmlFor="maxCarryOverDays"
                  className="text-sm font-medium text-gray-700"
                >
                  Max Carry Over Days
                </Label>
                <Input
                  id="maxCarryOverDays"
                  type="number"
                  min="0"
                  value={
                    newConfig.maxCarryOverDays === 0
                      ? ""
                      : newConfig.maxCarryOverDays
                  }
                  onChange={(e) => {
                    const value =
                      e.target.value === "" ? 0 : parseInt(e.target.value) || 0;
                    setNewConfig((prev) => ({
                      ...prev,
                      maxCarryOverDays: value,
                    }));
                    if (errors.maxCarryOverDays)
                      setErrors((prev) => ({
                        ...prev,
                        maxCarryOverDays: undefined,
                      }));
                  }}
                  placeholder="Enter days (e.g., 10)"
                  className={`w-full ${
                    errors.maxCarryOverDays
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : ""
                  }`}
                  disabled={isLoading || isFetchingLists}
                />
                {errors.maxCarryOverDays && (
                  <p className="text-sm text-red-500">
                    {errors.maxCarryOverDays}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4 bg-gray-50 rounded-b-xl">
          <div className="flex justify-center items-center gap-3">
            <Button
              variant="outline"
              className="cursor-pointer px-6 min-w-[100px]"
              onClick={handleClose}
              disabled={isLoading || isFetchingLists}
              type="button"
            >
              Cancel
            </Button>
            <Button
              className="bg-green-500 hover:bg-green-600 text-white cursor-pointer px-6 min-w-[100px] shadow-sm hover:shadow transition-shadow duration-200"
              onClick={handleSubmit}
              disabled={
                !isFormValid ||
                isLoading ||
                isFetchingLists ||
                listError !== null 
              }
              type="button"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </div>
              ) : (
                "Add Configuration"
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AddLeavePolicyConfigModal;
