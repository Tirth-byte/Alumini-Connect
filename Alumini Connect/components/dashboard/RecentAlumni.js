
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, MapPin, Briefcase, Calendar } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function RecentAlumni({ alumni, isLoading }) {
  if (isLoading) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Recently Added Alumni
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-lg border border-slate-200">
              <Skeleton className="w-12 h-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-20" />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" />
          Recently Added Alumni
        </CardTitle>
        <Link to={createPageUrl("AlumniDirectory")}>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        {alumni.slice(0, 5).map((alumnus) => (
          <div key={alumnus.id} className="flex items-center gap-4 p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
            <Avatar className="w-12 h-12">
              <AvatarImage src={alumnus.profile_photo_url} />
              <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                {alumnus.first_name?.[0]}{alumnus.last_name?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-slate-900">
                {alumnus.first_name} {alumnus.last_name}
              </h4>
              <p className="text-sm text-slate-600 truncate">
                {alumnus.current_position} at {alumnus.current_company}
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="outline" className="text-xs">
                  <Calendar className="w-3 h-3 mr-1" />
                  Class of {alumnus.graduation_year}
                </Badge>
                {alumnus.industry && (
                  <Badge variant="outline" className="text-xs">
                    <Briefcase className="w-3 h-3 mr-1" />
                    {alumnus.industry}
                  </Badge>
                )}
                {alumnus.location && (
                  <Badge variant="outline" className="text-xs">
                    <MapPin className="w-3 h-3 mr-1" />
                    {alumnus.location}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        ))}
        {alumni.length === 0 && (
          <div className="text-center py-8">
            <Users className="w-12 h-12 mx-auto text-slate-400 mb-3" />
            <p className="text-slate-600">No alumni added yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
