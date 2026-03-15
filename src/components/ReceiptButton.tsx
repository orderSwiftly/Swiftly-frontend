'use client';

import { generateReceiptPDF } from '@/utils/pdfReceipt';

interface Pricing {
  subtotal: number;
  serviceFee: number;
  deliveryFee: number;
  total: number;
}

interface ReceiptButtonProps {
  orderId: string;
  pricing: Pricing;
  deliveryCode: string;
  fullname?: string;
}

const ReceiptButton: React.FC<ReceiptButtonProps> = ({
  orderId,
  pricing,
  deliveryCode,
  fullname,
}) => {
  const handleDownload = () => {
    generateReceiptPDF({
      orderId,
      pricing,
      deliveryCode,
      fullName: fullname || 'Customer',
    });
  };

  return (
    <button
      onClick={handleDownload}
      className="bg-[var(--acc-clr)] hover:bg-[#25b0b8] text-[var(--bg-clr)] font-semibold px-4 py-2 rounded-md mt-4 sec-ff"
    >
      Download Receipt
    </button>
  );
};

export default ReceiptButton;