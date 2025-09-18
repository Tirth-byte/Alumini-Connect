import React, { useState, useEffect, useCallback } from "react";
import { Alumni } from "@/entities/Alumni";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  Plus, 
  MapPin, 
  Briefcase, 
  Calendar,
  LinkedinIcon,
  Mail,
  Phone
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";

import AlumniCard from "../components/alumni/AlumniCard";
import AlumniFilters from "../components/alumni/AlumniFilters";
import AlumniForm from "../components/alumni/AlumniForm";

export default function AlumniDirectory() {
  const [alumni, setAlumni] = useState([]);
  const [filteredAlumni, setFilteredAlumni] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    graduationYear: "all",
    industry: "all",
    location: "all"
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAlumni, setEditingAlumni] = useState(null);

  useEffect(() => {
    loadAlumni();
    
    // Check for URL parameters to set initial filters
    const urlParams = new URLSearchParams(window.location.search);
    const industryParam = urlParams.get('industry');
    if (industryParam) {
      setFilters(prev => ({
        ...prev,
        industry: industryParam
      }));
    }
  }, []);

  const filterAlumni = useCallback(() => {
    let filtered = alumni;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(alumnus =>
        `${alumnus.first_name} ${alumnus.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alumnus.current_company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alumnus.major?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Year filter
    if (filters.graduationYear !== "all") {
      filtered = filtered.filter(alumnus => alumnus.graduation_year?.toString() === filters.graduationYear);
    }

    // Industry filter
    if (filters.industry !== "all") {
      filtered = filtered.filter(alumnus => alumnus.industry === filters.industry);
    }

    // Location filter
    if (filters.location !== "all") {
      filtered = filtered.filter(alumnus => alumnus.location?.toLowerCase().includes(filters.location.toLowerCase()));
    }

    setFilteredAlumni(filtered);
  }, [alumni, searchTerm, filters]);

  useEffect(() => {
    filterAlumni();
  }, [filterAlumni]);

  const loadAlumni = async () => {
    setIsLoading(true);
    try {
      const data = await Alumni.list('-created_date');
      setAlumni(data);
    } catch (error) {
      console.error('Error loading alumni:', error);
    }
    setIsLoading(false);
  };

  const handleSaveAlumni = async (alumniData) => {
    try {
      if (editingAlumni) {
        await Alumni.update(editingAlumni.id, alumniData);
      } else {
        await Alumni.create(alumniData);
      }
      loadAlumni();
      setShowAddForm(false);
      setEditingAlumni(null);
    } catch (error) {
      console.error('Error saving alumni:', error);
    }
  };

  const handleEditAlumni = (alumnus) => {
    setEditingAlumni(alumnus);
    setShowAddForm(true);
  };

  const handleCancelForm = () => {
    setShowAddForm(false);
    setEditingAlumni(null);
  };

  const clearIndustryFilter = () => {
    setFilters(prev => ({ ...prev, industry: "all" }));
    // Update URL to remove industry parameter
    const url = new URL(window.location);
    url.searchParams.delete('industry');
    window.history.replaceState({}, '', url);
  };

  return (
    <div className="p-6 lg:p-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900">Alumni Directory</h1>
            <p className="text-slate-600 text-lg">Connect with {alumni.length} alumni from our network</p>
          </div>
          <Button 
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 hover:bg-blue-700 shadow-lg"
            size="lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Alumni
          </Button>
        </div>

        {/* Active Industry Filter Banner */}
        {filters.industry !== "all" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-50 border border-blue-200 rounded-lg p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Briefcase className="w-5 h-5 text-blue-600" />
                <span className="text-blue-800 font-medium">
                  Filtering by industry: <strong>{filters.industry}</strong>
                </span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearIndustryFilter}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-100"
              >
                Clear Filter
              </Button>
            </div>
          </motion.div>
        )}

        {/* Search and Filters */}
        <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  placeholder="Search by name, company, or major..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
              
              {/* Filters */}
              <AlumniFilters 
                filters={filters}
                setFilters={setFilters}
                alumni={alumni}
              />
            </div>
          </CardContent>
        </Card>

        {/* Alumni Form */}
        <AnimatePresence>
          {showAddForm && (
            <AlumniForm
              alumnus={editingAlumni}
              onSave={handleSaveAlumni}
              onCancel={handleCancelForm}
            />
          )}
        </AnimatePresence>

        {/* Results Count */}
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-white/80 text-slate-700">
            {isLoading ? "Loading..." : `${filteredAlumni.length} alumni found`}
          </Badge>
          {filters.industry !== "all" && filteredAlumni.length < alumni.length && (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              {alumni.length - filteredAlumni.length} filtered out
            </Badge>
          )}
        </div>

        {/* Alumni Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence>
            {isLoading ? (
              Array(6).fill(0).map((_, i) => (
                <Card key={i} className="bg-white/80 backdrop-blur-sm border-slate-200/60">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <Skeleton className="w-16 h-16 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-5 w-32" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                      </div>
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                      <div className="flex gap-2">
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-6 w-20" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              filteredAlumni.map((alumnus) => (
                <AlumniCard
                  key={alumnus.id}
                  alumnus={alumnus}
                  onEdit={() => handleEditAlumni(alumnus)}
                />
              ))
            )}
          </AnimatePresence>
        </div>

        {/* No Results */}
        {!isLoading && filteredAlumni.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No alumni found</h3>
            <p className="text-slate-600">Try adjusting your search terms or filters</p>
            {filters.industry !== "all" && (
              <Button 
                variant="outline" 
                className="mt-4" 
                onClick={clearIndustryFilter}
              >
                Clear Industry Filter
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}