import { jsPDF } from 'jspdf';
import { Order } from '../types';

export const generateInvoicePDF = (order: Order) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Colors
  const primaryColor = [79, 70, 229]; // Indigo-600
  const darkTextColor = [15, 23, 42]; // Slate-900
  const grayTextColor = [100, 116, 139]; // Slate-500
  const lightBgColor = [248, 250, 252]; // Slate-50

  // Header Banner / Logo
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, 210, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('SUPERSTORE INC.', 15, 18);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('OFFICIAL SALES INVOICE', 195, 18, { align: 'right' });

  // Invoice Meta
  let y = 38;
  doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`INVOICE #${order.id}`, 15, y);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(grayTextColor[0], grayTextColor[1], grayTextColor[2]);
  doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 195, y, { align: 'right' });

  y += 6;
  doc.text(`Payment Method: ${order.paymentMethod}`, 15, y);
  if (order.transactionId) {
    doc.text(`Txn ID: ${order.transactionId}`, 195, y, { align: 'right' });
  }

  // Customer & Shipping Box
  y += 8;
  doc.setFillColor(lightBgColor[0], lightBgColor[1], lightBgColor[2]);
  doc.roundedRect(15, y, 180, 32, 3, 3, 'F');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('BILLED TO:', 20, y + 7);
  doc.text('SHIPPING ADDRESS:', 110, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
  doc.text(order.customerName || 'Customer', 20, y + 13);
  doc.text(order.customerEmail || 'N/A', 20, y + 18);
  doc.text(order.customerPhone || 'N/A', 20, y + 23);

  const addr = order.shippingAddress;
  doc.text(`${addr.street}`, 110, y + 13);
  doc.text(`${addr.city}, ${addr.state} - ${addr.pincode}`, 110, y + 18);
  doc.text(`Shipping: ${order.deliveryOption.title} (${order.deliveryOption.estimatedDays})`, 110, y + 23);

  // Items Table Header
  y += 38;
  doc.setFillColor(241, 245, 249);
  doc.rect(15, y, 180, 8, 'F');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
  doc.text('Item Description', 18, y + 5.5);
  doc.text('Qty', 120, y + 5.5, { align: 'center' });
  doc.text('Unit Price', 155, y + 5.5, { align: 'right' });
  doc.text('Total', 190, y + 5.5, { align: 'right' });

  // Table Body Rows
  y += 10;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);

  order.items.forEach((item) => {
    if (y > 250) {
      doc.addPage();
      y = 20;
    }

    const title = item.product.name.length > 50 ? item.product.name.substring(0, 48) + '...' : item.product.name;
    doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
    doc.text(title, 18, y);
    doc.text(String(item.quantity), 120, y, { align: 'center' });
    doc.text(`$${item.product.price.toFixed(2)}`, 155, y, { align: 'right' });
    doc.text(`$${(item.product.price * item.quantity).toFixed(2)}`, 190, y, { align: 'right' });

    y += 7;
    doc.setDrawColor(226, 232, 240);
    doc.line(15, y - 2, 195, y - 2);
  });

  // Totals Summary Box
  y += 5;
  if (y > 240) {
    doc.addPage();
    y = 20;
  }

  doc.setFontSize(9);
  doc.setTextColor(grayTextColor[0], grayTextColor[1], grayTextColor[2]);

  doc.text('Subtotal:', 140, y);
  doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
  doc.text(`$${order.subtotal.toFixed(2)}`, 190, y, { align: 'right' });

  y += 5;
  doc.setTextColor(grayTextColor[0], grayTextColor[1], grayTextColor[2]);
  doc.text('Delivery Fee:', 140, y);
  doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
  doc.text(`$${order.deliveryFee.toFixed(2)}`, 190, y, { align: 'right' });

  y += 5;
  doc.setTextColor(grayTextColor[0], grayTextColor[1], grayTextColor[2]);
  doc.text('Tax (8%):', 140, y);
  doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
  doc.text(`$${order.tax.toFixed(2)}`, 190, y, { align: 'right' });

  if (order.discount > 0) {
    y += 5;
    doc.setTextColor(16, 185, 129); // emerald
    doc.text('Discount:', 140, y);
    doc.text(`-$${order.discount.toFixed(2)}`, 190, y, { align: 'right' });
  }

  y += 7;
  doc.setLineWidth(0.5);
  doc.setDrawColor(79, 70, 229);
  doc.line(135, y - 2, 195, y - 2);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('Total Paid:', 140, y + 3);
  doc.text(`$${order.totalAmount.toFixed(2)}`, 190, y + 3, { align: 'right' });

  // Footer Note
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(grayTextColor[0], grayTextColor[1], grayTextColor[2]);
  doc.text('Thank you for shopping with SuperStore! For questions regarding this invoice, contact support@superstore.com', 105, 285, { align: 'center' });

  // Save PDF
  doc.save(`Invoice_${order.id}.pdf`);
};
