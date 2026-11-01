// ============================================================
// Service — Activity & Audit Log
// ============================================================
import type { ActivityLog } from '../types/activity';
export type { ActivityLog };

const STORAGE_KEY = 'reamanda:activity_logs';

export function getActivityLogs(filters?: {
  entityType?: string;
  userRole?: string;
  query?: string;
}): ActivityLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    let logs: ActivityLog[] = raw ? JSON.parse(raw) : [];
    if (!filters) return logs;

    if (filters.entityType && filters.entityType !== 'all') {
      logs = logs.filter((l) => l.entityType === filters.entityType);
    }
    if (filters.userRole && filters.userRole !== 'all') {
      logs = logs.filter((l) => l.userRole === filters.userRole);
    }
    if (filters.query && filters.query.trim()) {
      const q = filters.query.toLowerCase();
      logs = logs.filter(
        (l) =>
          l.userName.toLowerCase().includes(q) ||
          l.action.toLowerCase().includes(q) ||
          l.details.toLowerCase().includes(q) ||
          (l.entityName && l.entityName.toLowerCase().includes(q))
      );
    }
    return logs;
  } catch (err) {
    console.error('Failed to get activity logs:', err);
    return [];
  }
}

export function logActivity(entry: Omit<ActivityLog, 'id' | 'timestamp'>): ActivityLog {
  const newLog: ActivityLog = {
    ...entry,
    id: `ACT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
  };

  try {
    const existing = getActivityLogs();
    // Keep last 500 entries
    const updated = [newLog, ...existing.slice(0, 499)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to write activity log:', err);
  }

  return newLog;
}

export function clearActivityLogs(): void {
  localStorage.removeItem(STORAGE_KEY);
}
