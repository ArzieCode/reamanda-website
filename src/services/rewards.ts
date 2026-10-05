// ============================================================
// Services — Loyalty & Rewards
// ============================================================
import type { RewardVoucher, PointsTransaction } from '../types/rewards';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const REWARD_VOUCHERS: RewardVoucher[] = [
  {
    id: 'rew_50k',
    code: 'POINT50K',
    title: 'Potongan Belanja Rp 50.000',
    description: 'Dapat digunakan untuk semua koleksi busana tanpa minimum pembelian.',
    pointsCost: 500,
    discountAmount: 50000,
    minPurchase: 0,
  },
  {
    id: 'rew_100k',
    code: 'POINT100K',
    title: 'Potongan Belanja Rp 100.000',
    description: 'Berlaku untuk minimum transaksi Rp 500.000.',
    pointsCost: 950,
    discountAmount: 100000,
    minPurchase: 500000,
  },
  {
    id: 'rew_free_ongkir',
    code: 'POINTFREEONGKIR',
    title: 'Gratis Ongkir Seluruh Indonesia',
    description: 'Bebas ongkos kirim hingga Rp 40.000.',
    pointsCost: 350,
    discountAmount: 40000,
    minPurchase: 200000,
  },
];

const INITIAL_TRANSACTIONS: PointsTransaction[] = [
  { id: 'tx_1', date: '01 Okt 2024', description: 'Bonus Selamat Datang Member', points: 100, type: 'bonus' },
  { id: 'tx_2', date: '02 Okt 2024', description: 'Pembelian Pesanan #RM-20241002-1842', points: 350, type: 'earn' },
  { id: 'tx_3', date: '03 Okt 2024', description: 'Bonus Ulang Tahun RiaMiranda ke-15', points: 800, type: 'bonus' },
];

const REWARDS_STORAGE_KEY = 'riamiranda_rewards_transactions';

export async function getPointsHistory(): Promise<PointsTransaction[]> {
  await delay(150);
  try {
    const raw = localStorage.getItem(REWARDS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(REWARDS_STORAGE_KEY, JSON.stringify(INITIAL_TRANSACTIONS));
      return INITIAL_TRANSACTIONS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_TRANSACTIONS;
  }
}

export async function redeemRewardVoucher(voucher: RewardVoucher): Promise<{ success: boolean; code?: string; error?: string }> {
  await delay(400);
  try {
    const transactions = await getPointsHistory();
    const newTx: PointsTransaction = {
      id: `tx_${Date.now()}`,
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      description: `Penukaran ${voucher.title}`,
      points: -voucher.pointsCost,
      type: 'redeem',
    };
    localStorage.setItem(REWARDS_STORAGE_KEY, JSON.stringify([newTx, ...transactions]));
    return { success: true, code: voucher.code };
  } catch {
    return { success: false, error: 'Gagal menukarkan voucher poin.' };
  }
}
