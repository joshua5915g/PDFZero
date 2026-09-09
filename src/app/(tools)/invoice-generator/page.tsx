"use client";

import React, { useState } from "react";
import DocGeneratorLayout from "@/components/tools/DocGeneratorLayout";
import { Plus, Trash2 } from "lucide-react";

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
}

export default function InvoiceGenerator() {
  const [invoiceNumber, setInvoiceNumber] = useState("INV-2024-001");
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split("T")[0]);
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [companyName, setCompanyName] = useState("Acme Studio LLC");
  const [companyEmail, setCompanyEmail] = useState("billing@acmestudio.com");
  const [companyAddress, setCompanyAddress] = useState("100 Innovation Way, Suite 400\nSan Francisco, CA 94105");
  
  const [clientName, setClientName] = useState("Global Tech Partners");
  const [clientEmail, setClientEmail] = useState("accounts@globaltech.com");
  const [clientAddress, setClientAddress] = useState("500 Enterprise Blvd\nAustin, TX 78701");
  
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: "1", description: "UI/UX Product Design & Wireframing", quantity: 40, rate: 85 },
    { id: "2", description: "Frontend Development & Integration", quantity: 65, rate: 95 },
    { id: "3", description: "Cloud Infrastructure Setup", quantity: 1, rate: 1200 },
  ]);

  const [taxRate, setTaxRate] = useState(8.5);
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState("Thank you for your business! Payment is due within 14 days of issue date.");
  const [currency, setCurrency] = useState("$");

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      { id: Date.now().toString(), description: "New Service or Product", quantity: 1, rate: 100 }
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.rate, 0);
  const discountAmount = (subtotal * discount) / 100;
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = (taxableAmount * taxRate) / 100;
  const total = taxableAmount + taxAmount;

  const handlePrint = () => {
    window.print();
  };

  return (
    <DocGeneratorLayout
      title="Invoice Generator"
      description="Create, customize, and download clean professional client invoices. No signup, no watermarks, completely client-side."
      iconName="FileSpreadsheet"
      category="Business & Marketing"
      onDownloadPdf={handlePrint}
      onPrint={handlePrint}
      tips={[
        "Click Print or Download PDF to save this invoice as a clean A4 vector document.",
        "Your financial and client data stays 100% inside your browser memory.",
        "Use itemized rates and tax percentages for accurate auto-calculated totals."
      ]}
      formControls={
        <div className="space-y-5 text-xs text-slate-300">
          {/* Invoice Meta */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Invoice #</label>
              <input
                type="text"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="w-full bg-slate-950/60 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Issue Date</label>
              <input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full bg-slate-950/60 border border-slate-800 rounded-lg p-2 text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-slate-950/60 border border-slate-800 rounded-lg p-2 text-white focus:outline-none"
              />
            </div>
          </div>

          {/* From Details */}
          <div className="p-3.5 bg-slate-950/40 border border-slate-800/80 rounded-xl space-y-2.5">
            <span className="font-bold text-slate-200">Your Business (From)</span>
            <input
              type="text"
              placeholder="Business Name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-white"
            />
            <input
              type="email"
              placeholder="billing@example.com"
              value={companyEmail}
              onChange={(e) => setCompanyEmail(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-white"
            />
            <textarea
              rows={2}
              placeholder="Street address, City, Zip"
              value={companyAddress}
              onChange={(e) => setCompanyAddress(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-white resize-none"
            />
          </div>

          {/* Client Details */}
          <div className="p-3.5 bg-slate-950/40 border border-slate-800/80 rounded-xl space-y-2.5">
            <span className="font-bold text-slate-200">Client Info (Bill To)</span>
            <input
              type="text"
              placeholder="Client Name"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-white"
            />
            <input
              type="email"
              placeholder="client@company.com"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-white"
            />
            <textarea
              rows={2}
              placeholder="Client address"
              value={clientAddress}
              onChange={(e) => setClientAddress(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-white resize-none"
            />
          </div>

          {/* Line Items */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200">Itemized Breakdown</span>
              <button
                onClick={addItem}
                className="px-2.5 py-1 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg text-xs font-semibold inline-flex items-center gap-1 transition"
              >
                <Plus className="size-3" />
                <span>Add Item</span>
              </button>
            </div>

            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                <input
                  type="text"
                  placeholder="Item description"
                  value={item.description}
                  onChange={(e) => updateItem(item.id, "description", e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded p-1.5 text-white"
                />
                <input
                  type="number"
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={(e) => updateItem(item.id, "quantity", Math.max(1, parseFloat(e.target.value) || 0))}
                  className="w-14 bg-slate-900 border border-slate-800 rounded p-1.5 text-white text-center"
                />
                <input
                  type="number"
                  placeholder="Rate"
                  value={item.rate}
                  onChange={(e) => updateItem(item.id, "rate", Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-20 bg-slate-900 border border-slate-800 rounded p-1.5 text-white text-right"
                />
                <button
                  onClick={() => removeItem(item.id)}
                  disabled={items.length <= 1}
                  className="p-1.5 text-slate-500 hover:text-red-400 disabled:opacity-30 transition"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Tax & Discounts */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Tax Rate (%)</label>
              <input
                type="number"
                value={taxRate}
                onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950/60 border border-slate-800 rounded p-2 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Discount (%)</label>
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950/60 border border-slate-800 rounded p-2 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Payment Notes / Terms</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-950/60 border border-slate-800 rounded p-2 text-white resize-none"
            />
          </div>
        </div>
      }
      previewNode={
        <div id="invoice-preview" className="space-y-8 font-sans">
          {/* Header */}
          <div className="flex justify-between items-start border-b border-slate-200 pb-6">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900">{companyName}</h2>
              <p className="text-slate-500 text-xs mt-1">{companyEmail}</p>
              <p className="text-slate-500 text-xs whitespace-pre-line">{companyAddress}</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-amber-600 tracking-wider">INVOICE</span>
              <p className="font-mono text-xs font-bold text-slate-700 mt-1">{invoiceNumber}</p>
              <p className="text-[11px] text-slate-500 mt-2">Issue Date: <strong className="text-slate-800">{issueDate}</strong></p>
              <p className="text-[11px] text-slate-500">Due Date: <strong className="text-slate-800">{dueDate}</strong></p>
            </div>
          </div>

          {/* Client Details */}
          <div className="grid grid-cols-2 gap-6 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Billed To</span>
              <h4 className="font-bold text-slate-900 text-sm mt-1">{clientName}</h4>
              <p className="text-slate-500">{clientEmail}</p>
              <p className="text-slate-500 whitespace-pre-line">{clientAddress}</p>
            </div>
          </div>

          {/* Table */}
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-200 text-slate-600 uppercase text-[10px] tracking-wider">
                <th className="py-2.5">Description</th>
                <th className="py-2.5 text-center">Qty</th>
                <th className="py-2.5 text-right">Rate</th>
                <th className="py-2.5 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item) => (
                <tr key={item.id} className="text-slate-800">
                  <td className="py-3 font-medium">{item.description}</td>
                  <td className="py-3 text-center">{item.quantity}</td>
                  <td className="py-3 text-right">{currency}{item.rate.toFixed(2)}</td>
                  <td className="py-3 text-right font-semibold">{currency}{(item.quantity * item.rate).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Summary */}
          <div className="flex justify-end pt-4 border-t border-slate-200">
            <div className="w-64 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-semibold text-slate-900">{currency}{subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount ({discount}%):</span>
                  <span>-{currency}{discountAmount.toFixed(2)}</span>
                </div>
              )}
              {taxRate > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Tax ({taxRate}%):</span>
                  <span className="font-semibold text-slate-900">+{currency}{taxAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-black text-slate-900 border-t-2 border-slate-900 pt-2">
                <span>Total Due:</span>
                <span>{currency}{total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {notes && (
            <div className="pt-6 border-t border-slate-100 text-[11px] text-slate-500">
              <span className="font-bold text-slate-700 block mb-1">Notes & Terms:</span>
              <p className="whitespace-pre-line leading-relaxed">{notes}</p>
            </div>
          )}
        </div>
      }
    />
  );
}
