import React from "react";
import { Card, CardContent } from "../../../../../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../../../../../ui/avatar";
import { Badge } from "../../../../../ui/badge";
import { Button } from "../../../../../ui/button";
import { Eye, Calendar, ListOrdered } from "lucide-react";

interface ApprovalStep {
  id: number;
  stepNumber: number;
  stepName: string;
  employeeName: string;
  role: "Manager" | "HR";
  avatar?: string;
}

interface ApprovalStepCardProps {
  steps: ApprovalStep[];
  effectiveFrom?: string;
  effectiveTo?: string;
  onViewDetails?: () => void;
}

const LeaveAppStepCard: React.FC<ApprovalStepCardProps> = ({
  steps,
  effectiveFrom,
  effectiveTo,
  onViewDetails,
}) => {
  const getRoleColor = (role: string) => {
    switch (role) {
      case "Manager":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200 border-blue-200 dark:border-blue-800";
      case "HR":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200 border-purple-200 dark:border-purple-800";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700";
    }
  };

  // Sample data for effective dates if not provided
  const displayFrom = effectiveFrom || "2024-01-01";
  const displayTo = effectiveTo || "2024-12-31";

  return (
    <div className="w-1/2 min-w-[600px]">
      <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
        <CardContent className="p-4">
          {/* Header with Effective Dates */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                <ListOrdered className="h-4 w-4 text-gray-600 dark:text-gray-300" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Approval Workflow Configuration
                </h3>

                {/* Effective Dates */}
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
                    <span className="text-xs text-gray-600 dark:text-gray-300">
                      Effective:
                    </span>
                    <span className="text-xs font-medium text-gray-900 dark:text-white">
                      {displayFrom}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      to
                    </span>
                    <span className="text-xs font-medium text-gray-900 dark:text-white">
                      {displayTo}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {steps.length} step{steps.length !== 1 ? "s" : ""}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  configured
                </div>
              </div>

              {onViewDetails && steps.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-2 text-xs hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={onViewDetails}
                >
                  <Eye className="h-3.5 w-3.5" />
                  View Details
                </Button>
              )}
            </div>
          </div>

          {/* Horizontal Steps Layout */}
          <div className="relative">
            {steps.length === 0 ? (
              <div className="text-center py-6 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                <ListOrdered className="h-6 w-6 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No approval steps configured
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  Add steps to create an approval workflow
                </p>
              </div>
            ) : (
              <div className="flex items-center justify-between px-2">
                {steps.map((step, index) => {
                  const isLast = index === steps.length - 1;

                  return (
                    <div key={step.id} className="relative flex items-center">
                      {/* Step Card */}
                      <div className="relative z-10 flex flex-col items-center w-36">
                        {/* Step Number */}
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium mb-3 border-2 border-white dark:border-gray-900 shadow-sm">
                          {step.stepNumber}
                        </div>

                        {/* Step Info */}
                        <div className="text-center w-full px-1">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate mb-1.5">
                            {step.stepName}
                          </h4>

                          <div className="flex flex-col items-center gap-1.5 mb-2">
                            <Avatar className="h-7 w-7 border-2 border-white dark:border-gray-800 shadow-sm">
                              <AvatarImage
                                src={step.avatar}
                                alt={step.employeeName}
                              />
                              <AvatarFallback className="text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                                {step.employeeName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <p className="text-xs text-gray-600 dark:text-gray-300 truncate">
                              {step.employeeName}
                            </p>
                          </div>

                          <Badge
                            variant="outline"
                            className={`text-xs px-3 py-0.5 ${getRoleColor(
                              step.role
                            )}`}
                          >
                            {step.role}
                          </Badge>
                        </div>
                      </div>

                      {/* Connector Line */}
                      {!isLast && (
                        <div className="absolute left-full top-5 w-24 h-0.5">
                          <div className="w-full h-full bg-gradient-to-r from-gray-300 via-gray-300 to-gray-400 dark:from-gray-600 dark:via-gray-600 dark:to-gray-700 relative">
                            {/* Arrow head */}
                            <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
                              <div className="w-0 h-0 border-t-[4px] border-b-[4px] border-l-[6px] border-t-transparent border-b-transparent border-l-gray-400 dark:border-l-gray-600"></div>
                            </div>

                            {/* Dotted line effect */}
                            <div className="absolute inset-0 border-t border-dashed border-gray-200 dark:border-gray-700 opacity-30"></div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Role Summary */}
          {steps.length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500 shadow-sm"></div>
                  <span className="text-xs text-gray-600 dark:text-gray-300">
                    Manager:{" "}
                    <span className="font-medium text-gray-900 dark:text-white">
                      {steps.filter((s) => s.role === "Manager").length}
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500 shadow-sm"></div>
                  <span className="text-xs text-gray-600 dark:text-gray-300">
                    HR:{" "}
                    <span className="font-medium text-gray-900 dark:text-white">
                      {steps.filter((s) => s.role === "HR").length}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaveAppStepCard;
