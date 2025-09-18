import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Newspaper, Calendar, User, Star } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const categoryColors = {
  "Alumni Achievement": "bg-yellow-100 text-yellow-800",
  "Campus News": "bg-blue-100 text-blue-800",
  "Event Recap": "bg-purple-100 text-purple-800",
  "Career Spotlight": "bg-green-100 text-green-800",
  "University Update": "bg-indigo-100 text-indigo-800",
  "Research": "bg-orange-100 text-orange-800",
  "Other": "bg-gray-100 text-gray-800"
};

export default function RecentNews({ news, isLoading }) {
  if (isLoading) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-amber-600" />
            Recent News
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="p-4 rounded-lg border border-slate-200">
              <div className="space-y-3">
                <Skeleton className="h-5 w-3/4" />
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
          <Newspaper className="w-5 h-5 text-amber-600" />
          Recent News
        </CardTitle>
        <Link to={createPageUrl("News")}>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        {news.slice(0, 4).map((article) => (
          <div key={article.id} className="p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <h4 className="font-semibold text-slate-900 flex-1 line-clamp-2">{article.title}</h4>
                {article.is_featured && (
                  <Star className="w-4 h-4 text-yellow-500 flex-shrink-0 ml-2" />
                )}
              </div>
              <p className="text-sm text-slate-600 line-clamp-2">{article.summary}</p>
              <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {article.author}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {format(new Date(article.publish_date), "MMM d, yyyy")}
                </div>
                <Badge className={categoryColors[article.category] || categoryColors["Other"]} variant="secondary">
                  {article.category}
                </Badge>
              </div>
            </div>
          </div>
        ))}
        {news.length === 0 && (
          <div className="text-center py-8">
            <Newspaper className="w-12 h-12 mx-auto text-slate-400 mb-3" />
            <p className="text-slate-600">No news articles yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}