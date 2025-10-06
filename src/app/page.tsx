"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Search, FileEdit, Trash2, CheckCircle, ArrowRight, Sparkles, TrendingUp, Shield, Zap } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const features = [
    {
      icon: Users,
      title: "Employee Directory",
      description: "View and manage all employees in a comprehensive, sortable table with detailed information.",
      color: "blue"
    },
    {
      icon: Search,
      title: "Search & Filter",
      description: "Quickly find employees using powerful search and filter by department functionality.",
      color: "indigo"
    },
    {
      icon: FileEdit,
      title: "Add & Edit",
      description: "Easily add new employees or update existing records with form validation.",
      color: "violet"
    },
    {
      icon: Trash2,
      title: "Delete Records",
      description: "Remove employee records with confirmation dialogs to prevent accidental deletions.",
      color: "purple"
    },
  ];

  const stats = [
    { value: "100%", label: "Type Safe", icon: Shield },
    { value: "Fast", label: "Performance", icon: Zap },
    { value: "Modern", label: "UI/UX", icon: Sparkles },
    { value: "Scalable", label: "Architecture", icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 dark:bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-400/20 dark:bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-400/10 dark:bg-violet-500/5 rounded-full blur-3xl" />
      </div>

      {/* Hero Section */}
      <div className="relative z-10">
        <div 
          className="absolute inset-0 z-0 opacity-5 dark:opacity-[0.02]"
          style={{
            backgroundImage: "url('https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/e8a42bd9-7fb2-44d4-a8ab-4bf056b18044/generated_images/modern-professional-office-workspace%2c--94a6ebc4-20251006071644.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        
        <div className="relative z-10 container mx-auto px-4 py-24 md:py-36">
          <div className="max-w-5xl mx-auto text-center">
            
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold text-slate-900 dark:text-white mb-12 leading-[1.1] tracking-tight animate-fade-in-up">
              Employee Data
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 dark:from-blue-400 dark:via-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">
                Management
              </span>
            </h1>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up delay-300">
              <Link href="/employees">
                <Button size="lg" className="text-lg px-10 py-7 w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-xl shadow-blue-500/25 dark:shadow-blue-500/10 transition-all hover:scale-105">
                  Open Employee Directory
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-20 animate-fade-in-up delay-500">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 mb-3 group-hover:scale-110 transition-transform">
                    <stat.icon className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 bg-gradient-to-r from-violet-500/10 to-purple-500/10 dark:from-violet-500/20 dark:to-purple-500/20 rounded-full border border-violet-200/50 dark:border-violet-800/50">
            <Sparkles className="h-4 w-4 text-violet-600 dark:text-violet-400" />
            <span className="text-sm font-semibold text-violet-700 dark:text-violet-300">Features</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            Complete CRUD Functionality
          </h2>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Everything you need to manage employee data efficiently, all in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group border-2 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm"
            >
              <CardHeader className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <feature.icon className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
                <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      {/* Tech Stack Section */}
      <div className="relative z-10 container mx-auto px-4 py-24">
        <div className="max-w-5xl mx-auto">
          <Card className="border-2 border-slate-200 dark:border-slate-800 shadow-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full blur-3xl" />
            <CardHeader className="text-center relative z-10 pb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:to-indigo-500/20 rounded-full border border-blue-200/50 dark:border-blue-800/50 w-fit mx-auto">
                <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">Technology Stack</span>
              </div>
              <CardTitle className="text-3xl md:text-4xl font-bold">Built With Modern Technologies</CardTitle>
              <CardDescription className="text-lg mt-2">
                Leveraging the best tools for a robust and scalable application
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {[
                  { name: "Next.js 15", desc: "React Framework", gradient: "from-slate-900 to-slate-700" },
                  { name: "TypeScript", desc: "Type Safety", gradient: "from-blue-600 to-blue-500" },
                  { name: "SQLite", desc: "Database", gradient: "from-sky-600 to-sky-500" },
                  { name: "Drizzle ORM", desc: "Type-safe ORM", gradient: "from-green-600 to-green-500" },
                  { name: "Shadcn/UI", desc: "UI Components", gradient: "from-violet-600 to-violet-500" },
                  { name: "Tailwind CSS", desc: "Styling", gradient: "from-cyan-600 to-cyan-500" },
                ].map((tech, index) => (
                  <div 
                    key={index} 
                    className="group text-center p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-200/50 dark:border-slate-700/50"
                  >
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${tech.gradient} mb-3 group-hover:scale-110 transition-transform`}>
                      <span className="text-white font-bold text-lg">{tech.name.charAt(0)}</span>
                    </div>
                    <div className="font-bold text-slate-900 dark:text-white text-lg mb-1">{tech.name}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">{tech.desc}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="relative overflow-hidden border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50 dark:from-blue-950/50 dark:via-indigo-950/50 dark:to-violet-950/50 shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-violet-400/20 to-purple-400/20 rounded-full blur-3xl" />
            <CardHeader className="relative z-10 space-y-6 py-16 px-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-slate-900/50 rounded-full border border-blue-200/50 dark:border-blue-800/50 w-fit mx-auto backdrop-blur-sm">
                <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">Get Started Today</span>
              </div>
              <CardTitle className="text-4xl md:text-5xl font-bold">Ready to Manage Your Team?</CardTitle>
              <CardDescription className="text-xl max-w-2xl mx-auto">
                Access the employee management system and start organizing your workforce data with ease.
              </CardDescription>
              <div className="pt-6">
                <Link href="/employees">
                  <Button size="lg" className="text-lg px-10 py-7 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-xl shadow-blue-500/25 dark:shadow-blue-500/10 transition-all hover:scale-105">
                    Launch Application
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 container mx-auto px-4 py-10 border-t border-slate-200 dark:border-slate-800 mt-12">
        <div className="text-center">
          <p className="text-slate-600 dark:text-slate-400 mb-2 font-medium">
            Employee Data Management System
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-500">
            Built with Next.js 15, TypeScript, SQLite, and Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  );
}