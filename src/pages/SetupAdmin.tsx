/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export function SetupAdmin() {
  const [status, setStatus] = useState<string>("Checking database...");
  const [adminExists, setAdminExists] = useState(false);

  const checkAdmin = async () => {
    const roleDoc = await getDoc(doc(db, 'roles', 'super_admin'));
    if (roleDoc.exists()) {
      setAdminExists(true);
      setStatus("Super Admin role exists in Firestore. You can now use it.");
    } else {
      setAdminExists(false);
      setStatus("No Super Admin role found. Click the button below to fix it.");
    }
  };

  useEffect(() => { checkAdmin(); }, []);

  const handleFix = async () => {
    setStatus("Fixing...");
    try {
      // 1. Create the Role
      await setDoc(doc(db, 'roles', 'super_admin'), {
        name: 'Super Admin',
        permissions: [
          'view_dashboard', 'view_teachers', 'view_attendance', 
          'view_leaves', 'view_tickets', 'view_hierarchy', 
          'view_roles', 'view_payroll', 'view_settings'
        ],
        description: 'Master Access'
      });

      // 2. Instructions for the user
      setStatus("✅ Success! Now go to the Teachers page, find your user, and change their role to 'Super Admin'.");
      setAdminExists(true);
    } catch (e) {
      setStatus("Error: " + e);
    }
  };

  return (
    <div className="p-10 flex justify-center">
      <Card className="w-[400px]">
        <CardHeader><CardTitle>Admin Setup Tool</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">{status}</p>
          {!adminExists && <Button onClick={handleFix}>Create Super Admin Role</Button>}
          <Button variant="outline" onClick={() => window.location.href = '/'}>Go back to App</Button>
        </CardContent>
      </Card>
    </div>
  );
}