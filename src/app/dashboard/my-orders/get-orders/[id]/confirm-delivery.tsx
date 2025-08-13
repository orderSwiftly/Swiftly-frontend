import { useState, useRef } from "react";
import { EnterDeliveryCode } from "@/lib/confirm-delivery";
import { useParams } from "next/navigation";

export default function ConfirmDelivery() {
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
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
    const deliveryCode = code.join("");
    if (deliveryCode.length === 6) {
      try {
        await EnterDeliveryCode(orderId as string, deliveryCode);
        alert("Delivery confirmed successfully!");
      } catch (error) {
        console.error("Error confirming delivery:", error);
        alert("Failed to confirm delivery.");
      }
    } else {
      alert("Please enter the full 6-digit code.");
    }
  };

  return (
    <main style={{ textAlign: "center" }}>
      <h1>Confirm Delivery</h1>
      <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "20px" }}>
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
            }}
          />
        ))}
      </div>
      <button
        onClick={handleSubmit}
        style={{
          padding: "10px 20px",
          fontSize: "1rem",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Confirm
      </button>
    </main>
  );
}
