import jsPDF from 'jspdf';

interface Pricing {
  subtotal: number;
  serviceFee: number;
  deliveryFee: number;
  total: number;
}

interface ReceiptData {
  orderId: string;
  pricing: Pricing;
  deliveryCode: string;
  fullName?: string;
}

export const generateReceiptPDF = ({
  orderId,
  pricing,
  deliveryCode,
  fullName,
}: ReceiptData) => {
  const doc = new jsPDF();

  const startX = 20;
  let currentY = 20;

  doc.setFontSize(18);
  doc.setTextColor(45, 202, 215);
  doc.text('Swiftly Payment Receipt', startX, currentY);

  currentY += 15;
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);

  doc.text(`Transaction Status: Successful`, startX, currentY);
  currentY += 10;

  doc.text(`Customer: ${fullName || 'Anonymous Customer'}`, startX, currentY);
  currentY += 10;

  doc.text(`Order ID: ${orderId}`, startX, currentY);
  currentY += 10;

  doc.text(`Subtotal: ₦${pricing.subtotal.toLocaleString()}`, startX, currentY);
  currentY += 10;

  doc.text(`Service Fee: ₦${pricing.serviceFee.toLocaleString()}`, startX, currentY);
  currentY += 10;

  doc.text(`Delivery Fee: ₦${pricing.deliveryFee.toLocaleString()}`, startX, currentY);
  currentY += 10;

  doc.text(`Total: ₦${pricing.total.toLocaleString()}`, startX, currentY);
  currentY += 10;

  doc.text(`Delivery Code: ${deliveryCode}`, startX, currentY);
  currentY += 10;

  doc.text(`Date: ${new Date().toLocaleString()}`, startX, currentY);

  doc.save(`Swiftly_Receipt_${orderId}.pdf`);
};