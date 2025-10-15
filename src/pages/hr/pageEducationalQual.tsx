import { motion } from 'framer-motion'
import EducationalQualHeader from '../../components/hr/educationalqual/EducationalQualHeader'
import EducationalQualSearchFilters from '../../components/hr/educationalqual/EducationalQualSearchFilters'
import EditEducationalQualModal from '../../components/hr/educationalqual/EditEducationalQualModal'
import DeleteEducationalQualModal from '../../components/hr/educationalqual/DeleteEducationalQualModal'
import EducationalQualList from '../../components/hr/educationalqual/EducationalQualList'
import { useState, useMemo } from 'react'
import type { EducationQualAddDto, EducationQualListDto, EducationQualModDto, UUID } from '../../types/hr/educationalqual'

function PageEducationalQual() {
  const [educationalQuals, setEducationalQuals] = useState<EducationQualListDto[]>([])
  const [editingQual, setEditingQual] = useState<EducationQualModDto | null>(null)
  const [deletingQual, setDeletingQual] = useState<EducationQualListDto | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  // Filter educational qualifications based on search term
  const filteredEducationalQuals = useMemo(() => {
    if (!searchTerm.trim()) return educationalQuals
    
    return educationalQuals.filter(qual =>
      qual.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [educationalQuals, searchTerm])

  const handleAddEducationalQual = (educationalQual: EducationQualAddDto) => {
    // Here you would typically make an API call to save the educational qualification
    console.log('Adding educational qualification:', educationalQual)
    
    // Create a mock EducationQualListDto with all required properties
    const currentDate = new Date().toISOString();
    const newQual: EducationQualListDto = {
      id: crypto.randomUUID() as UUID,
      name: educationalQual.name,
      createdAt: currentDate,
      createdAtAm: currentDate,
      modifiedAt: currentDate,
      modifiedAtAm: currentDate,
      isDeleted: false,
      rowVersion: '1'
    }
    
    setEducationalQuals(prev => [...prev, newQual])
  }

  const handleEditQual = (qual: EducationQualListDto) => {
    console.log('Editing educational qualification:', qual)
    // Convert from ListDto to ModDto for editing
    setEditingQual({
      id: qual.id,
      name: qual.name,
      rowVersion: qual.rowVersion || '1' // Use existing rowVersion or default
    })
  }

  const handleUpdateEducationalQual = (updatedQual: EducationQualModDto) => {
    console.log('Updating educational qualification:', updatedQual)
    
    const currentDate = new Date().toISOString();
    
    // Update the educational qualification in the list
    setEducationalQuals(prev => 
      prev.map(qual => 
        qual.id === updatedQual.id 
          ? { 
              ...qual, 
              name: updatedQual.name,
              rowVersion: updatedQual.rowVersion,
              modifiedAt: currentDate,
              modifiedAtAm: currentDate
            }
          : qual
      )
    )
    
    setEditingQual(null)
  }

  const handleDeleteQual = (qual: EducationQualListDto) => {
    console.log('Opening delete confirmation for:', qual)
    setDeletingQual(qual)
  }

  const handleConfirmDelete = (qual: EducationQualListDto) => {
    console.log('Deleting educational qualification:', qual)
    // Soft delete by setting isDeleted to true, or remove completely
    setEducationalQuals(prev => prev.filter(q => q.id !== qual.id))
    setDeletingQual(null)
  }

  return (
    <motion.section 
      className="min-h-screen bg-gray-50 space-y-6" 
      initial="hidden" 
      animate="visible" 
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
      }}
    >
      <div className="flex justify-between items-center">
        <EducationalQualHeader />
      </div>

      {/* Search and Filters with Add Modal */}
      <EducationalQualSearchFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onAddEducationalQual={handleAddEducationalQual}
      />

      {/* Educational Qualifications List */}
      <EducationalQualList 
        educationalQuals={filteredEducationalQuals}
        onEdit={handleEditQual}
        onDelete={handleDeleteQual}
      />

      {/* Edit Modal */}
      <EditEducationalQualModal
        educationalQual={editingQual}
        onEditEducationalQual={handleUpdateEducationalQual}
        onClose={() => setEditingQual(null)}
      />

      {/* Delete Confirmation Modal */}
      <DeleteEducationalQualModal
        educationalQual={deletingQual}
        isOpen={!!deletingQual}
        onClose={() => setDeletingQual(null)}
        onConfirm={handleConfirmDelete}
      />
    </motion.section>
  )
}

export default PageEducationalQual