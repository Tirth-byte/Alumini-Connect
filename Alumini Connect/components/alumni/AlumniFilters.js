import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from "lucide-react";

export default function AlumniFilters({ filters, setFilters, alumni }) {
  // Get unique values for filter options
  const getUniqueYears = () => {
    const years = [...new Set(alumni.map(a => a.graduation_year).filter(Boolean))];
    return years.sort((a, b) => b - a);
  };

  const getUniqueIndustries = () => {
    return [...new Set(alumni.map(a => a.industry).filter(Boolean))].sort();
  };

  const getUniqueLocations = () => {
    return [...new Set(alumni.map(a => a.location).filter(Boolean))].sort();
  };

  return (
    <div className="flex flex-wrap gap-4">
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-slate-500" />
        <Select 
          value={filters.graduationYear} 
          onValueChange={(value) => setFilters({...filters, graduationYear: value})}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Graduation Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years</SelectItem>
            {getUniqueYears().map(year => (
              <SelectItem key={year} value={year.toString()}>
                Class of {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Select 
          value={filters.industry} 
          onValueChange={(value) => setFilters({...filters, industry: value})}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Industry" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Industries</SelectItem>
            {getUniqueIndustries().map(industry => (
              <SelectItem key={industry} value={industry}>
                {industry}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Select 
          value={filters.location} 
          onValueChange={(value) => setFilters({...filters, location: value})}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            {getUniqueLocations().map(location => (
              <SelectItem key={location} value={location}>
                {location}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}