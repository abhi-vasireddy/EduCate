import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppStore } from '../store/useAppStore';
import { Users, UserCheck, UserX, Clock, FileText, Ticket, CalendarClock, Target } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { motion } from 'motion/react';

const QuickStat = ({ title, value, icon: Icon, trend, trendUp, delay = 0 }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
  >
    <Card className="hover:shadow-lg transition-shadow border-border/50 h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground truncate pr-2">{title}</CardTitle>
        <div className="p-2 bg-primary/10 rounded-full shrink-0">
          <Icon className="w-4 h-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p className={`text-xs mt-1 ${trendUp ? 'text-emerald-500' : 'text-amber-500'} truncate`}>
            {trendUp ? '↑' : '↓'} {trend} since yesterday
          </p>
        )}
      </CardContent>
    </Card>
  </motion.div>
);

const attendanceData = [
  { name: 'Mon', present: 45, absent: 5, late: 2 },
  { name: 'Tue', present: 48, absent: 2, late: 1 },
  { name: 'Wed', present: 46, absent: 4, late: 3 },
  { name: 'Thu', present: 49, absent: 1, late: 0 },
  { name: 'Fri', present: 44, absent: 6, late: 4 },
];

export function Dashboard() {
  const { teachers, attendance, leaves, tickets } = useAppStore();

  const totalTeachers = teachers.length;
  const presentToday = attendance.filter(a => a.status === 'Present').length;
  const absentToday = attendance.filter(a => a.status === 'Absent').length;
  const pendingLeaves = leaves.filter(l => l.status === 'Pending').length;
  const openTickets = tickets.filter(t => t.status === 'Open').length;

  return (
    <div className="space-y-6 md:space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm md:text-base text-muted-foreground mt-1">Here's what exactly is happening today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <QuickStat title="Total Staff" value={totalTeachers} icon={Users} delay={0} />
        <QuickStat title="Present Today" value={presentToday} icon={UserCheck} trend="2%" trendUp delay={0.1} />
        <QuickStat title="Absent Today" value={absentToday} icon={UserX} trend="1%" trendUp={false} delay={0.2} />
        <QuickStat title="Late Arrivals" value={attendance.filter(a => a.status === 'Late').length} icon={Clock} delay={0.3} />
        <QuickStat title="Pending Leaves" value={pendingLeaves} icon={CalendarClock} delay={0.4} />
        <QuickStat title="Open Tickets" value={openTickets} icon={Ticket} delay={0.5} />
        <QuickStat title="Monthly Payroll" value="$845,200" icon={FileText} delay={0.6} />
        <QuickStat title="Avg Attendance" value="94%" icon={Target} delay={0.7} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }} className="flex">
          <Card className="col-span-1 border-border/50 w-full">
            <CardHeader>
              <CardTitle>Attendance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] sm:h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={attendanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                      itemStyle={{ color: 'hsl(var(--foreground))' }}
                    />
                    <Area type="monotone" dataKey="present" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorPresent)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }} className="flex">
          <Card className="col-span-1 border-border/50 w-full">
            <CardHeader>
              <CardTitle>Leave vs Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] sm:h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={attendanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                       contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                       itemStyle={{ color: 'hsl(var(--foreground))' }}
                       cursor={{ fill: 'hsl(var(--muted)/0.5)' }}
                    />
                    <Bar dataKey="absent" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    <Bar dataKey="late" fill="hsl(var(--ring))" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
