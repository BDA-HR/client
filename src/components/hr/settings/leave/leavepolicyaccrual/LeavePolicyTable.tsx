import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MoreVertical,
  Calendar,
  Eye,
  PenBox,
  Trash2,
  Loader2
} from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '../../../../ui/popover';
import type { LeavePolicyListDto } from '../../../../../types/hr/leavepolicy';

interface LeavePolicyTableProps {
  data: LeavePolicyListDto[];
  onEdit: (policy: LeavePolicyListDto) => void;
  onDelete: (policy: LeavePolicyListDto) => void;
  isLoading?: boolean;
}

const LeavePolicyTable: React.FC<LeavePolicyTableProps> = ({
  data = [],
  onEdit,
  onDelete,
  isLoading = false
}) => {
  const [popoverOpen, setPopoverOpen] = useState<string | null>(null);

  const formatDuration = (days: number): string => {
    return `${days} day${days !== 1 ? 's' : ''}`;
  };

  if (isLoading && data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
          <p className="text-gray-600">Loading leave policies...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { y: 20, opacity: 0 },
        visible: {
          y: 0,
          opacity: 1,
          transition: {
            type: 'spring',
            stiffness: 100,
            damping: 15,
            duration: 0.5
          }
        }
      }}
      className="bg-white rounded-xl shadow-sm overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-white">
            <motion.tr
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Policy
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Leave Type
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                Attachment Required
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                Min Duration
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                Max Duration
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">
                Holidays as Leave
              </th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </motion.tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  {isLoading ? 'Loading leave policies...' : 'No leave policies found'}
                </td>
              </tr>
            ) : (
              data.map((policy, index) => (
                <motion.tr
                  key={policy.id}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        delay: index * 0.1,
                        duration: 0.3
                      }
                    },
                    hover: {
                      backgroundColor: "rgba(249, 250, 251, 1)",
                      transition: { duration: 0.2 }
                    }
                  }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-4 py-2 whitespace-nowrap">
                    <div className="flex items-center">
                      <motion.div
                        whileHover={{ rotate: 10 }}
                        className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center"
                      >
                        <Calendar className="text-green-600 h-5 w-5" />
                      </motion.div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900 truncate max-w-[120px] md:max-w-none">
                          {policy.name || "No Name"}
                        </div>
                        <div className="text-xs text-gray-400 truncate max-w-[120px] md:max-w-none">
                          ID: {policy.id?.slice(0, 8)}...
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800`}>
                        {policy.leaveType || "Not specified"}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 hidden md:table-cell">
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        policy.requiresAttachment 
                          ? 'bg-orange-100 text-orange-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {policy.requiresAttachment ? 'Required' : 'Not Required'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 hidden lg:table-cell">
                    <div className="flex items-center">
                      <span className="text-gray-700 font-medium">
                        {formatDuration(policy.minDurPerReq)}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 hidden lg:table-cell">
                    <div className="flex items-center">
                      <span className="text-gray-700 font-medium">
                        {formatDuration(policy.maxDurPerReq)}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 hidden xl:table-cell">
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        policy.holidaysAsLeave 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {policy.holidaysAsLeave ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-right text-sm font-medium">
                    <Popover open={popoverOpen === policy.id} onOpenChange={(open) => setPopoverOpen(open ? policy.id : null)}>
                      <PopoverTrigger asChild>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-gray-600 hover:text-gray-900 p-1 rounded-full hover:bg-gray-100"
                        >
                          <MoreVertical className="h-5 w-5 cursor-pointer" />
                        </motion.button>
                      </PopoverTrigger>
                      <PopoverContent className="w-48 p-0" align="end">
                        <div className="py-1">
                          <button
                            onClick={() => console.log('View policy:', policy)}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded text-gray-700 flex items-center gap-2"
                          >
                            <Eye size={16} />
                            View Details
                          </button>
                          <button 
                            onClick={() => onEdit(policy)}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded text-gray-700 flex items-center gap-2"
                          >
                            <PenBox size={16} />
                            Edit
                          </button>
                          <button 
                            onClick={() => onDelete(policy)}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded flex items-center gap-2"
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default LeavePolicyTable;