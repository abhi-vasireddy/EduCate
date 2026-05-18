/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// 1. Rename the type to UserRole to avoid collision
export type UserRole = 'teacher' | 'manager' | 'hr' | 'admin' | 'super_admin' | 'Teacher' | 'Manager' | 'HR' | 'Principal' | 'Admin' | 'Super Admin';

export interface User {
  id?: string;
  uid: string;
  name: string;
  email: string;
  role: UserRole; // 2. Update reference here
  designation: string;
  status: string;
  avatar: string;
  employeeId: string;
  managerId: string;
  createdAt: any;
  tempPassword?: string;
}

export interface Role {
  id?: string;
  roleId: string;
  name: string;
  description: string;
  designation?: string;
  permissions: string[];
  createdAt?: any;
  updatedAt?: any;
  users?: number;
}

// ... rest of the file remains exactly as you had it
export interface Teacher {
  id?: string;
  teacherId: string;
  uid: string;
  fingerprintId: string;
  salary: number;
  designation: string;
  joiningDate: string;
  department: string;
  status: string;
  biometricEnabled: boolean;
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  employeeId?: string;
  managerId?: string;
}

export interface AttendanceRecord {
  id?: string;
  attendanceId: string;
  teacherId: string;
  date: string;
  checkIn: string;
  checkOut: string;
  workingHours: number;
  status: string;
  deviceId: string;
  lateMinutes: number;
}

export interface LeaveRequest {
  id?: string;
  leaveId: string;
  teacherId: string;
  leaveType: string;
  fromDate: string;
  toDate: string;
  reason: string;
  status: string;
  managerComment: string;
  appliedAt: any;
  approvedAt: any;
  type?: string;
  startDate?: string;
  endDate?: string;
  days?: number;
  appliedOn?: string;
  managerComments?: string;
}

export interface Ticket {
  id?: string;
  ticketId: string;
  teacherId: string;
  category: string;
  priority: string;
  status: string;
  title: string;
  description: string;
  assignedTo: string;
  createdAt: any;
  subject?: string;
}

export interface PayrollRecord {
  id?: string;
  payrollId: string;
  teacherId: string;
  month: string;
  basicSalary: number;
  deductions: number;
  bonuses: number;
  netSalary: number;
  generatedAt: any;
  allowances?: number;
  netPay?: number;
  status?: string;
}

export interface Holiday {
  id?: string;
  holidayId: string;
  title: string;
  date: string;
  type: string;
  description: string;
}

export interface RoleDef {
  id?: string;
  roleId: string;
  roleName: string;
  permissions: string[];
}

export interface Permission {
  id?: string;
  permissionId: string;
  module: string;
  action: string;
}

export interface BiometricDevice {
  id?: string;
  deviceId: string;
  deviceName: string;
  location: string;
  status: string;
  lastSync: any;
  firmwareVersion: string;
}

export interface Notification {
  id?: string;
  notificationId: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: any;
}

export interface ActivityLog {
  id?: string;
  logId: string;
  userId: string;
  action: string;
  module: string;
  timestamp: any;
}