import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "success" | "warning" | "destructive";
}

export function StatCard({ title, value, icon: Icon, trend, variant = "default" }: StatCardProps) {
  const variantClasses = {
    default: "from-primary/10 to-primary/5 text-primary",
    success: "from-success/10 to-success/5 text-success",
    warning: "from-warning/10 to-warning/5 text-warning",
    destructive: "from-destructive/10 to-destructive/5 text-destructive",
  };

  return (
    <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105 animate-fade-in">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold tracking-tight">{value}</p>
            {trend && (
              <p className={`text-xs ${trend.isPositive ? "text-success" : "text-destructive"}`}>
                {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}% from last period
              </p>
            )}
          </div>
          <div
            className={`p-4 rounded-2xl bg-gradient-to-br ${variantClasses[variant]} transition-transform duration-300 hover:rotate-12`}
          >
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </div>
      <div className={`h-1 w-full bg-gradient-to-r ${variantClasses[variant]}`} />
    </Card>
  );
}
