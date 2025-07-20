import jsPDF from 'jspdf';

interface ReceiptData {
  orderId: string;
  amount: number;
  deliveryCode: string;
  fullName?: string;
}

export const generateReceiptPDF = ({
  orderId,
  amount,
  deliveryCode,
  fullName,
}: ReceiptData) => {
  const doc = new jsPDF();

  const startX = 20;
  let currentY = 20;

  doc.setFontSize(18);
  doc.setTextColor(45, 202, 215); // Accent color
  doc.text('Tredia Payment Receipt', startX, currentY);

  currentY += 15;
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);

  doc.text(`Transaction Status: Successful`, startX, currentY);
  currentY += 10;

  doc.text(`Customer: ${fullName || 'Anonymous Customer'}`, startX, currentY);
  currentY += 10;

  doc.text(`Order ID: ${orderId}`, startX, currentY);
  currentY += 10;

  doc.text(`Total Amount: ₦${amount.toLocaleString()}`, startX, currentY);
  currentY += 10;

  doc.text(`Delivery Code: ${deliveryCode}`, startX, currentY);
  currentY += 10;

  doc.text(`Date: ${new Date().toLocaleString()}`, startX, currentY);

  doc.save(`Tredia_Receipt_${orderId}.pdf`);
};
