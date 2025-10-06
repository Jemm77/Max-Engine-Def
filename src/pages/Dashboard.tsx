import { useEffect, useState } from "react";
import { MetricCard } from "@/components/MetricCard";
import { FileText, Beaker, Users, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import heroImage from "@/assets/hero-space-lab.jpg";
export const Dashboard = () => {
  const [metrics, setMetrics] = useState({
    totalPublications: 0,
    totalExperiments: 0
  });
  useEffect(() => {
    fetchMetrics();
  }, []);
  const fetchMetrics = async () => {
    // Get sergiobarajas articles
    const {
      data: sergioData,
      error: sergioError
    } = await supabase.from("sergiobarajas").select("*");

    // Get OpeDataScienceExtraction data
    const {
      data: opeData,
      error: opeError
    } = await supabase.from("OpeDataScienceExtraction").select("*");
    if (!sergioError && sergioData && !opeError && opeData) {
      setMetrics({
        totalPublications: sergioData.length,
        totalExperiments: opeData.filter(d => d.AssayTypes).length
      });
    }
  };
  return <div className="space-y-8">
      {/* Hero Section */}
      <Card className="relative overflow-hidden border-border">
        <div className="absolute inset-0">
          <img src={heroImage} alt="NASA Space Biology Lab" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-hero" />
        </div>
        <div className="relative p-12">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              NASA Bioscience Research Intelligence
            </h1>
            <p className="text-lg text-muted-foreground mb-6">Explore space biology research with AI-powered insights and intelligent search capabilities.</p>
            <div className="flex gap-3">
              <a href="/publications" className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:shadow-glow transition-shadow">
                Explore Publications
              </a>
              <a href="/ai-chat" className="px-6 py-3 bg-accent text-accent-foreground rounded-lg font-medium hover:shadow-glow transition-shadow">
                Ask AI Assistant
              </a>
            </div>
          </div>
        </div>
      </Card>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MetricCard title="Total Publications" value={metrics.totalPublications} icon={FileText} description="Research papers in database" />
        <MetricCard title="Experiments" value={metrics.totalExperiments} icon={Beaker} description="Documented assays" />
      </div>

      {/* Recent Activity */}
      
    </div>;
};