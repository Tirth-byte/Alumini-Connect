import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Save, XCircle } from "lucide-react";

const NEWS_CATEGORIES = [
  "Alumni Achievement", "Campus News", "Event Recap", "Career Spotlight", "University Update", "Research", "Other"
];

export default function NewsForm({ article, onSave, onCancel }) {
  const [formData, setFormData] = useState(article || {
    title: "",
    content: "",
    summary: "",
    category: "",
    author: "",
    publish_date: new Date().toISOString().split('T')[0],
    featured_image_url: "",
    is_published: true,
    is_featured: false,
    external_url: ""
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
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
            {article ? "Edit Article" : "Create New Article"}
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input id="title" value={formData.title} onChange={(e) => handleInputChange('title', e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="summary">Summary *</Label>
              <Textarea id="summary" value={formData.summary} onChange={(e) => handleInputChange('summary', e.target.value)} required rows={3} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Full Content *</Label>
              <Textarea id="content" value={formData.content} onChange={(e) => handleInputChange('content', e.target.value)} required rows={8} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)} required>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>{NEWS_CATEGORIES.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="author">Author *</Label>
                <Input id="author" value={formData.author} onChange={(e) => handleInputChange('author', e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="publish_date">Publish Date *</Label>
                <Input id="publish_date" type="date" value={formData.publish_date} onChange={(e) => handleInputChange('publish_date', e.target.value)} required />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="featured_image_url">Featured Image URL</Label>
                    <Input id="featured_image_url" value={formData.featured_image_url} onChange={(e) => handleInputChange('featured_image_url', e.target.value)} placeholder="https://..." />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="external_url">External URL</Label>
                    <Input id="external_url" value={formData.external_url} onChange={(e) => handleInputChange('external_url', e.target.value)} placeholder="https://..." />
                </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center space-x-2">
                <Switch id="is_published" checked={formData.is_published} onCheckedChange={(checked) => handleInputChange('is_published', checked)} />
                <Label htmlFor="is_published">Published</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="is_featured" checked={formData.is_featured} onCheckedChange={(checked) => handleInputChange('is_featured', checked)} />
                <Label htmlFor="is_featured">Featured Article</Label>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onCancel}>
              <XCircle className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button type="submit" className="bg-amber-600 hover:bg-amber-700">
              <Save className="w-4 h-4 mr-2" />
              {article ? "Update Article" : "Save Article"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
}