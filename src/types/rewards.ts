// ============================================================
// Types — Loyalty Rewards
// ============================================================
export interface RewardVoucher {
  id: string;
  code: string;
  title: string;
  description: string;
  pointsCost: number;
  discountAmount: number;
  minPurchase: number;
}

export interface PointsTransaction {
  id: string;
  date: string;
  description: string;
  points: number; // positive for earn, negative for spend
  type: 'earn' | 'redeem' | 'bonus';
}
