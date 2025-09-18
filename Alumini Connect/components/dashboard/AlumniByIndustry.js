import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Briefcase, TrendingUp, Users } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

const industryColors = [
  "from-blue-500 to-blue-600",
  "from-emerald-500 to-emerald-600", 
  "from-purple-500 to-purple-600",
  "from-orange-500 to-orange-600",
  "from-pink-500 to-pink-600",
  "from-indigo-500 to-indigo-600"
];

export default function AlumniByIndustry({ alumni, isLoading }) {
  const navigate = useNavigate();

  const getIndustryStats = () => {
    const industryCount = {};
    alumni.forEach(alumnus => {
      if (alumnus.industry) {
        industryCount[alumnus.industry] = (industryCount[alumnus.industry] || 0) + 1;
      }
    });
    return Object.entries(industryCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 6);
  };

  const handleIndustryClick = (industry) => {
    // Navigate to Alumni Directory with industry filter
    navigate(`${createPageUrl("AlumniDirectory")}?industry=${encodeURIComponent(industry)}`);
  };

  if (isLoading) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-emerald-600" />
            Alumni by Industry
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center gap-3">
                <Skeleton className="w-8 h-8 rounded-lg" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-6 w-8" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  const industryStats = getIndustryStats();
  const totalIndustryAlumni = industryStats.reduce((sum, [, count]) => sum + count, 0);

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-emerald-600" />
          Alumni by Industry
        </CardTitle>
        <Button variant="outline" size="sm" onClick={() => navigate(createPageUrl("AlumniDirectory"))}>
          <Users className="w-4 h-4 mr-2" />
          View All
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {industryStats.map(([industry, count], index) => (
          <motion.div
            key={industry}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, x: 4 }}
            className="cursor-pointer"
            onClick={() => handleIndustryClick(industry)}
          >
            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all duration-200 group">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 bg-gradient-to-br ${industryColors[index % industryColors.length]} rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow`}>
                  <Briefcase className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="text-sm font-medium text-slate-700 group-hover:text-emerald-700 transition-colors">
                    {industry}
                  </span>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="w-16 h-1 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-300"
                        style={{ width: `${(count / Math.max(...industryStats.map(([,c]) => c))) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-500">
                      {Math.round((count / totalIndustryAlumni) * 100)}%
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 group-hover:bg-emerald-100 transition-colors">
                  {count}
                </Badge>
                <TrendingUp className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 transition-colors" />
              </div>
            </div>
          </motion.div>
        ))}
        {industryStats.length === 0 && (
          <div className="text-center py-8">
            <Briefcase className="w-12 h-12 mx-auto text-slate-400 mb-3" />
            <p className="text-slate-600 text-sm">No industry data available</p>
          </div>
        )}
        {industryStats.length > 0 && (
          <div className="mt-6 pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between text-sm text-slate-600">
              <span className="font-medium">Total Categorized</span>
              <span className="font-bold text-emerald-600">{totalIndustryAlumni} alumni</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}