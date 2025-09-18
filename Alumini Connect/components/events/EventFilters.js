import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from "lucide-react";

const EVENT_TYPES = [
  "Reunion", "Networking", "Workshop", "Webinar", "Social", "Career", "Fundraising", "Other"
];

export default function EventFilters({ filters, setFilters }) {
  return (
    <div className="flex flex-wrap gap-4">
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-slate-500" />
        <Select 
          value={filters.eventType} 
          onValueChange={(value) => setFilters({...filters, eventType: value})}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Event Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {EVENT_TYPES.map(type => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Select 
          value={filters.registrationRequired} 
          onValueChange={(value) => setFilters({...filters, registrationRequired: value})}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Registration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Registration</SelectItem>
            <SelectItem value="yes">Registration Required</SelectItem>
            <SelectItem value="no">No Registration</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}