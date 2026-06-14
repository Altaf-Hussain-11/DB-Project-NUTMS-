import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { AppNotification } from '../types';

/**
 * NotificationContext
 * ====================
 * Per the project requirements, notifications are NOT stored in the
 * database. They are generated dynamically on the client (e.g. from
 * upcoming trip data, booking status changes) and kept in memory +
 * localStorage (so they survive a page refresh) with a 24-hour expiry.
 * Once a notification is read AND 24 hours have passed since creation,
 * it is permanently removed from the list.
 */

const STORAGE_KEY = 'nutms_notifications';
const EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

interface NotificationContextValue {
  notifications: AppNotification[];
  unreadCount: number;
  addNotification: (n: Omit<AppNotification, 'id' | 'createdAt' | 'read'>) => void;
  markAllRead: () => void;
  markRead: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

function loadFromStorage(): AppNotification[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: AppNotification[] = JSON.parse(raw);
    const now = Date.now();
    // Drop notifications that are read AND older than 24h
    return parsed.filter((n) => !(n.read && now - n.createdAt > EXPIRY_MS));
  } catch {
    return [];
  }
}

function saveToStorage(notifications: AppNotification[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>(() => loadFromStorage());

  useEffect(() => {
    saveToStorage(notifications);
  }, [notifications]);

  // Periodically prune expired (read + >24h) notifications
  useEffect(() => {
    const interval = setInterval(() => {
      setNotifications((prev) => {
        const now = Date.now();
        return prev.filter((n) => !(n.read && now - n.createdAt > EXPIRY_MS));
      });
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const addNotification = useCallback((n: Omit<AppNotification, 'id' | 'createdAt' | 'read'>) => {
    setNotifications((prev) => {
      // Avoid duplicate notifications with the same title+message
      if (prev.some((p) => p.title === n.title && p.message === n.message && !p.read)) {
        return prev;
      }
      const newNotif: AppNotification = {
        ...n,
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        createdAt: Date.now(),
        read: false,
      };
      return [newNotif, ...prev].slice(0, 50);
    });
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const markRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, addNotification, markAllRead, markRead }}>
      {children}
    </NotificationContext.Provider>
  );
}
// eslint-disable-next-line react-refresh/only-export-components
export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
}
