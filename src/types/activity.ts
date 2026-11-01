// ============================================================
// Types — Audit & Activity Log
// ============================================================

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string; // e.g. "UPDATE_PRODUCT", "CHANGE_ORDER_STATUS", "LOGIN_SUCCESS", "ADD_STAFF"
  entityType: 'product' | 'order' | 'content' | 'user' | 'property' | 'catering' | 'auth' | 'settings';
  entityId?: string;
  entityName?: string;
  details: string;
  beforeState?: any;
  afterState?: any;
  timestamp: string;
}
