import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock, MapPin, Users, ExternalLink, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";

const eventTypeColors = {
  "Reunion": "from-purple-500 to-purple-600",
  "Networking": "from-blue-500 to-blue-600",
  "Workshop": "from-green-500 to-green-600",
  "Webinar": "from-indigo-500 to-indigo-600",
  "Social": "from-pink-500 to-pink-600",
  "Career": "from-orange-500 to-orange-600",
  "Fundraising": "from-red-500 to-red-600",
  "Other": "from-gray-500 to-gray-600"
};

const eventTypeBadgeColors = {
  "Reunion": "bg-purple-100 text-purple-800 border-purple-200",
  "Networking": "bg-blue-100 text-blue-800 border-blue-200",
  "Workshop": "bg-green-100 text-green-800 border-green-200",
  "Webinar": "bg-indigo-100 text-indigo-800 border-indigo-200",
  "Social": "bg-pink-100 text-pink-800 border-pink-200",
  "Career": "bg-orange-100 text-orange-800 border-orange-200",
  "Fundraising": "bg-red-100 text-red-800 border-red-200",
  "Other": "bg-gray-100 text-gray-800 border-gray-200"
};

export default function UpcomingEvents({ events, isLoading }) {
  if (isLoading) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            Upcoming Events
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="p-4 rounded-lg border border-slate-200">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-lg" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
                <Skeleton className="h-4 w-full" />
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-24" />
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
          <Calendar className="w-5 h-5 text-purple-600" />
          Upcoming Events
        </CardTitle>
        <Link to={createPageUrl("Events")}>
          <Button variant="outline" size="sm" className="group">
            <ArrowRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        {events.slice(0, 4).map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.01, x: 4 }}
          >
            <div className="p-4 rounded-xl border border-slate-200 hover:border-purple-300 hover:bg-purple-50/30 transition-all duration-200 group cursor-pointer">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 bg-gradient-to-br ${eventTypeColors[event.event_type] || eventTypeColors["Other"]} rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow`}>
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-slate-900 group-hover:text-purple-700 transition-colors line-clamp-1">
                        {event.title}
                      </h4>
                      <p className="text-sm text-slate-600 mt-1">
                        {format(new Date(event.event_date), "MMM d, yyyy")} • {event.start_time}
                      </p>
                    </div>
                  </div>
                  <Badge className={`${eventTypeBadgeColors[event.event_type] || eventTypeBadgeColors["Other"]} border text-xs`}>
                    {event.event_type}
                  </Badge>
                </div>
                
                <p className="text-sm text-slate-600 line-clamp-2 group-hover:text-slate-700 transition-colors">
                  {event.description}
                </p>
                
                <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate max-w-32">{event.location}</span>
                  </div>
                  {event.registration_required && (
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>Registration Required</span>
                    </div>
                  )}
                  {event.max_attendees && (
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>Max {event.max_attendees}</span>
                    </div>
                  )}
                </div>

                {event.registration_url && (
                  <div className="flex justify-end">
                    <Button 
                      asChild 
                      size="sm" 
                      variant="outline"
                      className="bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100 group-hover:shadow-sm transition-all"
                    >
                      <a href={event.registration_url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                        Register <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
        
        {events.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center">
              <Calendar className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">No upcoming events</h3>
            <p className="text-slate-600 text-sm mb-4">Create your first event to get started</p>
            <Link to={createPageUrl("Events")}>
              <Button className="bg-purple-600 hover:bg-purple-700">
                Create Event
              </Button>
            </Link>
          </div>
        )}

        {events.length > 0 && (
          <div className="mt-6 pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">
                {events.length} upcoming events
              </span>
              <Link to={createPageUrl("Events")}>
                <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-700 hover:bg-purple-50">
                  View calendar <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}