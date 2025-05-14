import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Activity, Brain, FileText, Image, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentImages } from "@/components/dashboard/RecentImages";

// Mock data
const chartData = [
  { name: "Jan", value: 12 },
  { name: "Feb", value: 19 },
  { name: "Mar", value: 23 },
  { name: "Apr", value: 17 },
  { name: "May", value: 28 },
  { name: "Jun", value: 34 },
  { name: "Jul", value: 29 },
  { name: "Aug", value: 42 },
];

const Dashboard = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your medical image classification activities
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Images"
          value="218"
          description="+12% from last month"
          icon={<Image className="h-5 w-5" />}
        />
        <StatCard
          title="Classifications"
          value="185"
          description="94 conditions identified"
          icon={<Brain className="h-5 w-5" />}
        />
        <StatCard
          title="Reports Generated"
          value="74"
          description="Last generated 2h ago"
          icon={<FileText className="h-5 w-5" />}
        />
        <StatCard
          title="Team Members"
          value="8"
          description="3 doctors, 5 technicians"
          icon={<Users className="h-5 w-5" />}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-6">
        {/* Activity Chart */}
        <Card className="col-span-6 md:col-span-4">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-0.5">
              <CardTitle>Classification Activity</CardTitle>
              <p className="text-sm text-muted-foreground">
                Images processed over time
              </p>
            </div>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isClient && (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                    tickMargin={8}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                    tickMargin={8}
                  />
                  <Tooltip
                    cursor={{ fill: "hsla(var(--muted)/0.1)" }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border bg-background p-2 shadow-sm">
                            <div className="grid grid-cols-2 gap-2">
                              <div className="flex flex-col">
                                <span className="text-xs font-medium text-muted-foreground">
                                  Month
                                </span>
                                <span className="font-bold">
                                  {payload[0].payload.name}
                                </span>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-xs font-medium text-muted-foreground">
                                  Images
                                </span>
                                <span className="font-bold">
                                  {payload[0].payload.value}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar
                    dataKey="value"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Recent Images */}
        <Card className="col-span-6 md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Images</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="all">
              <div className="px-4">
                <TabsList className="w-full">
                  <TabsTrigger value="all" className="flex-1">
                    All
                  </TabsTrigger>
                  <TabsTrigger value="flagged" className="flex-1">
                    Flagged
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="all" className="m-0">
                <ScrollArea className="h-[320px]">
                  <RecentImages />
                </ScrollArea>
              </TabsContent>
              <TabsContent value="flagged" className="m-0">
                <ScrollArea className="h-[320px]">
                  <RecentImages flaggedOnly />
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
