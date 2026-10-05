// ============================================================
// Context — Loyalty & Rewards Program
// ============================================================
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { RewardVoucher, PointsTransaction } from '../types/rewards';
import { REWARD_VOUCHERS, getPointsHistory, redeemRewardVoucher } from '../services/rewards';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

interface RewardsContextValue {
  points: number;
  tier: 'Silver' | 'Gold' | 'Platinum';
  tierProgress: number; // 0 to 100
  history: PointsTransaction[];
  vouchers: RewardVoucher[];
  isRewardsOpen: boolean;
  toggleRewardsDrawer: (open?: boolean) => void;
  redeemVoucher: (voucher: RewardVoucher) => Promise<boolean>;
  addPoints: (amount: number, description: string) => void;
}

const RewardsContext = createContext<RewardsContextValue | null>(null);

export function RewardsProvider({ children }: { children: React.ReactNode }) {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();

  const [points, setPoints] = useState(user?.points ?? 1250);
  const [history, setHistory] = useState<PointsTransaction[]>([]);
  const [isRewardsOpen, setIsRewardsOpen] = useState(false);

  useEffect(() => {
    if (user?.points !== undefined) {
      setPoints(user.points);
    }
  }, [user]);

  useEffect(() => {
    getPointsHistory().then(setHistory);
  }, []);

  const tier = points >= 2500 ? 'Platinum' : points >= 1000 ? 'Gold' : 'Silver';
  const tierProgress = tier === 'Platinum' ? 100 : tier === 'Gold' ? Math.min(100, Math.round(((points - 1000) / 1500) * 100)) : Math.min(100, Math.round((points / 1000) * 100));

  const toggleRewardsDrawer = (open?: boolean) => {
    setIsRewardsOpen((prev) => (open !== undefined ? open : !prev));
  };

  const addPoints = (amount: number, description: string) => {
    const newTotal = points + amount;
    setPoints(newTotal);
    if (user) {
      updateProfile({ points: newTotal });
    }
    const newTx: PointsTransaction = {
      id: `tx_${Date.now()}`,
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      description,
      points: amount,
      type: 'earn',
    };
    setHistory((prev) => [newTx, ...prev]);
    showToast(`Selamat! Anda mendapatkan +${amount} Poin RiaMiranda.`, 'success');
  };

  const redeemVoucher = async (voucher: RewardVoucher): Promise<boolean> => {
    if (points < voucher.pointsCost) {
      showToast(`Poin Anda tidak mencukupi untuk menukar ${voucher.title}.`, 'error');
      return false;
    }

    const res = await redeemRewardVoucher(voucher);
    if (res.success && res.code) {
      const newTotal = points - voucher.pointsCost;
      setPoints(newTotal);
      if (user) {
        updateProfile({ points: newTotal });
      }
      const updatedHistory = await getPointsHistory();
      setHistory(updatedHistory);
      showToast(`Voucher ${res.code} berhasil ditukarkan! Gunakan pada saat checkout.`, 'success');
      return true;
    }

    showToast(res.error ?? 'Gagal menukarkan voucher.', 'error');
    return false;
  };

  return (
    <RewardsContext.Provider
      value={{
        points,
        tier,
        tierProgress,
        history,
        vouchers: REWARD_VOUCHERS,
        isRewardsOpen,
        toggleRewardsDrawer,
        redeemVoucher,
        addPoints,
      }}
    >
      {children}
    </RewardsContext.Provider>
  );
}

export function useRewards(): RewardsContextValue {
  const ctx = useContext(RewardsContext);
  if (!ctx) throw new Error('useRewards must be used within RewardsProvider');
  return ctx;
}
