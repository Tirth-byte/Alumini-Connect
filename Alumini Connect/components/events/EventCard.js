import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  ExternalLink,
  Edit,
  Trash2
} from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

const eventTypeColors = {
  "Reunion": "bg-purple-100 text-purple-800 border-purple-200",
  "Networking": "bg-blue-100 text-blue-800 border-blue-200",
  "Workshop": "bg-green-100 text-green-800 border-green-200",
  "Webinar": "bg-indigo-100 text-indigo-800 border-indigo-200",
  "Social": "bg-pink-100 text-pink-800 border-pink-200",
  "Career": "bg-orange-100 text-orange-800 border-orange-200",
  "Fundraising": "bg-red-100 text-red-800 border-red-200",
  "Other": "bg-gray-100 text-gray-800 border-gray-200"
};

export default function EventCard({ event, onEdit, onDelete }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col group">
        {event.image_url && (
          <div className="h-48 overflow-hidden relative">
            <img src={event.image_url} alt={event.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
          </div>
        )}
        <CardContent className="p-6 flex-1 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <Badge className={`${eventTypeColors[event.event_type] || eventTypeColors["Other"]} border`}>
                {event.event_type}
              </Badge>
              <div className="flex gap-1">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => onEdit(event)}
                  className="text-slate-400 hover:text-slate-600 h-8 w-8"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-slate-400 hover:text-red-600 h-8 w-8"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Event</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{event.title}"? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => onDelete(event.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Delete Event
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
            <h3 className="text-xl font-bold text-slate-900 line-clamp-2">{event.title}</h3>
            <p className="text-sm text-slate-600 line-clamp-3">{event.description}</p>
          </div>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>{format(new Date(event.event_date), "EEEE, MMMM d, yyyy")}</span>
            </div>
            {(event.start_time || event.end_time) && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>{event.start_time} - {event.end_time}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span>{event.location}</span>
            </div>
            {event.max_attendees && (
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-400" />
                <span>Max {event.max_attendees} attendees</span>
              </div>
            )}
          </div>
          <div className="mt-4 flex gap-2">
            {event.registration_required && (
              <Button asChild className="flex-1" variant={event.registration_url ? "default" : "secondary"}>
                {event.registration_url ? (
                  <a href={event.registration_url} target="_blank" rel="noopener noreferrer">
                    Register Now <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                ) : (
                  <span>
                    <Users className="w-4 h-4 mr-2" /> Registration Required
                  </span>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}