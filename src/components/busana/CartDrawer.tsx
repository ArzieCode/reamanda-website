// ============================================================
// CartDrawer — right-side slide-in (z-60)
// Quantity steppers, remove button, voucher input, shipping line, checkout button
// ============================================================
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useToast } from '../../context/ToastContext';
import { vouchers as mockVouchers } from '../../data/busana';

export default function CartDrawer() {
  const { state, dispatch, subtotal, totalItems } = useCart();
  const { format } = useCurrency();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [customVoucherInput, setCustomVoucherInput] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<{ code: string; discount: number } | null>(null);
  const [voucherError, setVoucherError] = useState('');

  if (!state.isOpen) return null;

  const close = () => dispatch({ type: 'TOGGLE_CART', payload: false });

  const handleApplyVoucher = (codeToApply?: string) => {
    setVoucherError('');
    const code = (codeToApply || customVoucherInput).trim().toUpperCase();
    if (!code) return;

    if (code === 'RIAFIRST') {
      setAppliedVoucher({ code, discount: 20000 });
      showToast('Voucher RIAFIRST berhasil digunakan!', 'success');
      setCustomVoucherInput('');
      return;
    }

    const matched = mockVouchers.find((v) => v.code === code);
    if (!matched) {
      setVoucherError('Kode voucher tidak valid.');
      return;
    }

    if (subtotal < matched.minPurchase) {
      setVoucherError(`Minimal belanja ${format(matched.minPurchase)}.`);
      return;
    }

    const discountAmount = matched.type === 'percent'
      ? Math.round((subtotal * matched.discount) / 100)
      : matched.discount;

    setAppliedVoucher({ code, discount: discountAmount });
    showToast(`Voucher ${code} berhasil dipasang!`, 'success');
    setCustomVoucherInput('');
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    showToast('Voucher dilepas.', 'info');
  };

  const handleProceedToCheckout = () => {
    close();
    navigate('/checkout');
  };

  const discountAmount = appliedVoucher?.discount ?? 0;
  const isFreeShipping = subtotal >= 500000 || appliedVoucher?.code === 'RIAFIRST';
  const shippingFee = isFreeShipping ? 0 : 18000;
  const estimatedTotal = Math.max(0, subtotal - discountAmount + shippingFee);

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
        aria-modal="true"
        aria-label="Keranjang Belanja"
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: 'var(--line)' }}
        >
          <p
            className="nav-label text-charcoal flex items-center gap-2"
            style={{ fontSize: '11px', letterSpacing: '0.16em' }}
          >
            <span>KERANJANG BELANJA</span>
            <span
              className="px-2 py-0.5 rounded-full text-white text-[9px]"
              style={{ backgroundColor: 'var(--caramel)' }}
            >
              {totalItems}
            </span>
          </p>
          <button
            onClick={close}
            className="p-1 hover:opacity-60 transition-opacity focus-visible:outline-none"
            aria-label="Tutup keranjang"
          >
            <X size={18} strokeWidth={1.25} color="var(--charcoal)" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {state.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-56 text-center">
              <p className="text-sm font-light text-muted mb-6" style={{ fontFamily: 'Jost, sans-serif' }}>
                Keranjang belanja Anda masih kosong.
              </p>
              <button
                onClick={() => {
                  close();
                  navigate('/busana');
                }}
                className="nav-label px-6 py-2.5 border border-charcoal text-charcoal hover:bg-surface transition-colors"
                style={{ fontSize: '10px', letterSpacing: '0.14em' }}
              >
                JELAJAHI KOLEKSI BUSANA
              </button>
            </div>
          ) : (
            <ul className="space-y-6">
              {state.items.map((item) => {
                const itemPrice = (item.product.salePrice ?? item.product.price);
                return (
                  <li
                    key={`${item.product.id}-${item.size}-${item.color}`}
                    className="flex gap-4 border-b border-line pb-6"
                  >
                    {/* Thumb */}
                    <div
                      className="flex-shrink-0 w-20 aspect-[3/4] bg-surface flex items-center justify-center text-[10px] text-muted uppercase font-light text-center px-1"
                    >
                      {item.product.name}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <p
                          className="nav-label text-charcoal truncate"
                          style={{ fontSize: '11px', letterSpacing: '0.1em' }}
                        >
                          {item.product.name}
                        </p>
                        <button
                          onClick={() =>
                            dispatch({
                              type: 'REMOVE_ITEM',
                              payload: {
                                productId: item.product.id,
                                size: item.size,
                                color: item.color,
                              },
                            })
                          }
                          className="text-muted hover:text-occupied p-0.5 transition-colors focus-visible:outline-none"
                          aria-label={`Hapus ${item.product.name} dari keranjang`}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                      <p className="text-xs font-light text-muted mb-3" style={{ fontFamily: 'Jost, sans-serif' }}>
                        Ukuran: {item.size} · Warna: {item.color}
                      </p>

                      <div className="flex items-center justify-between">
                        {/* Quantity Stepper */}
                        <div className="flex items-center border border-line">
                          <button
                            className="px-2.5 py-1 transition-opacity hover:opacity-60 focus-visible:outline-none"
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
                            aria-label="Kurangi jumlah"
                          >
                            <Minus size={11} strokeWidth={1.25} color="var(--charcoal)" />
                          </button>
                          <span
                            className="text-xs font-light text-ink min-w-[24px] text-center"
                            style={{ fontFamily: 'Jost, sans-serif' }}
                          >
                            {item.quantity}
                          </span>
                          <button
                            className="px-2.5 py-1 transition-opacity hover:opacity-60 focus-visible:outline-none"
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
                            aria-label="Tambah jumlah"
                          >
                            <Plus size={11} strokeWidth={1.25} color="var(--charcoal)" />
                          </button>
                        </div>

                        <span className="text-sm font-light text-charcoal" style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px' }}>
                          {format(itemPrice * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          {/* Vouchers Section */}
          {state.items.length > 0 && (
            <div className="mt-8 pt-6 border-t border-line">
              <p
                className="nav-label mb-3 text-charcoal"
                style={{ fontSize: '10px', letterSpacing: '0.16em' }}
              >
                KODE VOUCHER
              </p>

              {appliedVoucher ? (
                <div className="flex items-center justify-between p-3 border border-caramel-deep bg-surface text-xs mb-4">
                  <div>
                    <span className="nav-label text-caramel-deep font-medium" style={{ fontSize: '10px' }}>
                      {appliedVoucher.code} AKTIF
                    </span>
                    <p className="text-[11px] text-muted">Hemat {format(appliedVoucher.discount)}</p>
                  </div>
                  <button
                    onClick={handleRemoveVoucher}
                    className="nav-label text-[9px] text-occupied hover:opacity-75 focus-visible:outline-none"
                  >
                    LEPAS
                  </button>
                </div>
              ) : (
                <div className="mb-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customVoucherInput}
                      onChange={(e) => {
                        setCustomVoucherInput(e.target.value.toUpperCase());
                        setVoucherError('');
                      }}
                      placeholder="Masukkan kode voucher"
                      className="flex-1 border border-line px-3 py-2 text-xs uppercase outline-none focus:border-charcoal bg-transparent"
                      style={{ fontFamily: 'Jost, sans-serif' }}
                    />
                    <button
                      onClick={() => handleApplyVoucher()}
                      className="nav-label px-4 py-2 border border-charcoal bg-charcoal text-white hover:opacity-85 text-xs transition-opacity focus-visible:outline-none"
                      style={{ fontSize: '10px', letterSpacing: '0.12em' }}
                    >
                      TERAPKAN
                    </button>
                  </div>
                  {voucherError && (
                    <p className="text-[11px] text-occupied font-light mt-1" style={{ fontFamily: 'Jost, sans-serif' }}>
                      {voucherError}
                    </p>
                  )}
                </div>
              )}

              {/* Quick voucher chips */}
              <div className="space-y-2">
                {mockVouchers.slice(0, 2).map((v) => (
                  <div
                    key={v.code}
                    className="border border-line p-3 flex items-center justify-between bg-surface"
                  >
                    <div className="min-w-0 pr-2">
                      <p className="nav-label text-charcoal" style={{ fontSize: '10px', letterSpacing: '0.1em' }}>
                        {v.code}
                      </p>
                      <p className="text-[11px] text-muted truncate font-light" style={{ fontFamily: 'Jost, sans-serif' }}>
                        {v.description} (Min. {format(v.minPurchase)})
                      </p>
                    </div>
                    <button
                      onClick={() => handleApplyVoucher(v.code)}
                      className="nav-label px-3 py-1 border border-line text-xs hover:border-charcoal transition-colors focus-visible:outline-none flex-shrink-0"
                      style={{ fontSize: '9px', letterSpacing: '0.1em' }}
                    >
                      PAKAI
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer with Calculations & Checkout CTA */}
        {state.items.length > 0 && (
          <div className="px-6 py-5 border-t border-line bg-surface space-y-3">
            <div className="flex justify-between text-xs font-light text-muted" style={{ fontFamily: 'Jost, sans-serif' }}>
              <span>Subtotal</span>
              <span className="text-charcoal">{format(subtotal)}</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-xs font-light text-caramel-deep" style={{ fontFamily: 'Jost, sans-serif' }}>
                <span>Diskon ({appliedVoucher?.code})</span>
                <span>- {format(discountAmount)}</span>
              </div>
            )}

            <div className="flex justify-between text-xs font-light text-muted" style={{ fontFamily: 'Jost, sans-serif' }}>
              <span>Estimasi Ongkos Kirim</span>
              <span>{isFreeShipping ? 'GRATIS' : format(shippingFee)}</span>
            </div>

            <div className="flex justify-between text-sm font-medium text-charcoal pt-2 border-t border-line">
              <span className="font-cormorant text-lg">Perkiraan Total</span>
              <span>{format(estimatedTotal)}</span>
            </div>

            <button
              onClick={handleProceedToCheckout}
              className="w-full flex items-center justify-center gap-2 nav-label py-4 text-white transition-opacity duration-400 hover:opacity-85 focus-visible:outline-none shadow-sm"
              style={{
                fontSize: '11px',
                letterSpacing: '0.18em',
                backgroundColor: 'var(--charcoal)',
              }}
            >
              LANJUT KE CHECKOUT
              <ArrowRight size={14} />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
