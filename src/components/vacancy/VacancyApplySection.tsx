import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Send, Upload, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import type { Vacancy } from '../../types/vacancy';

interface VacancyApplySectionProps {
  vacancy: Vacancy;
  hasApplied: boolean;
  onApply: (data: any) => void;
}

const VacancyApplySection = ({ vacancy, hasApplied, onApply }: VacancyApplySectionProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [coverLetterFile, setCoverLetterFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type (PDF, DOC, DOCX)
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validTypes.includes(file.type)) {
        alert('Please upload a PDF or Word document');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      
      setCoverLetterFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validTypes.includes(file.type)) {
        alert('Please upload a PDF or Word document');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      
      setCoverLetterFile(file);
    }
  };

  const handleRemoveFile = () => {
    setCoverLetterFile(null);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onApply({
      coverLetterFile,
      submittedAt: new Date().toISOString()
    });
    
    setIsSubmitting(false);
    setIsModalOpen(false);
    setCoverLetterFile(null);
  };

  const getFileIcon = (file: File) => {
    if (file.type.includes('pdf')) {
      return (
        <div className="w-12 h-16 bg-red-500 rounded flex items-center justify-center">
          <span className="text-white font-bold text-xs">PDF</span>
        </div>
      );
    } else {
      return (
        <div className="w-12 h-16 bg-blue-500 rounded flex items-center justify-center">
          <span className="text-white font-bold text-xs">DOC</span>
        </div>
      );
    }
  };

  if (hasApplied) {
    return (
      <Card className="sticky top-6">
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Application Submitted
            </h3>
            <p className="text-sm text-gray-600">
              Your application has been successfully submitted. The HR team will review it and contact you soon.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="sticky top-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="w-5 h-5 text-green-600" />
            Apply for this Position
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Apply Button */}
          <Button
            className="w-full bg-green-600 hover:bg-green-700"
            onClick={() => setIsModalOpen(true)}
          >
            <Send className="w-4 h-4 mr-2" />
            Apply Now
          </Button>

          {/* Deadline Warning */}
          <p className="text-xs text-center text-gray-500">
            Application deadline: {new Date(vacancy.closingDate).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}
          </p>
        </CardContent>
      </Card>

      {/* Application Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader className="border-b pb-3">
            <DialogTitle className="text-2xl ">Apply for {vacancy.title}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Cover Letter Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cover Letter 
              </label>
              
              {!coverLetterFile ? (
                <div
                  className={`
                    relative border-2 border-dashed rounded-lg p-8 text-center transition-all
                    ${isDragging 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-300 hover:border-green-400 bg-gray-50'
                    }
                  `}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    id="coverLetter"
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="coverLetter" className="cursor-pointer">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Upload Cover Letter
                    </p>
                    <p className="text-xs text-gray-500">
                      Drag and drop or click to browse
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      PDF or Word document (Max: 5MB)
                    </p>
                  </label>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gray-50 border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center gap-4">
                    {getFileIcon(coverLetterFile)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {coverLetterFile.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(coverLetterFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      onClick={handleRemoveFile}
                      className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-3 pt-4 border-t">
            <Button
              variant="outline"
              className="px-6"
              onClick={() => {
                setIsModalOpen(false);
                setCoverLetterFile(null);
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              className="px-6 bg-green-600 hover:bg-green-700"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VacancyApplySection;
