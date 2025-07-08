import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface AddJobGradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddGrade: (grade: Omit<JobGrade, 'id'>) => void;
  categories: string[];
}

const AddJobGradeModal: React.FC<AddJobGradeModalProps> = ({
  isOpen,
  onClose,
  onAddGrade,
  categories,
}) => {
  const [formData, setFormData] = useState<Omit<JobGrade, 'id'>>({
    grade: '',
    title: '',
    experience: '',
    roles: [],
    salary: { min: '', mid: '', max: '' },
    descriptions: [{ id: 1, text: '' }],
    category: '',
  });

  const [currentRole, setCurrentRole] = useState('');
  const [isRoleInputFocused, setIsRoleInputFocused] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name.startsWith('salary.')) {
      const salaryField = name.split('.')[1] as keyof SalaryRange;
      setFormData(prev => ({
        ...prev,
        salary: {
          ...prev.salary,
          [salaryField]: value,
        },
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddRole = () => {
    if (currentRole.trim() && !formData.roles.includes(currentRole.trim())) {
      setFormData(prev => ({
        ...prev,
        roles: [...prev.roles, currentRole.trim()],
      }));
      setCurrentRole('');
    }
  };

  const handleRemoveRole = (roleToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      roles: prev.roles.filter(role => role !== roleToRemove),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      formData.grade &&
      formData.title &&
      formData.experience &&
      formData.roles.length > 0 &&
      formData.salary.min &&
      formData.salary.mid &&
      formData.salary.max &&
      formData.descriptions[0].text.trim() &&
      formData.category
    ) {
      onAddGrade(formData);
      setFormData({
        grade: '',
        title: '',
        experience: '',
        roles: [],
        salary: { min: '', mid: '', max: '' },
        descriptions: [{ id: 1, text: '' }],
        category: '',
      });
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-gray-500 bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="bg-white rounded-xl shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Add New Job Grade</h2>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Grade *</label>
                    <input
                      type="text"
                      name="grade"
                      value={formData.grade}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="e.g. G1-L1"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="e.g. Junior Software Engineer"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Experience *</label>
                    <input
                      type="text"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="e.g. 2-4 years"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Roles *</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={currentRole}
                      onChange={(e) => setCurrentRole(e.target.value)}
                      onFocus={() => setIsRoleInputFocused(true)}
                      onBlur={() => setTimeout(() => setIsRoleInputFocused(false), 200)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Add a role"
                    />
                    {isRoleInputFocused && currentRole && (
                      <button
                        type="button"
                        onClick={handleAddRole}
                        className="absolute right-2 top-2 bg-green-500 text-white p-1 rounded-md"
                      >
                        Add
                      </button>
                    )}
                  </div>
                  {formData.roles.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {formData.roles.map(role => (
                        <span
                          key={role}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                        >
                          {role}
                          <button
                            type="button"
                            onClick={() => handleRemoveRole(role)}
                            className="ml-1 text-green-600 hover:text-green-800"
                          >
                            &times;
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {['min', 'mid', 'max'].map((key) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {`${key[0].toUpperCase() + key.slice(1)} Salary *`}
                      </label>
                      <input
                        type="text"
                        name={`salary.${key}`}
                        value={formData.salary[key as keyof SalaryRange]}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder={`e.g. $${key === 'min' ? '50K' : key === 'mid' ? '60K' : '70K'}`}
                        required
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                  <textarea
                    value={formData.descriptions[0].text}
                    onChange={(e) =>
                      setFormData(prev => ({
                        ...prev,
                        descriptions: [{ id: 1, text: e.target.value }]
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Enter job description..."
                    required
                  />
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 rounded-md text-sm font-medium text-white hover:bg-green-700"
                  >
                    Add Job Grade
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddJobGradeModal;

type SalaryRange = {
  min: string;
  mid: string;
  max: string;
};

type JobDescription = {
  id: number;
  text: string;
};

type JobGrade = {
  id: string;
  grade: string;
  title: string;
  experience: string;
  roles: string[];
  salary: SalaryRange;
  descriptions: JobDescription[];
  category?: string;
};
