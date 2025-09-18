import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Briefcase, 
  Calendar, 
  Mail, 
  Phone, 
  LinkedinIcon, 
  Edit,
  GraduationCap 
} from "lucide-react";
import { motion } from "framer-motion";

export default function AlumniCard({ alumnus, onEdit }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Header with Avatar and Edit Button */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16 border-2 border-white shadow-lg">
                  <AvatarImage src={alumnus.profile_photo_url} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-semibold text-lg">
                    {alumnus.first_name?.[0]}{alumnus.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <h3 className="text-xl font-bold text-slate-900 truncate">
                    {alumnus.first_name} {alumnus.last_name}
                  </h3>
                  <p className="text-sm text-slate-600 truncate">
                    {alumnus.current_position}
                  </p>
                  <p className="text-sm font-medium text-blue-600 truncate">
                    {alumnus.current_company}
                  </p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => onEdit(alumnus)}
                className="text-slate-400 hover:text-slate-600"
              >
                <Edit className="w-4 h-4" />
              </Button>
            </div>

            {/* Bio */}
            {alumnus.bio && (
              <p className="text-sm text-slate-600 line-clamp-3">
                {alumnus.bio}
              </p>
            )}

            {/* Details */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-slate-400" />
                <span className="text-slate-600">
                  {alumnus.degree} in {alumnus.major} • Class of {alumnus.graduation_year}
                </span>
              </div>
              {alumnus.industry && (
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600">{alumnus.industry}</span>
                </div>
              )}
              {alumnus.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600">{alumnus.location}</span>
                </div>
              )}
            </div>

            {/* Tags */}
            {alumnus.tags && alumnus.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {alumnus.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {alumnus.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{alumnus.tags.length - 3} more
                  </Badge>
                )}
              </div>
            )}

            {/* Contact Buttons */}
            <div className="flex gap-2 pt-2">
              {alumnus.email && (
                <Button variant="outline" size="sm" asChild className="flex-1">
                  <a href={`mailto:${alumnus.email}`}>
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </a>
                </Button>
              )}
              {alumnus.linkedin_url && (
                <Button variant="outline" size="sm" asChild className="flex-1">
                  <a href={alumnus.linkedin_url} target="_blank" rel="noopener noreferrer">
                    <LinkedinIcon className="w-4 h-4 mr-2" />
                    LinkedIn
                  </a>
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}