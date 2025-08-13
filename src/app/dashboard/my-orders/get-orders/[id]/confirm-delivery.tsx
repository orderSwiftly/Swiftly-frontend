import { useState, useRef } from "react";
import { EnterDeliveryCode } from "@/lib/confirm-delivery";
import { useParams } from "next/navigation";
import PulseLoader from "@/components/pulse-loader";
import toast from "react-hot-toast";

export default function ConfirmDelivery() {
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const inputsRef = useRef<HTMLInputElement[]>([]);
  const { id: orderId } = useParams(); // get orderId from URL

  const handleChange = (value: string, index: number) => {
    if (/^[0-9]?$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      if (value && index < 5) {
        inputsRef.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    const deliveryCode = code.join("").trim();

    if (deliveryCode.length === 6) {
      setIsLoading(true);
      try {
        await EnterDeliveryCode(orderId as string, deliveryCode);
        toast.success("Delivery confirmed successfully!");
      } catch {
        toast.error("Failed to confirm delivery. Please try again.");
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.error("Please enter the full 6-digit code.");
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();

    if (/^\d{6}$/.test(pastedData)) {
      const newCode = pastedData.split("");
      setCode(newCode);
      inputsRef.current[5]?.focus(); // Focus last input
    }
  };

  return (
    <main
      className="sec-ff"
      style={{ textAlign: "center", padding: "20px", background: "#00050E" }}
    >
      <h1>Confirm Delivery</h1>
      <p style={{ marginBottom: "20px", color: "#666" }}>
        Enter the 6-digit delivery code to confirm receipt
      </p>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          marginBottom: "20px",
        }}
        onPaste={handlePaste}
      >
        {code.map((digit, index) => (
          <input
            key={index}
            type="text"
            value={digit}
            maxLength={1}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            ref={(el) => {
              if (el) inputsRef.current[index] = el;
            }}
            style={{
              width: "40px",
              height: "50px",
              textAlign: "center",
              fontSize: "1.5rem",
              border: "1px solid #ccc",
              borderRadius: "5px",
              outline: "none",
            }}
            disabled={isLoading}
          />
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={isLoading || code.join("").length !== 6}
        style={{
          padding: "10px 20px",
          fontSize: "1rem",
          backgroundColor:
            isLoading || code.join("").length !== 6 ? "#00050E" : "#2DCAD7",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor:
            isLoading || code.join("").length !== 6
              ? "not-allowed"
              : "pointer",
          minWidth: "120px",
        }}
      >
        {isLoading ? <PulseLoader /> : "Confirm"}
      </button>
    </main>
  );
}