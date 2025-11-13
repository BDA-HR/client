import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Calendar, ChevronDown, Filter } from 'lucide-react';
import { PubHolidayList } from '../../components/core/publicHoliday/PubHolidayList';
import { PubHolidaySearch } from '../../components/core/publicHoliday/PubHolidaySearch';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import type { PubHolidayDto } from '../../types/core/pubHoliday';

// Mock data for demonstration - replace with your actual data
const mockHolidaysData: Record<string, PubHolidayDto[]> = {
  '2024': [
    {
      id: '1',
      name: 'New Year',
      nameAm: 'አዲስ አመት',
      date: '2024-01-01',
      fiscalYear: '2024'
    },
    {
      id: '2',
      name: 'Christmas',
      nameAm: 'ገና',
      date: '2024-01-07',
      fiscalYear: '2024'
    },
    {
      id: '3',
      name: 'Epiphany',
      nameAm: 'ጥምቀት',
      date: '2024-01-19',
      fiscalYear: '2024'
    }
  ],
  '2023': [
    {
      id: '4',
      name: 'New Year',
      nameAm: 'አዲስ አመት',
      date: '2023-01-01',
      fiscalYear: '2023'
    },
    {
      id: '5',
      name: 'Christmas',
      nameAm: 'ገና',
      date: '2023-01-07',
      fiscalYear: '2023'
    },
    {
      id: '7',
      name: 'Easter',
      nameAm: 'ፋሲካ',
      date: '2023-04-16',
      fiscalYear: '2023'
    }
  ],
  '2022': [
    {
      id: '6',
      name: 'New Year',
      nameAm: 'አዲስ አመት',
      date: '2022-01-01',
      fiscalYear: '2022'
    },
    {
      id: '8',
      name: 'Meskel',
      nameAm: 'መስቀል',
      date: '2022-09-27',
      fiscalYear: '2022'
    }
  ]
};

export const PagePubHolidayHist = () => {
  const [selectedYear, setSelectedYear] = useState<string>('2024');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredHolidays, setFilteredHolidays] = useState<PubHolidayDto[]>([]);
  const [allHolidays, setAllHolidays] = useState<PubHolidayDto[]>([]);
  const [currentYearHolidays, setCurrentYearHolidays] = useState<PubHolidayDto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [years, setYears] = useState<string[]>([]);
  const [searchMode, setSearchMode] = useState<boolean>(false);

  // Initialize years and all holidays
  useEffect(() => {
    const initializeData = () => {
      const availableYears = Object.keys(mockHolidaysData).sort((a, b) => parseInt(b) - parseInt(a));
      setYears(availableYears);
      
      // Combine all holidays from all years
      const allHolidaysList: PubHolidayDto[] = [];
      availableYears.forEach(year => {
        allHolidaysList.push(...(mockHolidaysData[year] || []));
      });
      setAllHolidays(allHolidaysList);
      
      if (availableYears.length > 0 && !selectedYear) {
        setSelectedYear(availableYears[0]);
      }
      
      if (selectedYear) {
        loadHolidaysForYear(selectedYear);
      }
    };

    initializeData();
  }, [selectedYear]);

  // Filter holidays based on search term across ALL years
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredHolidays(currentYearHolidays);
      setSearchMode(false);
    } else {
      const filtered = allHolidays.filter(holiday =>
        holiday.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        holiday.nameAm.toLowerCase().includes(searchTerm.toLowerCase()) ||
        holiday.date.includes(searchTerm) ||
        holiday.fiscalYear.includes(searchTerm)
      );
      setFilteredHolidays(filtered);
      setSearchMode(true);
    }
  }, [searchTerm, currentYearHolidays, allHolidays]);

  const loadHolidaysForYear = async (year: string) => {
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const yearHolidays = mockHolidaysData[year] || [];
    setCurrentYearHolidays(yearHolidays);
    setFilteredHolidays(yearHolidays); // Initialize filtered holidays with current year
    setLoading(false);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
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

  const handleEditHoliday = (holiday: PubHolidayDto) => {
    console.log('Edit holiday:', holiday);
    // Implement edit functionality
  };

  const handleDeleteHoliday = (holiday: PubHolidayDto) => {
    console.log('Delete holiday:', holiday);
    // Implement delete functionality
  };

  const getTotalHolidays = (year: string) => {
    return mockHolidaysData[year]?.length || 0;
  };

  const getSearchResultsCountByYear = () => {
    const countByYear: Record<string, number> = {};
    filteredHolidays.forEach(holiday => {
      countByYear[holiday.fiscalYear] = (countByYear[holiday.fiscalYear] || 0) + 1;
    });
    return countByYear;
  };

  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="container mx-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col space-y-2 mb-8"
        >
          <h1 className="text-2xl font-bold">
            <span className="bg-gradient-to-r from-green-500 via-green-600 to-green-700 bg-clip-text text-transparent mr-2">
              Public
            </span>
            Holidays
          </h1>
        </motion.div>

        {/* Year Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <Filter className="h-5 w-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filter by Year:</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {years.map((year, index) => (
                <motion.div
                  key={year}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Button
                    variant={selectedYear === year && !searchMode ? "default" : "outline"}
                    onClick={() => handleYearChange(year)}
                    className={`flex items-center gap-2 ${
                      selectedYear === year && !searchMode
                        ? 'bg-green-600 hover:bg-green-700 text-white' 
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Calendar className="h-4 w-4" />
                    {year}
                    <Badge 
                      variant="secondary" 
                      className={`ml-1 ${
                        selectedYear === year && !searchMode
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {getTotalHolidays(year)}
                    </Badge>
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Search Component */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <PubHolidaySearch 
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
                {searchMode ? 'Search Results' : `${selectedYear} Public Holidays`}
              </h2>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
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
          <PubHolidayList
            holidays={filteredHolidays}
            loading={loading}
            onEdit={handleEditHoliday}
            onDelete={handleDeleteHoliday}
            currentFiscalYear={searchMode ? 'all' : selectedYear}
          />
        </motion.div>

        {/* Previous Years Section - Only show when not in search mode */}
        {!searchMode && years.filter(year => year !== selectedYear).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-12"
          >
            <div className="border-t pt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gray-500" />
                Previous Years
              </h3>
              
              <div className="grid gap-4">
                {years
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
                          <div className="bg-gray-50 rounded-lg p-3 border">
                            <Calendar className="h-6 w-6 text-gray-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 text-lg">
                              {year} Public Holidays
                            </h4>
                            <p className="text-gray-600 text-sm mt-1">
                              {getTotalHolidays(year)} official holiday{getTotalHolidays(year) !== 1 ? 's' : ''}
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
      </div>
    </div>
  );
};