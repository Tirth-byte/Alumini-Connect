import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export default function StatsCard({ title, value, icon: Icon, bgColor, trend, isLoading, onClick }) {
  if (isLoading) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-16" />
            </div>
            <Skeleton className="w-12 h-12 rounded-xl" />
          </div>
          <Skeleton className="h-4 w-20 mt-4" />
        </CardContent>
      </Card>
    );
  }

  const CardWrapper = onClick ? motion.div : 'div';
  const cardProps = onClick ? {
    whileHover: { scale: 1.02, y: -2 },
    whileTap: { scale: 0.98 },
    className: "cursor-pointer",
    onClick
  } : {};

  return (
    <CardWrapper {...cardProps}>
      <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-600">{title}</p>
              <p className="text-3xl font-bold text-slate-900">
                {typeof value === 'number' ? value.toLocaleString() : value}
              </p>
            </div>
            <div className={`w-12 h-12 bg-gradient-to-br ${bgColor} rounded-xl flex items-center justify-center shadow-lg`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
          </div>
          {trend && (
            <div className="flex items-center mt-4 text-sm">
              <TrendingUp className="w-4 h-4 mr-1 text-emerald-500" />
              <span className="text-emerald-600 font-medium">{trend}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </CardWrapper>
  );
}