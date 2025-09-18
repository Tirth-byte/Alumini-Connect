import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  User, 
  ExternalLink,
  Edit,
  Star
} from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

const categoryColors = {
  "Alumni Achievement": "bg-yellow-100 text-yellow-800 border-yellow-200",
  "Campus News": "bg-blue-100 text-blue-800 border-blue-200",
  "Event Recap": "bg-purple-100 text-purple-800 border-purple-200",
  "Career Spotlight": "bg-green-100 text-green-800 border-green-200",
  "University Update": "bg-indigo-100 text-indigo-800 border-indigo-200",
  "Research": "bg-orange-100 text-orange-800 border-orange-200",
  "Other": "bg-gray-100 text-gray-800 border-gray-200"
};

export default function NewsCard({ article, onEdit }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col group">
        {article.featured_image_url && (
          <div className="h-48 overflow-hidden">
            <img src={article.featured_image_url} alt={article.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
          </div>
        )}
        <CardContent className="p-6 flex-1 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <Badge className={`${categoryColors[article.category] || categoryColors["Other"]} border`}>
                {article.category}
              </Badge>
              <div className="flex items-center gap-1">
                {article.is_featured && <Star className="w-4 h-4 text-yellow-500" />}
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => onEdit(article)}
                  className="text-slate-400 hover:text-slate-600 -mt-2 -mr-2"
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <h3 className="text-xl font-bold text-slate-900 line-clamp-2">{article.title}</h3>
            <p className="text-sm text-slate-600 line-clamp-3">{article.summary}</p>
          </div>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-slate-400" />
              <span>By {article.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>{format(new Date(article.publish_date), "MMMM d, yyyy")}</span>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            {article.external_url && (
              <Button asChild className="flex-1" variant="outline">
                <a href={article.external_url} target="_blank" rel="noopener noreferrer">
                  Read More <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </Button>
            )}
            <Badge variant={article.is_published ? "default" : "secondary"}>
              {article.is_published ? "Published" : "Draft"}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}