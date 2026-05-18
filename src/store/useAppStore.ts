/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';
import { User, Teacher, AttendanceRecord, LeaveRequest, Ticket, PayrollRecord, Notification, Role, Holiday } from '../types';
import { authService } from '../services/firebase/authService';
import { teacherService } from '../services/firebase/teacherService';
import { attendanceService } from '../services/firebase/attendanceService';
import { leaveService } from '../services/firebase/leaveService';
import { ticketService } from '../services/firebase/ticketService';
import { payrollService } from '../services/firebase/payrollService';
import { notificationService } from '../services/firebase/notificationService';
import { roleService } from '../services/firebase/roleService';
import { designationService, Designation } from '../services/firebase/designationService';
// 1. Import the new Holiday service
import { holidayService } from '../services/firebase/holidayService';

interface AppState {
  user: User | null;
  teachers: Teacher[];
  attendance: AttendanceRecord[];
  leaves: LeaveRequest[];
  tickets: Ticket[];
  payroll: PayrollRecord[];
  notifications: Notification[];
  roles: Role[];
  designations: Designation[];
  // 2. Add holidays to the state interface
  holidays: Holiday[];
  theme: 'light' | 'dark' | 'system';
  sidebarOpen: boolean;
  loading: boolean;
  unsubscribeListeners: (() => void)[] | null;
  
  // Actions
  initializeAuth: () => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  
  // Data subscriptions
  startListeners: () => void;
  stopListeners: () => void;
  
  // Mutations
  addTeacher: (teacher: Partial<Teacher>) => Promise<void>;
  updateTeacher: (id: string, teacher: Partial<Teacher>) => Promise<void>;
  deleteTeacher: (id: string) => Promise<void>;
  
  applyLeave: (leave: Partial<LeaveRequest>) => Promise<void>;
  updateLeaveStatus: (id: string, status: string, managerComment?: string) => Promise<void>;
  
  createTicket: (ticket: Partial<Ticket>) => Promise<void>;
  updateTicketStatus: (id: string, status: string) => Promise<void>;
  
  markNotificationRead: (id: string) => Promise<void>;
  
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setSidebarOpen: (isOpen: boolean) => void;
  toggleSidebar: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  user: null, 
  teachers: [], 
  attendance: [],
  leaves: [],
  tickets: [],
  payroll: [],
  notifications: [],
  roles: [],
  designations: [],
  // 3. Initialize holidays as an empty array
  holidays: [],
  theme: 'light',
  sidebarOpen: false,
  loading: true,
  unsubscribeListeners: null,

  initializeAuth: () => {
    authService.listenToAuthChanges((user, profile) => {
      set({ user: profile, loading: false });
      if (profile) {
        get().startListeners();
      } else {
        get().stopListeners();
      }
    });
  },

  login: async (email, password) => {
    try {
      await authService.loginUser(email, password);
    } catch (e) {
      console.error(e);
      throw e;
    }
  },

  logout: async () => {
    try {
      await authService.logoutUser();
    } finally {
      set({ user: null });
    }
  },

  stopListeners: () => {
    const subs = get().unsubscribeListeners;
    if (subs) {
      subs.forEach(unsub => unsub());
      set({ unsubscribeListeners: null });
    }
  },

  startListeners: () => {
    get().stopListeners(); 

    const unsubs = [
      teacherService.subscribeToTeachers((teachers) => {
        set({ teachers });
      }),
      attendanceService.subscribeToAttendance((attendance) => {
        set({ attendance });
      }),
      leaveService.subscribeToLeaves((leaves) => {
        set({ leaves });
      }),
      ticketService.subscribeToTickets((tickets) => {
        set({ tickets });
      }),
      payrollService.subscribeToPayroll((payroll) => {
        set({ payroll });
      }),
      notificationService.subscribeToNotifications((notifications) => {
        set({ notifications });
      }),
      roleService.subscribeToRoles((roles) => {
        set({ roles });
      }),
      designationService.subscribeToDesignations((designations) => {
        set({ designations });
      }),
      // 4. Add the Holiday listener
      holidayService.subscribeToHolidays((holidays) => {
        set({ holidays });
      })
    ];

    set({ unsubscribeListeners: unsubs });
  },

  addTeacher: async (teacher) => {
    await teacherService.addTeacher(teacher);
  },
  updateTeacher: async (id, updatedTeacher) => {
    await teacherService.updateTeacher(id, updatedTeacher);
  },
  deleteTeacher: async (id) => {
    await teacherService.deleteTeacher(id);
  },
  
  applyLeave: async (leave) => {
    await leaveService.addLeave(leave);
  },
  updateLeaveStatus: async (id, status, managerComment) => {
    await leaveService.updateLeaveStatus(id, status, managerComment);
  },
  
  createTicket: async (ticket) => {
    await ticketService.addTicket(ticket);
  },
  updateTicketStatus: async (id, status) => {
    await ticketService.updateTicketStatus(id, status);
  },
  
  markNotificationRead: async (id) => {
    await notificationService.markAsRead(id);
  },
  
  setTheme: (theme) => set({ theme }),
  setSidebarOpen: (isOpen) => set({ sidebarOpen: isOpen }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));