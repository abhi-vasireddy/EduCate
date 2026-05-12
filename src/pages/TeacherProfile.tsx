import { useParams, Link } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Mail, Phone, Calendar, Hash, Building2, Briefcase, BadgeCheck, FileText } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function TeacherProfile() {
  const { id } = useParams();
  const { teachers } = useAppStore();
  const teacher = teachers.find(t => t.id === id);

  if (!teacher) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <h2 className="text-2xl font-bold mb-4">Staff member not found</h2>
        <Link to="/teachers" className={buttonVariants()}>Back to Directory</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Link to="/teachers" className={buttonVariants({ variant: "ghost", size: "icon", className: "rounded-full" })}>
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Staff Profile</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1 border-border/50 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-primary/20 to-primary/5"></div>
          <CardContent className="pt-20 pb-6 flex flex-col items-center text-center relative z-10">
            <Avatar className="h-24 w-24 border-4 border-background shadow-md mb-4">
              <AvatarImage src={teacher.avatar} />
              <AvatarFallback className="text-2xl">{teacher.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-bold">{teacher.name}</h2>
            <p className="text-muted-foreground mb-4">{teacher.designation}</p>
            <Badge variant={
                        teacher.status === 'Active' ? 'default' : 
                        teacher.status === 'On Leave' ? 'secondary' : 'destructive'
                      } className={
                        teacher.status === 'Active' ? 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 shadow-none border-0' :
                        teacher.status === 'On Leave' ? 'bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 shadow-none border-0' :
                        'bg-red-500/10 text-red-600 hover:bg-red-500/20 shadow-none border-0'
                      }>
              {teacher.status}
            </Badge>
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-2 border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Hash className="w-4 h-4" /> Employee ID
              </p>
              <p className="font-medium">{teacher.employeeId}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Mail className="w-4 h-4" /> Email
              </p>
              <p className="font-medium">{teacher.email}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Phone className="w-4 h-4" /> Phone
              </p>
              <p className="font-medium">{teacher.phone}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Building2 className="w-4 h-4" /> Department
              </p>
              <p className="font-medium">{teacher.department}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Joining Date
              </p>
              <p className="font-medium">{new Date(teacher.joiningDate).toLocaleDateString()}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <BadgeCheck className="w-4 h-4" /> Biometric ID
              </p>
              <p className="font-medium font-mono bg-muted px-2 py-0.5 rounded-md inline-block text-sm">{teacher.fingerprintId}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50 shadow-sm">
        <Tabs defaultValue="attendance" className="w-full">
          <CardHeader className="py-4 border-b border-border/50">
            <TabsList className="grid w-full grid-cols-3 max-w-[400px]">
              <TabsTrigger value="attendance">Attendance</TabsTrigger>
              <TabsTrigger value="leaves">Leaves</TabsTrigger>
              <TabsTrigger value="salary">Salary</TabsTrigger>
            </TabsList>
          </CardHeader>
          <CardContent className="pt-6">
            <TabsContent value="attendance">
              <div className="flex items-center justify-between bg-muted/50 p-4 rounded-xl mb-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">This Month</p>
                  <p className="text-2xl font-bold text-emerald-600">21 <span className="text-sm font-normal text-muted-foreground">/ 22</span></p>
                  <p className="text-xs text-muted-foreground">Days Present</p>
                </div>
                <div className="h-12 w-px bg-border"></div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Late Arrivals</p>
                  <p className="text-2xl font-bold text-amber-500">2</p>
                  <p className="text-xs text-muted-foreground">Times</p>
                </div>
                <div className="h-12 w-px bg-border"></div>
                <div className="text-center border-border">
                  <p className="text-sm text-muted-foreground">Avg Hours</p>
                  <p className="text-2xl font-bold text-primary">8.2</p>
                  <p className="text-xs text-muted-foreground">Per Day</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground text-center">Detailed attendance logs will appear here.</p>
            </TabsContent>
            <TabsContent value="leaves">
              <p className="text-sm text-muted-foreground text-center">Leave history will appear here.</p>
            </TabsContent>
            <TabsContent value="salary">
               <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 border rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium">April 2026 Payslip</p>
                        <p className="text-xs text-muted-foreground">Net Pay: $4,500</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Download</Button>
                  </div>
               </div>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
}
