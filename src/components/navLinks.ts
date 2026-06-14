import type { Role } from '../types';

export interface NavLinkItem {
  to: string;
  label: string;
  icon: string;
}

export const NAV_LINKS: Record<Role, NavLinkItem[]> = {
  Student: [
    { to: '/student/dashboard', label: 'Dashboard', icon: '\u{1F3E0}' },
    { to: '/student/track-bus', label: 'Track Bus', icon: '\u{1F4CD}' },
    { to: '/student/schedules', label: 'Schedules', icon: '\u{1F4C5}' },
    { to: '/student/notifications', label: 'Notifications', icon: '\u{1F514}' },
    { to: '/student/profile', label: 'Profile', icon: '\u{1F464}' },
  ],
  Faculty: [
    { to: '/faculty/dashboard', label: 'Dashboard', icon: '\u{1F3E0}' },
    { to: '/faculty/track-bus', label: 'Track Bus', icon: '\u{1F4CD}' },
    { to: '/faculty/schedules', label: 'Schedules', icon: '\u{1F4C5}' },
    { to: '/faculty/special-trip-request', label: 'Special Trip Request', icon: '\u{1F697}' },
    { to: '/faculty/notifications', label: 'Notifications', icon: '\u{1F514}' },
    { to: '/faculty/profile', label: 'Profile', icon: '\u{1F464}' },
  ],
  Driver: [
    { to: '/driver/dashboard', label: 'Dashboard', icon: '\u{1F3E0}' },
    { to: '/driver/profile', label: 'Profile', icon: '\u{1F464}' },
  ],
  Administrator: [
    { to: '/admin/dashboard', label: 'Dashboard', icon: '\u{1F3E0}' },
    { to: '/admin/users', label: 'Manage Users', icon: '\u{1F465}' },
    { to: '/admin/routes', label: 'Manage Routes', icon: '\u{1F5FA}\uFE0F' },
    { to: '/admin/schedules', label: 'Manage Schedules', icon: '\u{1F4C5}' },
    { to: '/admin/vehicles', label: 'Manage Buses', icon: '\u{1F68C}' },
    { to: '/admin/special-requests', label: 'Special Requests', icon: '\u{1F4DD}' },
    { to: '/admin/reports', label: 'Reports', icon: '\u{1F4CA}' },
    { to: '/admin/profile', label: 'Profile', icon: '\u{1F464}' },
  ],
};
