import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Calendar, ChevronDown, Filter } from 'lucide-react';
import { HolidayList } from '../../components/core/holiday/HolidayList';
import { HolidaySearch } from '../../components/core/holiday/HolidaySearch'; // Updated import name
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import type { HolidayListDto } from '../../types/core/holiday'; // Updated import

// Mock data for demonstration - replace with your actual data
const mockHolidaysData: Record<string, HolidayListDto[]> = {
  '2024': [
    {
      id: '1',
      name: 'New Year',
      date: '2024-01-01T00:00:00.000Z',
      dateStr: 'January 01, 2024',
      dateStrAm: 'ጥር 22, 2016',
      description: 'New Year celebration',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
      isActive: true,
      fiscalYearId: 'fy-2024',
      fiscalYearName: '2023/2024',
      isPublic: true,
      isPublicStr: 'Public',
      fiscYear: '2023/2024',
      rowVersion: '1'
    },
    {
      id: '2',
      name: 'Christmas',
      date: '2024-01-07T00:00:00.000Z',
      dateStr: 'January 07, 2024',
      dateStrAm: 'ጥር 28, 2016',
      description: 'Christmas celebration',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
      isActive: true,
      fiscalYearId: 'fy-2024',
      fiscalYearName: '2023/2024',
      isPublic: true,
      isPublicStr: 'Public',
      fiscYear: '2023/2024',
      rowVersion: '1'
    },
    {
      id: '3',
      name: 'Epiphany',
      date: '2024-01-19T00:00:00.000Z',
      dateStr: 'January 19, 2024',
      dateStrAm: 'የካቲት 10, 2016',
      description: 'Epiphany celebration',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
      isActive: true,
      fiscalYearId: 'fy-2024',
      fiscalYearName: '2023/2024',
      isPublic: true,
      isPublicStr: 'Public',
      fiscYear: '2023/2024',
      rowVersion: '1'
    }
  ],
  '2023': [
    {
      id: '4',
      name: 'New Year',
      date: '2023-01-01T00:00:00.000Z',
      dateStr: 'January 01, 2023',
      dateStrAm: 'ጥር 22, 2015',
      description: 'New Year celebration',
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
      isActive: true,
      fiscalYearId: 'fy-2023',
      fiscalYearName: '2022/2023',
      isPublic: true,
      isPublicStr: 'Public',
      fiscYear: '2022/2023',
      rowVersion: '1'
    },
    {
      id: '5',
      name: 'Christmas',
      date: '2023-01-07T00:00:00.000Z',
      dateStr: 'January 07, 2023',
      dateStrAm: 'ጥር 28, 2015',
      description: 'Christmas celebration',
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
      isActive: true,
      fiscalYearId: 'fy-2023',
      fiscalYearName: '2022/2023',
      isPublic: true,
      isPublicStr: 'Public',
      fiscYear: '2022/2023',
      rowVersion: '1'
    },
    {
      id: '7',
      name: 'Easter',
      date: '2023-04-16T00:00:00.000Z',
      dateStr: 'April 16, 2023',
      dateStrAm: 'ሚያዚያ 8, 2015',
      description: 'Easter celebration',
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
      isActive: true,
      fiscalYearId: 'fy-2023',
      fiscalYearName: '2022/2023',
      isPublic: true,
      isPublicStr: 'Public',
      fiscYear: '2022/2023',
      rowVersion: '1'
    }
  ],
  '2022': [
    {
      id: '6',
      name: 'New Year',
      date: '2022-01-01T00:00:00.000Z',
      dateStr: 'January 01, 2022',
      dateStrAm: 'ጥር 22, 2014',
      description: 'New Year celebration',
      createdAt: '2022-01-01T00:00:00.000Z',
      updatedAt: '2022-01-01T00:00:00.000Z',
      isActive: true,
      fiscalYearId: 'fy-2022',
      fiscalYearName: '2021/2022',
      isPublic: true,
      isPublicStr: 'Public',
      fiscYear: '2021/2022',
      rowVersion: '1'
    },
    {
      id: '8',
      name: 'Meskel',
      date: '2022-09-27T00:00:00.000Z',
      dateStr: 'September 27, 2022',
      dateStrAm: 'መስከረም 17, 2014',
      description: 'Meskel celebration',
      createdAt: '2022-01-01T00:00:00.000Z',
      updatedAt: '2022-01-01T00:00:00.000Z',
      isActive: true,
      fiscalYearId: 'fy-2022',
      fiscalYearName: '2021/2022',
      isPublic: true,
      isPublicStr: 'Public',
      fiscYear: '2021/2022',
      rowVersion: '1'
    }
  ]
};

export const PageHolidayHist = () => {
  const [selectedYear, setSelectedYear] = useState<string>('2024');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredHolidays, setFilteredHolidays] = useState<HolidayListDto[]>([]);
  const [allHolidays, setAllHolidays] = useState<HolidayListDto[]>([]);
  const [currentYearHolidays, setCurrentYearHolidays] = useState<HolidayListDto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [years, setYears] = useState<string[]>([]);
  const [searchMode, setSearchMode] = useState<boolean>(false);

  // Initialize years and all holidays
  useEffect(() => {
    const initializeData = () => {
      const availableYears = Object.keys(mockHolidaysData).sort((a, b) => parseInt(b) - parseInt(a));
      setYears(availableYears);
      
      // Combine all holidays from all years
      const allHolidaysList: HolidayListDto[] = [];
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
        holiday.dateStrAm?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        holiday.date.includes(searchTerm) ||
        holiday.fiscYear.includes(searchTerm) ||
        (holiday.description && holiday.description.toLowerCase().includes(searchTerm.toLowerCase()))
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

  const handleEditHoliday = (holiday: HolidayListDto) => {
    console.log('Edit holiday:', holiday);
    // Implement edit functionality
  };

  const handleDeleteHoliday = (holiday: HolidayListDto) => {
    console.log('Delete holiday:', holiday);
    // Implement delete functionality
  };

  const getTotalHolidays = (year: string) => {
    return mockHolidaysData[year]?.length || 0;
  };

  const getSearchResultsCountByYear = () => {
    const countByYear: Record<string, number> = {};
    filteredHolidays.forEach(holiday => {
      countByYear[holiday.fiscYear] = (countByYear[holiday.fiscYear] || 0) + 1;
    });
    return countByYear;
  };

  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="container ">
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
        {/* Search Component */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <HolidaySearch // Updated component name
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
              <h3 className="text-lg font-semibold text--900 mb-6 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-500" />
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
      </div>
    </div>
  );
};