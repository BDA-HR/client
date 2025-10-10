import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import type { JobGrade, SalaryRange } from '../../../types/jobgrade';

interface AddJobGradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddGrade: (grade: Omit<JobGrade, "id" | "icon" | "category">) => void;
  skillLevels: string[];
}

const AddJobGradeModal: React.FC<AddJobGradeModalProps> = ({
  isOpen,
  onClose,
  onAddGrade,
  skillLevels,
}) => {
  const [formData, setFormData] = useState<Omit<JobGrade, 'id' | 'icon' | 'category'>>({
    grade: '',
    title: '',
    experience: '',
    roles: [],
    salary: { min: '', mid: '', max: '' },
    skill: skillLevels[0] || '',
    descriptions: [{ id: 1, text: '' }],
  });
  const [currentRole, setCurrentRole] = useState('');
  const [isRoleInputFocused, setIsRoleInputFocused] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name.startsWith('salary.')) {
      const key = name.split('.')[1] as keyof SalaryRange;
      setFormData((p) => ({
        ...p,
        salary: { ...p.salary, [key]: value },
      }));
    } else {
      setFormData((p) => ({ ...p, [name]: value }));
    }
  };

  const handleAddRole = () => {
    const v = currentRole.trim();
    if (v && !formData.roles.includes(v)) {
      setFormData((p) => ({ ...p, roles: [...p.roles, v] }));
      setCurrentRole('');
    }
  };

  const handleRemoveRole = (role: string) => {
    setFormData((p) => ({
      ...p,
      roles: p.roles.filter((r) => r !== role),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const d = formData.descriptions[0]?.text.trim();
    if (
      formData.grade &&
      formData.title &&
      formData.experience &&
      formData.roles.length > 0 &&
      formData.salary.min &&
      formData.salary.mid &&
      formData.salary.max &&
      d &&
      formData.skill
    ) {
      onAddGrade(formData);
      // reset
      setFormData({
        grade: '',
        title: '',
        experience: '',
        roles: [],
        salary: { min: '', mid: '', max: '' },
        skill: skillLevels[0] || '',
        descriptions: [{ id: 1, text: '' }],
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
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
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
                {/* Grade / Title */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">Grade *</label>
                    <input
                      name="grade"
                      value={formData.grade}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:border-green-500 focus:outline-2"
                      placeholder="G1-L1"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Title *</label>
                    <input
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border focus:outline-none focus:border-green-500 focus:outline-2 rounded"
                      placeholder="Junior Engineer"
                      required
                    />
                  </div>
                </div>

                {/* Skill Level */}
                <div>
                  <label className="block text-sm font-medium mb-1">Skill Level *</label>
                  <select
                    name="skill"
                    value={formData.skill}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:border-green-500 focus:outline-2"
                    required
                  >
                    <option value="">Select Skill</option>
                    {skillLevels.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Roles */}
                <div>
                  <label className="block text-sm font-medium mb-1">Roles *</label>
                  <div className="relative">
                    <input
                      value={currentRole}
                      onFocus={() => setIsRoleInputFocused(true)}
                      onBlur={() => setTimeout(() => setIsRoleInputFocused(false), 200)}
                      onChange={(e) => setCurrentRole(e.target.value)}
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:border-green-500 focus:outline-2"
                      placeholder="Add a role"
                    />
                    {isRoleInputFocused && currentRole && (
                      <button
                        type="button"
                        onClick={handleAddRole}
                        className="absolute right-2 top-2 bg-green-500 text-white px-2 rounded"
                      >
                        Add
                      </button>
                    )}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.roles.map((r) => (
                      <span
                        key={r}
                        className="inline-flex items-center px-2 py-1 bg-green-100 rounded text-xs"
                      >
                        {r}
                        <button
                          type="button"
                          onClick={() => handleRemoveRole(r)}
                          className="ml-1 text-green-600 hover:text-green-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Salary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(['min', 'max'] as const).map((k) => (
                    <div key={k}>
                      <label className="block text-sm font-medium mb-1">
                        {k.charAt(0).toUpperCase() + k.slice(1)} Salary *
                      </label>
                      <input
                        name={`salary.${k}`}
                        value={formData.salary[k]}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:border-green-500 focus:outline-2"
                        placeholder={`e.g. ${k === 'min' ? '50K' : k === 'max' ? '60K' : '70K'}`}
                        required
                      />
                    </div>
                  ))}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium mb-1">Description *</label>
                  <textarea
                    value={formData.descriptions[0].text}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        descriptions: [{ id: 1, text: e.target.value }],
                      }))
                    }
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:border-green-500 focus:outline-2"
                    placeholder="Job description..."
                    required
                  />
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-end gap-4 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer">
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
