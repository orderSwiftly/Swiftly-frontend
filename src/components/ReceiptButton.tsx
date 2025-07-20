'use client';

import { generateReceiptPDF } from '@/utils/pdfReceipt';

interface ReceiptButtonProps {
  orderId: string;
  amount: number;
  deliveryCode: string;
  fullname?: string;
}

const ReceiptButton: React.FC<ReceiptButtonProps> = ({
  orderId,
  amount,
  deliveryCode,
  fullname,
}) => {
  const handleDownload = () => {
    generateReceiptPDF({
      orderId,
      amount,
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
