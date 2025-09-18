import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Save, XCircle, Upload, Image } from "lucide-react";
import { UploadFile } from "@/integrations/Core";

const EVENT_TYPES = [
  "Reunion", "Networking", "Workshop", "Webinar", "Social", "Career", "Fundraising", "Other"
];

export default function EventForm({ event, onSave, onCancel }) {
  const [formData, setFormData] = useState(event || {
    title: "",
    description: "",
    event_date: "",
    start_time: "",
    end_time: "",
    location: "",
    event_type: "",
    registration_required: false,
    max_attendees: "",
    registration_deadline: "",
    contact_email: "",
    image_url: "",
    registration_url: "",
    is_featured: false
  });

  const [isUploading, setIsUploading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const result = await UploadFile({ file });
      handleInputChange('image_url', result.file_url);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    }
    setIsUploading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSave = {
      ...formData,
      max_attendees: formData.max_attendees ? parseInt(formData.max_attendees) : undefined,
    };
    onSave(dataToSave);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card className="bg-white/90 backdrop-blur-sm border-slate-200/60 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl">
            {event ? "Edit Event" : "Create New Event"}
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Event Title *</Label>
              <Input 
                id="title" 
                value={formData.title} 
                onChange={(e) => handleInputChange('title', e.target.value)} 
                placeholder="Enter event title"
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea 
                id="description" 
                value={formData.description} 
                onChange={(e) => handleInputChange('description', e.target.value)} 
                placeholder="Describe your event..."
                required 
                rows={4} 
              />
            </div>

            {/* Image Upload Section */}
            <div className="space-y-2">
              <Label>Event Image</Label>
              <div className="flex flex-col gap-4">
                {formData.image_url && (
                  <div className="relative">
                    <img 
                      src={formData.image_url} 
                      alt="Event preview" 
                      className="w-full h-48 object-cover rounded-lg border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => handleInputChange('image_url', '')}
                    >
                      Remove
                    </Button>
                  </div>
                )}
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      placeholder="Or paste image URL..."
                      value={formData.image_url}
                      onChange={(e) => handleInputChange('image_url', e.target.value)}
                    />
                  </div>
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('image-upload')?.click()}
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        <>
                          <Upload className="w-4 h-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Image className="w-4 h-4 mr-2" />
                          Upload
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="event_date">Date *</Label>
                <Input 
                  id="event_date" 
                  type="date" 
                  value={formData.event_date} 
                  onChange={(e) => handleInputChange('event_date', e.target.value)} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="start_time">Start Time</Label>
                <Input 
                  id="start_time" 
                  type="time" 
                  value={formData.start_time} 
                  onChange={(e) => handleInputChange('start_time', e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_time">End Time</Label>
                <Input 
                  id="end_time" 
                  type="time" 
                  value={formData.end_time} 
                  onChange={(e) => handleInputChange('end_time', e.target.value)} 
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input 
                  id="location" 
                  value={formData.location} 
                  onChange={(e) => handleInputChange('location', e.target.value)} 
                  placeholder="Event venue or address"
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="event_type">Event Type *</Label>
                <Select value={formData.event_type} onValueChange={(value) => handleInputChange('event_type', value)} required>
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    {EVENT_TYPES.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch 
                id="registration_required" 
                checked={formData.registration_required} 
                onCheckedChange={(checked) => handleInputChange('registration_required', checked)} 
              />
              <Label htmlFor="registration_required">Registration Required</Label>
            </div>

            {formData.registration_required && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-lg">
                <div className="space-y-2">
                  <Label htmlFor="max_attendees">Max Attendees</Label>
                  <Input 
                    id="max_attendees" 
                    type="number" 
                    min="1"
                    value={formData.max_attendees} 
                    onChange={(e) => handleInputChange('max_attendees', e.target.value)}
                    placeholder="100" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="registration_deadline">Registration Deadline</Label>
                  <Input 
                    id="registration_deadline" 
                    type="date" 
                    value={formData.registration_deadline} 
                    onChange={(e) => handleInputChange('registration_deadline', e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="registration_url">Registration URL</Label>
                  <Input 
                    id="registration_url" 
                    type="url"
                    value={formData.registration_url} 
                    onChange={(e) => handleInputChange('registration_url', e.target.value)} 
                    placeholder="https://eventbrite.com/..."
                  />
                </div>
                <div className="space-y-2 md:col-span-2 lg:col-span-3">
                  <Label htmlFor="contact_email">Contact Email</Label>
                  <Input 
                    id="contact_email" 
                    type="email"
                    value={formData.contact_email} 
                    onChange={(e) => handleInputChange('contact_email', e.target.value)} 
                    placeholder="events@university.edu"
                  />
                </div>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Switch 
                id="is_featured" 
                checked={formData.is_featured} 
                onCheckedChange={(checked) => handleInputChange('is_featured', checked)} 
              />
              <Label htmlFor="is_featured">Featured Event</Label>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onCancel}>
              <XCircle className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-purple-600 hover:bg-purple-700"
              disabled={isUploading}
            >
              <Save className="w-4 h-4 mr-2" />
              {event ? "Update Event" : "Create Event"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
}