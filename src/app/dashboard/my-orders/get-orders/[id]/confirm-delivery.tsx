import { useState, useRef } from "react";
import { EnterDeliveryCode } from "@/lib/confirm-delivery";
import { useParams } from "next/navigation";

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
    
    console.log('Submitting delivery code:', deliveryCode);
    console.log('Code length:', deliveryCode.length);
    console.log('Order ID:', orderId);
    
    if (deliveryCode.length === 6) {
      setIsLoading(true);
      try {
        const result = await EnterDeliveryCode(orderId as string, deliveryCode);
        console.log('Success result:', result);
        alert("Delivery confirmed successfully!");
        
        // Optionally redirect to success page
        // router.push('/delivery-confirmed');
        
      } catch (error: unknown) {
        console.error("Full error object:", error);

        let errorMessage = 'Failed to confirm delivery';
        if (typeof error === "object" && error !== null) {
          // @ts-expect-error: error might have response/message properties
          if (error.response?.data?.message) {
            // @ts-expect-error: error might have response property
            errorMessage = error.response.data.message;
          // @ts-expect-error: error might have message property
          } else if (error.message) {
            // @ts-expect-error: error might have message property
            errorMessage = error.message;
          }
          // @ts-expect-error: error might have response property
          if (error.response?.data) {
            // @ts-expect-error: error might have response property
            console.error("Error response:", error.response.data);
          }
          // @ts-expect-error: error might have response property
          if (error.response?.status) {
            // @ts-expect-error: error might have response property
            console.error("Error status:", error.response.status);
          }
        }

        alert(`Error: ${errorMessage}`);
      } finally {
        setIsLoading(false);
      }
    } else {
      alert("Please enter the full 6-digit code.");
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    
    if (/^\d{6}$/.test(pastedData)) {
      const newCode = pastedData.split('');
      setCode(newCode);
      inputsRef.current[5]?.focus(); // Focus last input
    }
  };

  return (
    <main style={{ textAlign: "center", padding: "20px" }}>
      <h1>Confirm Delivery</h1>
      <p style={{ marginBottom: "20px", color: "#666" }}>
        Enter the 6-digit delivery code to confirm receipt
      </p>
      
      <div 
        style={{ 
          display: "flex", 
          justifyContent: "center", 
          gap: "10px", 
          marginBottom: "20px" 
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
          backgroundColor: isLoading || code.join("").length !== 6 ? "#ccc" : "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: isLoading || code.join("").length !== 6 ? "not-allowed" : "pointer",
          minWidth: "120px",
        }}
      >
        {isLoading ? "Confirming..." : "Confirm"}
      </button>
      
      {/* Debug info - remove in production */}
      <div style={{ marginTop: "20px", fontSize: "12px", color: "#999" }}>
        <p>Debug: Order ID = {orderId}</p>
        <p>Debug: Current Code = {code.join("")}</p>
      </div>
    </main>
  );
}