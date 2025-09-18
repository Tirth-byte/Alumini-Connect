
import React, { useState, useEffect, useCallback } from "react";
import { Event } from "@/entities/Event";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  Plus, 
  Clock, 
  MapPin, 
  Users, 
  ExternalLink,
  Filter
} from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";

import EventCard from "../components/events/EventCard";
import EventForm from "../components/events/EventForm";
import EventFilters from "../components/events/EventFilters";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [filters, setFilters] = useState({
    eventType: "all",
    registrationRequired: "all"
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const filterEvents = useCallback(() => {
    let filtered = events;
    const today = new Date().toISOString().split('T')[0];

    if (activeTab === "upcoming") {
      filtered = filtered.filter(event => event.event_date >= today);
    } else if (activeTab === "past") {
      filtered = filtered.filter(event => event.event_date < today);
    }

    if (filters.eventType !== "all") {
      filtered = filtered.filter(event => event.event_type === filters.eventType);
    }

    if (filters.registrationRequired !== "all") {
      const requiresRegistration = filters.registrationRequired === "yes";
      filtered = filtered.filter(event => event.registration_required === requiresRegistration);
    }

    setFilteredEvents(filtered);
  }, [events, activeTab, filters]);

  useEffect(() => {
    filterEvents();
  }, [filterEvents]);

  const loadEvents = async () => {
    setIsLoading(true);
    try {
      const data = await Event.list('event_date');
      setEvents(data);
    } catch (error) {
      console.error('Error loading events:', error);
    }
    setIsLoading(false);
  };

  const handleSaveEvent = async (eventData) => {
    try {
      if (editingEvent) {
        await Event.update(editingEvent.id, eventData);
      } else {
        await Event.create(eventData);
      }
      loadEvents();
      setShowAddForm(false);
      setEditingEvent(null);
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setShowAddForm(true);
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await Event.delete(eventId);
      loadEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const handleCancelForm = () => {
    setShowAddForm(false);
    setEditingEvent(null);
  };

  return (
    <div className="p-6 lg:p-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900">Events</h1>
            <p className="text-slate-600 text-lg">Manage alumni events and gatherings</p>
          </div>
          <Button 
            onClick={() => setShowAddForm(true)}
            className="bg-purple-600 hover:bg-purple-700 shadow-lg"
            size="lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Event
          </Button>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <Tabs defaultValue="upcoming" onValueChange={setActiveTab}>
                <TabsList className="bg-slate-100">
                  <TabsTrigger value="upcoming" className="data-[state=active]:bg-white">
                    Upcoming Events
                  </TabsTrigger>
                  <TabsTrigger value="past" className="data-[state=active]:bg-white">
                    Past Events
                  </TabsTrigger>
                  <TabsTrigger value="all" className="data-[state=active]:bg-white">
                    All Events
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              
              <EventFilters 
                filters={filters}
                setFilters={setFilters}
              />
            </div>
          </CardContent>
        </Card>

        <AnimatePresence>
          {showAddForm && (
            <EventForm
              event={editingEvent}
              onSave={handleSaveEvent}
              onCancel={handleCancelForm}
            />
          )}
        </AnimatePresence>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-white/80 text-slate-700">
            {isLoading ? "Loading..." : `${filteredEvents.length} events found`}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence>
            {isLoading ? (
              Array(6).fill(0).map((_, i) => (
                <Card key={i} className="bg-white/80 backdrop-blur-sm border-slate-200/60">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <Skeleton className="h-48 w-full rounded-lg" />
                      <div className="space-y-2">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                      </div>
                      <div className="flex gap-2">
                        <Skeleton className="h-6 w-20" />
                        <Skeleton className="h-6 w-24" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              filteredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onEdit={() => handleEditEvent(event)}
                  onDelete={handleDeleteEvent}
                />
              ))
            )}
          </AnimatePresence>
        </div>

        {!isLoading && filteredEvents.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
              <Calendar className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No events found</h3>
            <p className="text-slate-600">Try adjusting your filters or create a new event</p>
          </div>
        )}
      </div>
    </div>
  );
}
