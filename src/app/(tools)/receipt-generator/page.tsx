"use client";

import React, { useState } from "react";
import DocGeneratorLayout from "@/components/tools/DocGeneratorLayout";
import { Plus, Trash2 } from "lucide-react";

interface ReceiptItem {
  id: string;
  name: string;
  price: number;
  qty: number;
}

export default function ReceiptGenerator() {
  const [storeName, setStoreName] = useState("Apex Digital Solutions");
  const [storeAddress, setStoreAddress] = useState("742 Evergreen Terrace, Springfield");
  const [storePhone, setStorePhone] = useState("+1 (555) 019-2834");
  const [receiptNumber, setReceiptNumber] = useState("REC-884192");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [paymentMethod, setPaymentMethod] = useState<"Credit Card" | "Cash" | "Bank Transfer" | "Apple Pay">("Credit Card");
  const [customerName, setCustomerName] = useState("Jane Doe");
  const [taxRate, setTaxRate] = useState(7);
  
  const [items, setItems] = useState<ReceiptItem[]>([
    { id: "1", name: "Premium License (Annual)", price: 149.00, qty: 1 },
    { id: "2", name: "Priority SLA Support", price: 49.00, qty: 1 },
    { id: "3", name: "Custom Domain Onboarding", price: 25.00, qty: 1 }
  ]);

  const addItem = () => {
    setItems(prev => [...prev, { id: Date.now().toString(), name: "Item / Service", price: 10, qty: 1 }]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(prev => prev.filter(i => i.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof ReceiptItem, val: any) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, [field]: val } : i));
  };

  const subtotal = items.reduce((acc, i) => acc + i.price * i.qty, 0);
  const tax = (subtotal * taxRate) / 100;
  const total = subtotal + tax;

  const handlePrint = () => {
    window.print();
  };

  return (
    <DocGeneratorLayout
      title="Receipt Generator"
      description="Generate instant proof-of-payment receipts with stamped PAID badges. Download as PDF or print directly."
      iconName="Receipt"
      category="Business & Marketing"
      onDownloadPdf={handlePrint}
      onPrint={handlePrint}
      tips={[
        "Customize merchant details, customer names, itemized amounts, and taxes.",
        "Includes authentic 'PAID' verification watermark stamp.",
        "100% free and client-side with instant vector PDF print."
      ]}
      formControls={
        <div className="space-y-4 text-xs text-slate-300">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Receipt Number</label>
              <input
                type="text"
                value={receiptNumber}
                onChange={(e) => setReceiptNumber(e.target.value)}
                className="w-full bg-slate-950/60 border border-slate-800 rounded p-2 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-950/60 border border-slate-800 rounded p-2 text-white"
              />
            </div>
          </div>

          <div className="p-3 bg-slate-950/40 border border-slate-800 rounded-xl space-y-2">
            <span className="font-bold text-slate-200">Merchant / Store</span>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              placeholder="Store or Business Name"
              className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-white"
            />
            <input
              type="text"
              value={storeAddress}
              onChange={(e) => setStoreAddress(e.target.value)}
              placeholder="Store Address"
              className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-white"
            />
            <input
              type="text"
              value={storePhone}
              onChange={(e) => setStorePhone(e.target.value)}
              placeholder="Phone Number"
              className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Customer Name</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-slate-950/60 border border-slate-800 rounded p-2 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full bg-slate-950/60 border border-slate-800 rounded p-2 text-white"
              >
                <option value="Credit Card">Credit Card (Visa/MC)</option>
                <option value="Apple Pay">Apple Pay / Google Pay</option>
                <option value="Cash">Cash</option>
                <option value="Bank Transfer">Bank Wire Transfer</option>
              </select>
            </div>
          </div>

          {/* Items */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-200">Line Items</span>
              <button
                onClick={addItem}
                className="px-2 py-1 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 rounded text-xs font-semibold flex items-center gap-1"
              >
                <Plus className="size-3" /> Add Item
              </button>
            </div>

            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-2 bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => updateItem(item.id, "name", e.target.value)}
                  placeholder="Item name"
                  className="flex-1 bg-slate-900 border border-slate-800 rounded p-1.5 text-white"
                />
                <input
                  type="number"
                  value={item.qty}
                  onChange={(e) => updateItem(item.id, "qty", parseInt(e.target.value) || 1)}
                  className="w-12 bg-slate-900 border border-slate-800 rounded p-1.5 text-white text-center"
                />
                <input
                  type="number"
                  value={item.price}
                  onChange={(e) => updateItem(item.id, "price", parseFloat(e.target.value) || 0)}
                  className="w-16 bg-slate-900 border border-slate-800 rounded p-1.5 text-white text-right"
                />
                <button
                  onClick={() => removeItem(item.id)}
                  disabled={items.length <= 1}
                  className="p-1 text-slate-500 hover:text-red-400 disabled:opacity-30"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Sales Tax Rate (%)</label>
            <input
              type="number"
              value={taxRate}
              onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-950/60 border border-slate-800 rounded p-2 text-white"
            />
          </div>
        </div>
      }
      previewNode={
        <div className="space-y-6 text-slate-800 max-w-sm mx-auto font-mono text-xs border border-dashed border-slate-300 p-6 rounded-lg bg-slate-50/50 shadow-inner relative">
          {/* PAID Watermark Badge */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-12 border-4 border-emerald-600/40 text-emerald-600/40 font-black text-4xl px-6 py-2 rounded-xl pointer-events-none tracking-widest uppercase">
            PAID
          </div>

          <div className="text-center space-y-1 border-b border-slate-200 pb-4">
            <h3 className="font-extrabold text-base text-slate-900 uppercase tracking-tight">{storeName}</h3>
            <p className="text-[10px] text-slate-500">{storeAddress}</p>
            <p className="text-[10px] text-slate-500">{storePhone}</p>
          </div>

          <div className="flex justify-between text-[11px] text-slate-600">
            <div>
              <p>Receipt: <strong className="text-slate-900">{receiptNumber}</strong></p>
              <p>Customer: {customerName}</p>
            </div>
            <div className="text-right">
              <p>Date: {date}</p>
              <p>Method: {paymentMethod}</p>
            </div>
          </div>

          <table className="w-full border-t border-b border-slate-200 py-2 text-[11px]">
            <thead>
              <tr className="text-slate-500 uppercase text-[9px] border-b border-slate-200">
                <th className="py-1 text-left">Item</th>
                <th className="py-1 text-center">Qty</th>
                <th className="py-1 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((i) => (
                <tr key={i.id}>
                  <td className="py-2 text-slate-800">{i.name}</td>
                  <td className="py-2 text-center text-slate-600">{i.qty}</td>
                  <td className="py-2 text-right font-medium text-slate-900">${(i.qty * i.price).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="space-y-1.5 text-right text-[11px]">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {taxRate > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>Tax ({taxRate}%):</span>
                <span>${tax.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-black text-slate-900 border-t border-slate-300 pt-2">
              <span>Total Paid:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="text-center pt-4 border-t border-dashed border-slate-200 text-[10px] text-slate-500 space-y-1">
            <p>Thank you for choosing {storeName}!</p>
            <p>Verification Code: {Math.random().toString(36).substring(2, 10).toUpperCase()}</p>
          </div>
        </div>
      }
    />
  );
}
