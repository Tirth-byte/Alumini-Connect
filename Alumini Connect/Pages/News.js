import React, { useState, useEffect, useCallback } from "react";
import { News as NewsEntity } from "@/entities/News";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Newspaper, 
  Plus, 
  Calendar, 
  Eye, 
  Search,
  Filter,
  ExternalLink
} from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";

import NewsCard from "../components/news/NewsCard";
import NewsForm from "../components/news/NewsForm";
import NewsFilters from "../components/news/NewsFilters";

export default function News() {
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [filters, setFilters] = useState({
    category: "all",
    published: "all"
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingNews, setEditingNews] = useState(null);

  useEffect(() => {
    loadNews();
  }, []);

  const filterNews = useCallback(() => {
    let filtered = news;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.summary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.author?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Tab filter
    if (activeTab === "published") {
      filtered = filtered.filter(article => article.is_published);
    } else if (activeTab === "featured") {
      filtered = filtered.filter(article => article.is_featured);
    }

    // Category filter
    if (filters.category !== "all") {
      filtered = filtered.filter(article => article.category === filters.category);
    }

    // Published status filter
    if (filters.published !== "all") {
      const isPublished = filters.published === "yes";
      filtered = filtered.filter(article => article.is_published === isPublished);
    }

    setFilteredNews(filtered);
  }, [news, searchTerm, activeTab, filters]);

  useEffect(() => {
    filterNews();
  }, [filterNews]);

  const loadNews = async () => {
    setIsLoading(true);
    try {
      const data = await NewsEntity.list('-publish_date');
      setNews(data);
    } catch (error) {
      console.error('Error loading news:', error);
    }
    setIsLoading(false);
  };

  const handleSaveNews = async (newsData) => {
    try {
      if (editingNews) {
        await NewsEntity.update(editingNews.id, newsData);
      } else {
        await NewsEntity.create(newsData);
      }
      loadNews();
      setShowAddForm(false);
      setEditingNews(null);
    } catch (error) {
      console.error('Error saving news:', error);
    }
  };

  const handleEditNews = (article) => {
    setEditingNews(article);
    setShowAddForm(true);
  };

  const handleCancelForm = () => {
    setShowAddForm(false);
    setEditingNews(null);
  };

  return (
    <div className="p-6 lg:p-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900">News & Updates</h1>
            <p className="text-slate-600 text-lg">Share the latest news and alumni achievements</p>
          </div>
          <Button 
            onClick={() => setShowAddForm(true)}
            className="bg-amber-600 hover:bg-amber-700 shadow-lg"
            size="lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Article
          </Button>
        </div>

        {/* Search, Tabs and Filters */}
        <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  placeholder="Search articles by title, summary, or author..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
              
              {/* Tabs and Filters */}
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <Tabs defaultValue="all" onValueChange={setActiveTab}>
                  <TabsList className="bg-slate-100">
                    <TabsTrigger value="all" className="data-[state=active]:bg-white">
                      All Articles
                    </TabsTrigger>
                    <TabsTrigger value="published" className="data-[state=active]:bg-white">
                      Published
                    </TabsTrigger>
                    <TabsTrigger value="featured" className="data-[state=active]:bg-white">
                      Featured
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
                
                <NewsFilters 
                  filters={filters}
                  setFilters={setFilters}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* News Form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <NewsForm
                article={editingNews}
                onSave={handleSaveNews}
                onCancel={handleCancelForm}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Count */}
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-white/80 text-slate-700">
            {isLoading ? "Loading..." : `${filteredNews.length} articles found`}
          </Badge>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence>
            {isLoading ? (
              Array(6).fill(0).map((_, i) => (
                <Card key={i} className="bg-white/80 backdrop-blur-sm border-slate-200/60">
                  <CardContent className="p-0">
                    <div className="space-y-4">
                      <Skeleton className="h-48 w-full rounded-t-lg" />
                      <div className="p-6 space-y-3">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                        <div className="flex gap-2">
                          <Skeleton className="h-6 w-20" />
                          <Skeleton className="h-6 w-24" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              filteredNews.map((article) => (
                <NewsCard
                  key={article.id}
                  article={article}
                  onEdit={() => handleEditNews(article)}
                />
              ))
            )}
          </AnimatePresence>
        </div>

        {/* No Results */}
        {!isLoading && filteredNews.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
              <Newspaper className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No articles found</h3>
            <p className="text-slate-600">Try adjusting your search terms or create a new article</p>
          </div>
        )}
      </div>
    </div>
  );
}