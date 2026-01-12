import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
import { HolidayList } from '../../components/core/holiday/HolidayList';
import { HolidaySearch } from '../../components/core/holiday/HolidaySearch';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { 
  useHolidays,
  useUpdateHoliday,
  useDeleteHoliday 
} from '../../services/core/holiday/holiday.queries';
import { useFiscalYears } from '../../services/core/fiscalyear/fisc.queries';
import type { HolidayListDto, EditHolidayDto } from '../../types/core/holiday';

export const PageHolidayHist = () => {
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredHolidays, setFilteredHolidays] = useState<HolidayListDto[]>([]);
  const [currentYearHolidays, setCurrentYearHolidays] = useState<HolidayListDto[]>([]);
  const [searchMode, setSearchMode] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [selectedHoliday, setSelectedHoliday] = useState<HolidayListDto | null>(null);

  // React Query hooks
  const {
    data: allHolidays = [],
    isLoading: holidaysLoading,
    error: holidaysError,
    refetch: refetchHolidays,
  } = useHolidays();

  const {
    data: fiscalYears = [],
    isLoading: fiscalYearsLoading,
    error: fiscalYearsError,
  } = useFiscalYears();

  const updateHolidayMutation = useUpdateHoliday({
    onSuccess: () => {
      setFormError(null);
      setSelectedHoliday(null);
    },
    onError: (error) => {
      setFormError(error.message || 'Failed to update holiday');
    },
  });

  const deleteHolidayMutation = useDeleteHoliday({
    onSuccess: () => {
      setFormError(null);
      setSelectedHoliday(null);
    },
    onError: (error) => {
      setFormError(error.message || 'Failed to delete holiday');
    },
  });

  // Set default selected year when fiscal years are loaded
  useMemo(() => {
    if (fiscalYears.length > 0 && !selectedYear) {
      const currentYear = fiscalYears.find(fy => fy.isActive === '0') || fiscalYears[0];
      setSelectedYear(currentYear.name);
    }
  }, [fiscalYears, selectedYear]);

  // Filter current year holidays when selected year or all holidays change
  useMemo(() => {
    if (selectedYear && allHolidays.length > 0) {
      const yearHolidays = allHolidays.filter(holiday => 
        holiday.fiscYear === selectedYear || holiday.fiscalYearName === selectedYear
      );
      setCurrentYearHolidays(yearHolidays);
      setFilteredHolidays(yearHolidays);
    }
  }, [selectedYear, allHolidays]);

  // Filter holidays when search term changes
  useMemo(() => {
    if (searchTerm.trim() === '') {
      setFilteredHolidays(currentYearHolidays);
      setSearchMode(false);
    } else {
      const filtered = allHolidays.filter(holiday =>
        holiday.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (holiday.dateStrAm && holiday.dateStrAm.toLowerCase().includes(searchTerm.toLowerCase())) ||
        holiday.date.includes(searchTerm) ||
        holiday.fiscYear.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (holiday.description && holiday.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (holiday.fiscalYearName && holiday.fiscalYearName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredHolidays(filtered);
      setSearchMode(true);
    }
  }, [searchTerm, currentYearHolidays, allHolidays]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleYearChange = (yearName: string) => {
    setSelectedYear(yearName);
    setSearchTerm(''); // Reset search term when year changes
    setSearchMode(false);
    
    // Scroll to top after a small delay to ensure the state has updated
    setTimeout(() => {
      scrollToTop();
    }, 100);
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  const handleEditHoliday = (holiday: HolidayListDto) => {
    console.log('Edit holiday:', holiday);
    // TODO: Implement edit modal functionality
    setSelectedHoliday(holiday);
    // You can open an edit modal here
  };

  const handleDeleteHoliday = (holiday: HolidayListDto) => {
    console.log('Delete holiday:', holiday);
    setSelectedHoliday(holiday);
    // You can open a delete confirmation modal here
  };

  const handleDeleteConfirmation = async () => {
    if (selectedHoliday) {
      setFormError(null);
      // No try/catch needed - error is handled by mutation's onError
      await deleteHolidayMutation.mutateAsync(selectedHoliday.id);
    }
  };

  const getTotalHolidays = (yearName: string) => {
    return allHolidays.filter(holiday => 
      holiday.fiscYear === yearName || holiday.fiscalYearName === yearName
    ).length;
  };

  const getSearchResultsCountByYear = () => {
    const countByYear: Record<string, number> = {};
    filteredHolidays.forEach(holiday => {
      const yearKey = holiday.fiscYear || holiday.fiscalYearName || 'Unknown';
      countByYear[yearKey] = (countByYear[yearKey] || 0) + 1;
    });
    return countByYear;
  };

  // Get available fiscal years sorted by name (most recent first)
  const availableYears = useMemo(() => {
    return fiscalYears
      .map(fy => fy.name)
      .sort((a, b) => b.localeCompare(a)); // Sort descending (most recent first)
  }, [fiscalYears]);

  // Combined loading state
  const isLoading = holidaysLoading || fiscalYearsLoading;

  // Combine errors from all sources
  const displayError = holidaysError?.message || fiscalYearsError?.message || formError;

  // Clear errors
  const clearErrors = () => {
    setFormError(null);
    if (holidaysError || fiscalYearsError) {
      refetchHolidays();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col space-y-2 mb-8"
        >
          <h1 className="text-2xl font-bold">
            <span className="bg-gradient-to-r from-green-500 via-green-600 to-green-700 bg-clip-text text-transparent mr-2">
              Holiday
            </span>
            History
          </h1>
        </motion.div>

        {/* Error Message */}
        {displayError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6"
          >
            <div className="flex justify-between items-center">
              <span className="font-medium">
                {displayError}
                {displayError.includes('load') && (
                  <button
                    onClick={() => refetchHolidays()}
                    className="ml-2 underline hover:text-red-800 font-semibold"
                    disabled={isLoading}
                  >
                    Try again
                  </button>
                )}
              </span>
              <button
                onClick={clearErrors}
                className="text-red-700 hover:text-red-900 font-bold text-lg ml-4"
              >
                ×
              </button>
            </div>
          </motion.div>
        )}

        {/* Loading State */}
        {isLoading && allHolidays.length === 0 && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          </div>
        )}

        {/* Content */}
        {!isLoading && fiscalYears.length > 0 && (
          <>
            {/* Search Component */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-6"
            >
              <HolidaySearch
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
              />
            </motion.div>

            {/* Current Year Display / Search Results Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {searchMode ? 'Search Results' : `${selectedYear} Holidays`}
                  </h2>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    {filteredHolidays.length} {filteredHolidays.length === 1 ? 'Holiday' : 'Holidays'}
                    {searchMode && ` found across all years`}
                  </Badge>
                </div>
                
                {searchMode ? (
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(getSearchResultsCountByYear()).map(([year, count]) => (
                      <Badge key={year} variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                        {year}: {count}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  searchTerm && (
                    <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                      Searching: "{searchTerm}"
                    </Badge>
                  )
                )}
              </div>
            </motion.div>

            {/* Holidays List */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <HolidayList
                holidays={filteredHolidays}
                loading={isLoading && allHolidays.length === 0}
                onEdit={handleEditHoliday}
                onDelete={handleDeleteHoliday}
                currentFiscalYear={searchMode ? 'all' : selectedYear}
                isUpdating={updateHolidayMutation.isPending}
                isDeleting={deleteHolidayMutation.isPending}
              />
            </motion.div>

            {/* Previous Years Section - Only show when not in search mode */}
            {!searchMode && availableYears.filter(year => year !== selectedYear).length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-12"
              >
                <div className="border-t pt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-green-500" />
                    Previous Years
                  </h3>
                  
                  <div className="grid gap-4">
                    {availableYears
                      .filter(year => year !== selectedYear)
                      .map((year, index) => (
                        <motion.div
                          key={year}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * index }}
                          className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow duration-200"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="bg-green-50 rounded-lg p-3 border">
                                <Calendar className="h-6 w-6 text-green-600" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900 text-lg">
                                  {year} Holidays
                                </h4>
                                <p className="text-gray-600 text-sm mt-1">
                                  {getTotalHolidays(year)} holiday{getTotalHolidays(year) !== 1 ? 's' : ''}
                                </p>
                              </div>
                            </div>
                            
                            <Button
                              variant="outline"
                              onClick={() => handleYearChange(year)}
                              className="flex items-center gap-2"
                            >
                              View Holidays
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                  </div>
                </div>
              </motion.div>
            )}
          </>
        )}

        {/* Empty State */}
        {!isLoading && fiscalYears.length === 0 && !displayError && (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Fiscal Years Found</h3>
            <p className="text-gray-600 mb-4">There are no fiscal years available to display holidays.</p>
          </div>
        )}
      </div>
    </div>
  );
};