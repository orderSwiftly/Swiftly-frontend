// src/components/riders/delivery-window.tsx
export default function DeliveryWindow() {
    const windows = [
        { delivery: "10:00 - 11:30 AM" },
        { delivery: "12:00 - 1:30 PM" },
        { delivery: "2:00 - 3:30 PM" },
        { delivery: "4:00 - 5:30 PM" },
        { delivery: "6:00 - 7:30 PM" },
        { delivery: "7:30 - 8:00 PM" }
    ];

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg font-semibold text-gray-800">Delivery Windows</h2>
                <p className="text-sm text-gray-500">Order cut-off and delivery time slots</p>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-100 border-b border-gray-200">
                            {/* <th className="px-4 py-3 text-left font-medium text-gray-600">Order Window</th> */}
                            <th className="px-4 py-3 text-left font-medium text-gray-600">Delivery Window</th>
                        </tr>
                    </thead>
                    <tbody>
                        {windows.map((window, index) => (
                            <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                {/* <td className="px-4 py-3 text-gray-700">{window.order}</td> */}
                                <td className="px-4 py-3 text-gray-700">{window.delivery}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}