import React from 'react';
import { Order } from '../types';
import { X, Printer, ShoppingBag, Download } from 'lucide-react';
import { generateInvoicePDF } from '../utils/pdfGenerator';

interface InvoiceModalProps {
  order: Order | null;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    generateInvoicePDF(order);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl border border-slate-200 my-8 print:p-0 print:shadow-none print:border-none">
        
        {/* Modal Controls */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6 print:hidden">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Official Sales Invoice</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPDF}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-xs"
            >
              <Download className="w-4 h-4" /> Download PDF
            </button>
            <button
              onClick={handlePrint}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-xs"
            >
              <Printer className="w-4 h-4" /> Print
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Printable Document */}
        <div className="space-y-6 text-slate-800 text-xs">
          
          {/* Header */}
          <div className="flex justify-between items-start pb-6 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <span className="text-lg font-extrabold text-slate-900 tracking-tight">SuperStore Inc.</span>
              </div>
              <p className="text-[11px] text-slate-500">750 Commerce Blvd, Suite 400</p>
              <p className="text-[11px] text-slate-500">San Francisco, CA 94103 · support@superstore.com</p>
            </div>

            <div className="text-right">
              <h2 className="text-xl font-extrabold text-indigo-600 uppercase tracking-tight">INVOICE</h2>
              <p className="font-mono font-bold text-slate-900 mt-1">#{order.id}</p>
              <p className="text-[11px] text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Customer & Shipping Details */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Billed To</span>
              <p className="font-bold text-slate-900">{order.customerName}</p>
              <p className="text-slate-600">{order.customerEmail}</p>
              <p className="text-slate-600">{order.customerPhone}</p>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Shipping Address</span>
              <p className="text-slate-700">{order.shippingAddress.street}</p>
              <p className="text-slate-700">{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
              <p className="text-slate-500 mt-1">Method: {order.deliveryOption.title}</p>
            </div>
          </div>

          {/* Line Items Table */}
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-2">Item Description</th>
                <th className="py-2 text-center">Qty</th>
                <th className="py-2 text-right">Unit Price</th>
                <th className="py-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {order.items.map((item, idx) => (
                <tr key={idx} className="py-2">
                  <td className="py-2.5">
                    <p className="font-bold text-slate-900">{item.product.name}</p>
                    <p className="text-[10px] text-slate-400">
                      Brand: {item.product.brand} {item.selectedColor ? `· Color: ${item.selectedColor}` : ''}
                    </p>
                  </td>
                  <td className="py-2.5 text-center font-bold">{item.quantity}</td>
                  <td className="py-2.5 text-right font-mono">${item.product.price}</td>
                  <td className="py-2.5 text-right font-mono font-bold">${(item.product.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Calculations Summary */}
          <div className="pt-4 border-t border-slate-200 flex justify-end">
            <div className="w-64 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-mono font-bold">${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping Fee:</span>
                <span className="font-mono font-bold">${order.deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Tax (8%):</span>
                <span className="font-mono font-bold">${order.tax.toFixed(2)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Discount:</span>
                  <span className="font-mono">-${order.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-extrabold text-slate-900">
                <span>Amount Paid:</span>
                <span className="font-mono text-indigo-600">${order.totalAmount.toFixed(2)}</span>
              </div>
              <p className="text-[10px] text-slate-400 text-right mt-1">Payment Method: {order.paymentMethod}</p>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 text-center text-[10px] text-slate-400">
            Thank you for shopping with SuperStore! For questions regarding this invoice, contact support@superstore.com
          </div>

        </div>

      </div>
    </div>
  );
};
