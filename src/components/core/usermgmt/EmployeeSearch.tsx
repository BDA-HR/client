import { Search } from "lucide-react";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";

interface EmployeeSearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onAddAccount: () => void; // Added this prop
}

const EmployeeSearch: React.FC<EmployeeSearchProps> = ({
  searchQuery,
  onSearchChange,
  onAddAccount, // Destructure it
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for employee with code:", searchQuery);
  };

  return (
    <div className="flex items-center justify-between gap-4 mb-6">
      <form 
        onSubmit={handleSubmit} 
        className="flex-1 max-w-md"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search employee by unique code..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-4 py-2 w-full"
          />
        </div>
      </form>
      
      <Button
        onClick={onAddAccount} // Use the prop here
        className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:bg-emerald-700 rounded-md text-white flex items-center gap-2 cursor-pointer"
      >
        Add Account
      </Button>
    </div>
  );
};

export default EmployeeSearch;