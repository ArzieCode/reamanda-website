// ============================================================
// CartDrawer — right-side slide-in, with Voucher list
// ============================================================
import React, { useState } from 'react';
import { X, Minus, Plus } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { vouchers } from '../../data/busana';
import { formatRupiah } from '../../utils/format';

export default function CartDrawer() {
  const { state, dispatch, subtotal } = useCart();
  const [appliedVoucher, setAppliedVoucher] = useState<string | null>(null);

  if (!state.isOpen) return null;

  const close = () => dispatch({ type: 'TOGGLE_CART', payload: false });

  const handleApply = (code: string) => {
    setAppliedVoucher(code);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[60] transition-opacity duration-400"
        style={{ backgroundColor: 'rgba(77,73,70,0.45)' }}
        onClick={close}
        aria-hidden
      />

      {/* Drawer */}
      <div
        className="fixed right-0 top-0 bottom-0 z-[60] flex flex-col w-full sm:w-[420px] max-w-full bg-bg border-l border-line"
        role="dialog"
        aria-label="Keranjang Belanja"
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: 'var(--line)' }}
        >
          <p
            className="nav-label"
            style={{ fontSize: '11px', color: 'var(--charcoal)', letterSpacing: '0.16em' }}
          >
            KERANJANG BELANJA
          </p>
          <button
            onClick={close}
            className="transition-opacity duration-400 hover:opacity-60"
            aria-label="Tutup keranjang"
          >
            <X size={18} strokeWidth={1.25} color="var(--charcoal)" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {state.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48">
              <p className="text-sm font-light text-center" style={{ color: 'var(--muted)', fontFamily: 'Jost, sans-serif' }}>
                Keranjang Anda masih kosong.
              </p>
            </div>
          ) : (
            <ul className="space-y-6">
              {state.items.map((item) => (
                <li
                  key={`${item.product.id}-${item.size}-${item.color}`}
                  className="flex gap-4"
                >
                  {/* Thumb */}
                  <div
                    className="flex-shrink-0 w-20"
                    style={{ aspectRatio: '3/4', backgroundColor: 'var(--surface)' }}
                  />

                  {/* Info */}
                  <div className="flex-1">
                    <p
                      className="nav-label mb-1"
                      style={{ fontSize: '11px', color: 'var(--charcoal)', letterSpacing: '0.12em' }}
                    >
                      {item.product.name}
                    </p>
                    <p className="text-xs font-light mb-3" style={{ color: 'var(--muted)', fontFamily: 'Jost' }}>
                      {item.size} · {item.color}
                    </p>
                    <div className="flex items-center justify-between">
                      {/* Quantity */}
                      <div className="flex items-center gap-3 border" style={{ borderColor: 'var(--line)' }}>
                        <button
                          className="px-2 py-1 transition-opacity hover:opacity-60"
                          onClick={() =>
                            dispatch({
                              type: 'UPDATE_QUANTITY',
                              payload: {
                                productId: item.product.id,
                                size: item.size,
                                color: item.color,
                                quantity: item.quantity - 1,
                              },
                            })
                          }
                        >
                          <Minus size={12} strokeWidth={1.25} color="var(--charcoal)" />
                        </button>
                        <span className="text-sm font-light" style={{ color: 'var(--ink)', fontFamily: 'Jost', minWidth: 16, textAlign: 'center' }}>
                          {item.quantity}
                        </span>
                        <button
                          className="px-2 py-1 transition-opacity hover:opacity-60"
                          onClick={() =>
                            dispatch({
                              type: 'UPDATE_QUANTITY',
                              payload: {
                                productId: item.product.id,
                                size: item.size,
                                color: item.color,
                                quantity: item.quantity + 1,
                              },
                            })
                          }
                        >
                          <Plus size={12} strokeWidth={1.25} color="var(--charcoal)" />
                        </button>
                      </div>

                      <span className="text-sm font-light" style={{ color: 'var(--ink)', fontFamily: 'Jost', fontSize: '13px' }}>
                        {formatRupiah((item.product.salePrice ?? item.product.price) * item.quantity)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* Vouchers */}
          {state.items.length > 0 && (
            <div className="mt-8">
              <p
                className="nav-label mb-4"
                style={{ fontSize: '10px', color: 'var(--charcoal)', letterSpacing: '0.16em' }}
              >
                VOUCHER TERSEDIA
              </p>
              <div className="space-y-3">
                {vouchers.map((v) => (
                  <div
                    key={v.code}
                    className="border p-4 flex items-start justify-between"
                    style={{ borderColor: 'var(--line)' }}
                  >
                    <div>
                      <p
                        className="nav-label mb-1"
                        style={{ fontSize: '11px', color: 'var(--caramel-deep)', letterSpacing: '0.12em' }}
                      >
                        {v.code}
                      </p>
                      <p className="text-xs font-light" style={{ color: 'var(--muted)', fontFamily: 'Jost', fontSize: '12px' }}>
                        {v.description}
                      </p>
                      <p className="text-xs font-light mt-1" style={{ color: 'var(--muted)', fontFamily: 'Jost', fontSize: '11px' }}>
                        Min. {formatRupiah(v.minPurchase)} · s/d {v.expiry}
                      </p>
                    </div>
                    <button
                      onClick={() => handleApply(v.code)}
                      className="nav-label ml-3 flex-shrink-0 px-3 py-1.5 min-h-[36px] border transition-all duration-400"
                      style={{
                        fontSize: '10px',
                        letterSpacing: '0.14em',
                        borderColor: appliedVoucher === v.code ? 'var(--caramel-deep)' : 'var(--line)',
                        color: appliedVoucher === v.code ? 'var(--caramel-deep)' : 'var(--muted)',
                      }}
                    >
                      {appliedVoucher === v.code ? 'DIPAKAI' : 'PAKAI'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {state.items.length > 0 && (
          <div className="px-6 py-6 border-t" style={{ borderColor: 'var(--line)' }}>
            <div className="flex justify-between mb-4">
              <span className="text-sm font-light" style={{ color: 'var(--muted)', fontFamily: 'Jost', fontSize: '13px' }}>
                Subtotal
              </span>
              <span className="text-sm font-light" style={{ color: 'var(--charcoal)', fontFamily: 'Jost', fontSize: '13px' }}>
                {formatRupiah(subtotal)}
              </span>
            </div>
            <button
              className="w-full nav-label py-4 text-white transition-opacity duration-400 hover:opacity-80"
              style={{
                fontSize: '11px',
                letterSpacing: '0.18em',
                backgroundColor: 'var(--charcoal)',
              }}
            >
              PROSES PESANAN
            </button>
          </div>
        )}
      </div>
    </>
  );
}
