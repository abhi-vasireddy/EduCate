import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Building2, Clock, Bell, Palmtree, Plus } from 'lucide-react';

export function Settings() {
  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage platform configuration and preferences.</p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:w-[600px] mb-8">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="holidays">Holidays</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card className="border-border/50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />
                <CardTitle>School Information</CardTitle>
              </div>
              <CardDescription>Update the basic details of the institution.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="schoolName">Institution Name</Label>
                <Input id="schoolName" defaultValue="Springfield High School" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="schoolAddress">Address</Label>
                <Input id="schoolAddress" defaultValue="123 Education Blvd, Springfield" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="grid gap-2">
                   <Label htmlFor="contactEmail">Contact Email</Label>
                   <Input id="contactEmail" defaultValue="info@springfield.edu" />
                 </div>
                 <div className="grid gap-2">
                   <Label htmlFor="contactPhone">Contact Phone</Label>
                   <Input id="contactPhone" defaultValue="+1 (555) 123-4567" />
                 </div>
              </div>
              <Button className="mt-4 w-full md:w-auto">Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance">
          <Card className="border-border/50">
             <CardHeader>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                <CardTitle>Attendance Rules</CardTitle>
              </div>
              <CardDescription>Configure working hours and late markings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="grid gap-2">
                   <Label htmlFor="checkInTime">Standard Check-in Time</Label>
                   <Input id="checkInTime" type="time" defaultValue="08:00" />
                 </div>
                 <div className="grid gap-2">
                   <Label htmlFor="checkOutTime">Standard Check-out Time</Label>
                   <Input id="checkOutTime" type="time" defaultValue="16:00" />
                 </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="gracePeriod">Late Grace Period (Minutes)</Label>
                <Input id="gracePeriod" type="number" defaultValue="15" className="max-w-[200px]" />
                <p className="text-xs text-muted-foreground">Staff arriving after 08:15 will be marked as late.</p>
              </div>
              <div className="flex items-center justify-between border-t border-border pt-4 mt-4">
                <div className="space-y-0.5">
                  <Label>Half-day threshold</Label>
                  <p className="text-sm text-muted-foreground">Mark half-day if working hours are less than 4 hours.</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
           <Card className="border-border/50">
             <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                <CardTitle>Notification Preferences</CardTitle>
              </div>
              <CardDescription>Choose how and when alerts are sent.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
               <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Leave Approvals</Label>
                  <p className="text-sm text-muted-foreground">Notify staff when their leave is approved or rejected.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Daily Attendance Digest</Label>
                  <p className="text-sm text-muted-foreground">Send a summary email to managers at 5:00 PM.</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
           </Card>
        </TabsContent>
        
        <TabsContent value="holidays">
           <Card className="border-border/50">
             <CardHeader>
              <div className="flex items-center gap-2">
                <Palmtree className="w-5 h-5 text-primary" />
                <CardTitle>Holiday Calendar</CardTitle>
              </div>
              <CardDescription>Manage school holidays and non-working days.</CardDescription>
            </CardHeader>
            <CardContent>
               <Button variant="outline" className="gap-2 mb-4">
                 <Plus className="w-4 h-4" /> Add Holiday
               </Button>
               <div className="border border-border/50 rounded-lg divide-y divide-border/50">
                  <div className="flex justify-between items-center p-4 hover:bg-muted/30">
                     <div className="font-medium">Summer Break Starts</div>
                     <div className="text-sm text-muted-foreground">June 15, 2026</div>
                  </div>
                  <div className="flex justify-between items-center p-4 hover:bg-muted/30">
                     <div className="font-medium">Independence Day</div>
                     <div className="text-sm text-muted-foreground">July 4, 2026</div>
                  </div>
                  <div className="flex justify-between items-center p-4 hover:bg-muted/30">
                     <div className="font-medium">Staff Orientation</div>
                     <div className="text-sm text-muted-foreground">August 20, 2026</div>
                  </div>
               </div>
            </CardContent>
           </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
