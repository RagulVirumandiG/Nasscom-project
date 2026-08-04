import React, { useState, useEffect } from 'react';
import { Order, OrderStatus } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { InvoiceModal } from '../components/InvoiceModal';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  RotateCcw,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Star,
  Download
} from 'lucide-react';
import { generateInvoicePDF } from '../utils/pdfGenerator';

export const OrdersView: React.FC = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);

  // Cancel / Return Modal State
  const [cancelModalOrder, setCancelModalOrder] = useState<Order | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [isReturnMode, setIsReturnMode] = useState(false);

  const fetchUserOrders = async () => {
    setLoading(true);
    try {
      const data = await api.getOrders(currentUser?.id);
      setOrders(data);
      if (data.length > 0) setExpandedOrderId(data[0].id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserOrders();
  }, [currentUser]);

  const handleCancelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancelModalOrder) return;

    try {
      if (isReturnMode) {
        await api.returnOrder(cancelModalOrder.id, cancelReason);
      } else {
        await api.cancelOrder(cancelModalOrder.id, cancelReason);
      }
      setCancelModalOrder(null);
      setCancelReason('');
      fetchUserOrders();
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Delivered':
        return <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Delivered</span>;
      case 'Shipped':
        return <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1"><Truck className="w-3 h-3" /> In Transit</span>;
      case 'Accepted':
        return <span className="bg-sky-100 text-sky-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1"><Clock className="w-3 h-3" /> Confirmed</span>;
      case 'Cancelled':
        return <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1"><XCircle className="w-3 h-3" /> Cancelled</span>;
      case 'Returned':
        return <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1"><RotateCcw className="w-3 h-3" /> Return Requested</span>;
      default:
        return <span className="bg-slate-100 text-slate-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1"><Clock className="w-3 h-3" /> Pending</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Package className="w-6 h-6 text-indigo-600" />
            <span>My Orders & Order Tracking</span>
          </h1>
          <p className="text-xs text-slate-500">Track shipments, manage returns, and download official invoices</p>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-slate-400">Loading order history...</div>
      ) : orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => {
            const isExpanded = expandedOrderId === order.id;
            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs transition"
              >
                {/* Order Summary Header */}
                <div
                  onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                  className="p-5 bg-slate-50/80 hover:bg-slate-100/80 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center font-bold text-indigo-600 shadow-2xs">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-sm font-bold text-slate-900 font-mono">#{order.id}</strong>
                        {getStatusBadge(order.status)}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Placed on {new Date(order.createdAt).toLocaleDateString()} · Total: <strong className="text-slate-900 font-bold">${order.totalAmount}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        generateInvoicePDF(order);
                      }}
                      className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 font-bold text-xs px-3 py-1.5 rounded-xl transition flex items-center gap-1 shadow-2xs"
                      title="Download PDF Invoice"
                    >
                      <Download className="w-3.5 h-3.5" /> PDF
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedInvoiceOrder(order);
                      }}
                      className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs px-3 py-1.5 rounded-xl transition flex items-center gap-1 shadow-2xs"
                    >
                      <FileText className="w-3.5 h-3.5 text-indigo-600" /> Invoice
                    </button>
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-6 space-y-6 border-t border-slate-100">
                    
                    {/* Visual Tracking Stepper */}
                    {order.status !== 'Cancelled' && (
                      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">
                          Shipment Status Tracker
                        </h4>

                        <div className="relative flex items-center justify-between max-w-xl mx-auto my-2">
                          {/* Progress Line */}
                          <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 z-0" />

                          {['Pending', 'Accepted', 'Shipped', 'Delivered'].map((stepStatus, idx) => {
                            const stepsOrder = ['Pending', 'Accepted', 'Shipped', 'Delivered'];
                            const currentIdx = stepsOrder.indexOf(order.status);
                            const isCompleted = currentIdx >= idx;

                            return (
                              <div key={stepStatus} className="relative z-10 flex flex-col items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition ${
                                  isCompleted ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-200 text-slate-400'
                                }`}>
                                  {isCompleted ? '✓' : idx + 1}
                                </div>
                                <span className={`text-[10px] font-bold mt-1 ${isCompleted ? 'text-indigo-600' : 'text-slate-400'}`}>
                                  {stepStatus}
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Recent Tracking Log */}
                        {order.trackingHistory && order.trackingHistory.length > 0 && (
                          <div className="mt-4 pt-3 border-t border-slate-200 text-xs text-slate-600 space-y-1">
                            <p className="font-semibold text-slate-800">Latest Update:</p>
                            <p className="text-slate-600">
                              {order.trackingHistory[order.trackingHistory.length - 1].note}
                              {order.trackingHistory[order.trackingHistory.length - 1].location && ` (${order.trackingHistory[order.trackingHistory.length - 1].location})`}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Order Items */}
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">Items Purchased</h4>
                      <div className="space-y-3">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50/50 rounded-2xl border border-slate-100">
                            <img src={item.product.images[0]} alt={item.product.name} className="w-12 h-12 object-cover rounded-xl border border-slate-100" />
                            <div className="flex-1 min-w-0 text-xs">
                              <h5 className="font-bold text-slate-900 truncate">{item.product.name}</h5>
                              <p className="text-slate-500">Qty: {item.quantity} · ${item.product.price} each</p>
                            </div>
                            <span className="text-xs font-extrabold text-slate-900">${(item.product.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions (Cancel / Return) */}
                    <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-2">
                      {['Pending', 'Accepted'].includes(order.status) && (
                        <button
                          onClick={() => {
                            setCancelModalOrder(order);
                            setIsReturnMode(false);
                          }}
                          className="px-4 py-2 border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl transition"
                        >
                          Cancel Order
                        </button>
                      )}

                      {order.status === 'Delivered' && (
                        <button
                          onClick={() => {
                            setCancelModalOrder(order);
                            setIsReturnMode(true);
                          }}
                          className="px-4 py-2 border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold text-xs rounded-xl transition flex items-center gap-1"
                        >
                          <RotateCcw className="w-3.5 h-3.5" /> Request Return / Refund
                        </button>
                      )}
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-20 text-center bg-slate-50 rounded-3xl border border-slate-100 space-y-3">
          <Package className="w-12 h-12 text-slate-300 mx-auto stroke-1" />
          <h3 className="text-sm font-bold text-slate-800">No orders placed yet</h3>
          <p className="text-xs text-slate-500">Once you complete a purchase, your orders and live tracking will show up here.</p>
        </div>
      )}

      {/* Invoice Modal */}
      <InvoiceModal order={selectedInvoiceOrder} onClose={() => setSelectedInvoiceOrder(null)} />

      {/* Cancel / Return Reason Modal */}
      {cancelModalOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              {isReturnMode ? 'Request Product Return' : 'Cancel Order'}
            </h3>
            <p className="text-xs text-slate-500">
              Please state your reason for {isReturnMode ? 'returning this delivered order' : 'cancelling this pending order'}:
            </p>

            <form onSubmit={handleCancelSubmit} className="space-y-4 text-xs">
              <textarea
                rows={3}
                placeholder="e.g. Changed my mind, ordered wrong item size..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                required
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCancelModalOrder(null)}
                  className="px-4 py-2 text-slate-500 font-bold hover:bg-slate-100 rounded-xl"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700"
                >
                  Confirm {isReturnMode ? 'Return' : 'Cancellation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
