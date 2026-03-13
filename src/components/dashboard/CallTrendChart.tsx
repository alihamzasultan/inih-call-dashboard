import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format, parseISO, startOfDay, eachDayOfInterval, subDays } from "date-fns";
import { Lead } from "@/types/lead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CallTrendChartProps {
  leads: Lead[];
}

export const CallTrendChart = ({ leads }: CallTrendChartProps) => {
  const chartData = useMemo(() => {
    if (leads.length === 0) return [];

    // Get last 7 days including today
    const end = startOfDay(new Date());
    const start = subDays(end, 6);
    
    const days = eachDayOfInterval({ start, end });
    
    // Group leads by day
    const countsByDay = leads.reduce((acc, lead) => {
      if (!lead.created_at) return acc;
      const day = format(startOfDay(parseISO(lead.created_at)), "MMM dd");
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return days.map((date) => {
      const dayLabel = format(date, "MMM dd");
      return {
        date: dayLabel,
        calls: countsByDay[dayLabel] || 0,
      };
    });
  }, [leads]);

  return (
    <Card className="w-full mt-4">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Call Volume (Recent 7 Days)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="date" 
                stroke="#888888" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
              />
              <YAxis 
                stroke="#888888" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                tickFormatter={(value) => `${value}`}
                allowDecimals={false}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "#1f2937", 
                  border: "none", 
                  borderRadius: "8px",
                  color: "#fff"
                }}
                itemStyle={{ color: "#fff" }}
              />
              <Line
                type="monotone"
                dataKey="calls"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ r: 4, fill: "#3b82f6" }}
                activeDot={{ r: 6, fill: "#3b82f6" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

