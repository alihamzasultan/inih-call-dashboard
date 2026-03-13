import { useEffect, useState } from "react";
import { Users, RefreshCw, UserCheck, TrendingUp, DollarSign, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/dashboard/StatCard";
import { LeadsTable } from "@/components/dashboard/LeadsTable";
import { Lead } from "@/types/lead";
import { leadsSupabase } from "@/integrations/supabase/leadsClient";
import { toast } from "sonner";

const Index = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadLeads = async (showToast = false) => {
    if (showToast) setRefreshing(true);
    try {
      const { data, error } = await leadsSupabase
        .from("leads")
        .select("*")
        .eq("channel", "call")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setLeads(data || []);

      if (showToast) {
        toast.success(`Loaded ${data?.length || 0} call leads successfully!`);
      }
    } catch (error) {
      toast.error("Failed to fetch leads");
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadLeads();
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => loadLeads(), 30000);
    return () => clearInterval(interval);
  }, []);

  const stats = {
    total: leads.length,
    newLeads: leads.filter((l) => l.status === "new").length,
    qualified: leads.filter((l) => l.status === "qualified" || l.status === "contacted").length,
    totalValue: leads.reduce((sum, l) => sum + (l.lead_price || 0), 0),
    highScore: leads.filter((l) => l.lead_score === "green").length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
          <div className="animate-pulse">
            <Phone className="w-16 h-16 mx-auto text-primary" />
          </div>
          <p className="text-muted-foreground">Loading call analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold">INIH SOLUTIONS LLC' Calls analytics</h1>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Real-time call lead management
                </p>
              </div>
            </div>
            <Button
              id="refresh-leads-btn"
              onClick={() => loadLeads(true)}
              disabled={refreshing}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Calls"
            value={stats.total}
            icon={Phone}
            variant="default"
          />
          <StatCard
            title="New"
            value={stats.newLeads}
            icon={UserCheck}
            variant="warning"
          />
          <StatCard
            title="High Score"
            value={stats.highScore}
            icon={TrendingUp}
            variant="success"
          />
          <StatCard
            title="Value"
            value={`$${stats.totalValue.toLocaleString()}`}
            icon={DollarSign}
            variant="default"
          />
        </div>

        {/* Leads Table */}
        <div className="bg-card rounded-lg border shadow-sm">
          <LeadsTable leads={leads} />
        </div>
      </main>
    </div>
  );
};

export default Index;



