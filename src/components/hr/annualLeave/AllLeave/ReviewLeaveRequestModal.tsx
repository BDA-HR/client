import { useState } from "react";
import { motion } from "framer-motion";
import { X, MessageSquare, Send } from "lucide-react";
import { Button } from "../../../ui/button";
import { Label } from "../../../ui/label";
import { Textarea } from "../../../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../ui/select";
import type { LeaveRequest } from "./LeaveRequestTable";
import { showToast } from "../../../../layout/layout";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  leaveRequest: LeaveRequest | null;
  onApprove: (row: LeaveRequest, comment: string) => void;
  onReject: (row: LeaveRequest, comment: string) => void;
}

type ActionType = "approve" | "reject" | "";

const ReviewLeaveRequestModal: React.FC<Props> = ({
  isOpen,
  onClose,
  leaveRequest,
  onApprove,
  onReject,
}) => {
  const [comment, setComment] = useState("");
  const [action, setAction] = useState<ActionType>("");
  const [loading, setLoading] = useState(false);

  if (!isOpen || !leaveRequest) return null;

  const handleSubmit = async () => {
    if (!action) {
      showToast.error("Please select an action");
      return;
    }

    if (!comment.trim()) {
      showToast.error("Please add a comment");
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));

    if (action === "approve") {
      onApprove(leaveRequest, comment);
    } else {
      onReject(leaveRequest, comment);
    }

    setComment("");
    setAction("");
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-xl max-w-lg w-full"
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b px-6 py-3">
          <h2 className="text-lg font-semibold text-gray-800">
            Review Decision
          </h2>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <Label>
              Action <span className="text-red-500">*</span>
            </Label>
            <Select
              value={action}
              onValueChange={(v) => setAction(v as ActionType)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="approve">Approve</SelectItem>
                <SelectItem value="reject">Reject</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>
              Comment <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="pl-10 min-h-[100px]"
                placeholder="Write your comment..."
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-3 flex justify-center">
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700"
          >
            Submit
          </Button>
          <Button
          variant={"outline"}
            onClick={onClose}
            disabled={loading}
            className="ml-2 text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default ReviewLeaveRequestModal;
