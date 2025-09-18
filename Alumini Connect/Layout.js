import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Alumni, Event, News } from "@/entities/all";
import { 
  Users, 
  Calendar, 
  Newspaper, 
  BarChart3, 
  GraduationCap,
  Menu,
  Bell
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const navigationItems = [
  {
    title: "Dashboard",
    url: createPageUrl("Dashboard"),
    icon: BarChart3,
  },
  {
    title: "Alumni Directory",
    url: createPageUrl("AlumniDirectory"),
    icon: Users,
  },
  {
    title: "Events",
    url: createPageUrl("Events"),
    icon: Calendar,
  },
  {
    title: "News & Updates",
    url: createPageUrl("News"),
    icon: Newspaper,
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [stats, setStats] = useState({
    totalAlumni: 0,
    activeAlumni: 0,
    upcomingEvents: 0
  });
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setIsLoadingStats(true);
    try {
      const [alumniData, eventsData] = await Promise.all([
        Alumni.list(),
        Event.filter({ event_date: { $gte: new Date().toISOString().split('T')[0] } }, 'event_date')
      ]);
      
      const activeAlumni = alumniData.filter(a => a.is_active !== false);
      
      setStats({
        totalAlumni: alumniData.length,
        activeAlumni: activeAlumni.length,
        upcomingEvents: eventsData.length
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
    setIsLoadingStats(false);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 to-blue-50">
        <Sidebar className="border-r border-slate-200/60 bg-white/80 backdrop-blur-sm">
          <SidebarHeader className="border-b border-slate-200/60 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-lg">AlumniConnect</h2>
                <p className="text-xs text-slate-500 font-medium">Management Platform</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-3">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2">
                Navigation
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className={`hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 rounded-xl h-12 ${
                          location.pathname === item.url 
                            ? 'bg-blue-600 text-white hover:bg-blue-700 hover:text-white shadow-lg' 
                            : 'text-slate-600'
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3 px-4">
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-8">
              <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2">
                Quick Stats
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="px-3 py-2 space-y-3">
                  {isLoadingStats ? (
                    <>
                      <div className="flex items-center justify-between text-sm">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-5 w-8" />
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-5 w-8" />
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-5 w-6" />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600 font-medium">Total Alumni</span>
                        <span className="font-bold text-slate-900 text-lg">{stats.totalAlumni.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600 font-medium">Active Profiles</span>
                        <span className="font-bold text-emerald-600 text-lg">{stats.activeAlumni.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600 font-medium">Upcoming Events</span>
                        <span className="font-bold text-blue-600 text-lg">{stats.upcomingEvents.toLocaleString()}</span>
                      </div>
                      <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-emerald-50 rounded-lg border">
                        <div className="text-xs text-slate-600 mb-1">Engagement Rate</div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-slate-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${stats.totalAlumni > 0 ? (stats.activeAlumni / stats.totalAlumni) * 100 : 0}%` }}
                            />
                          </div>
                          <span className="text-xs font-semibold text-slate-700">
                            {stats.totalAlumni > 0 ? Math.round((stats.activeAlumni / stats.totalAlumni) * 100) : 0}%
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-slate-200/60 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gradient-to-br from-slate-400 to-slate-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">A</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 text-sm">Administrator</p>
                  <p className="text-xs text-slate-500">System Admin</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="text-slate-500">
                <Bell className="w-4 h-4" />
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          {/* Mobile Header */}
          <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 px-6 py-4 lg:hidden">
            <div className="flex items-center justify-between">
              <SidebarTrigger className="hover:bg-slate-100 p-2 rounded-lg transition-colors duration-200">
                <Menu className="w-5 h-5" />
              </SidebarTrigger>
              <div className="flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-blue-600" />
                <h1 className="text-lg font-bold text-slate-900">AlumniConnect</h1>
              </div>
              <Button variant="ghost" size="icon" className="text-slate-500">
                <Bell className="w-4 h-4" />
              </Button>
            </div>
          </header>

          {/* Main Content */}
          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}