"use client";

import React, { useState } from "react";
import DocGeneratorLayout from "@/components/tools/DocGeneratorLayout";

export default function PayStubGenerator() {
  const [companyName, setCompanyName] = useState("Acme Software Inc.");
  const [companyAddress, setCompanyAddress] = useState("100 Innovation Way, Suite 400, San Francisco, CA");
  const [employeeName, setEmployeeName] = useState("John Doe");
  const [employeeId, setEmployeeId] = useState("EMP-8492");
  const [payPeriod, setPayPeriod] = useState("09/01/2026 - 09/15/2026");
  const [payDate, setPayDate] = useState("09/18/2026");
  const [hourlyRate, setHourlyRate] = useState(45);
  const [regularHours, setRegularHours] = useState(80);
  const [overtimeHours, setOvertimeHours] = useState(5);
  const [fedTaxRate, setFedTaxRate] = useState(12);
  const [stateTaxRate, setStateTaxRate] = useState(5);

  const regularPay = hourlyRate * regularHours;
  const overtimePay = hourlyRate * 1.5 * overtimeHours;
  const grossPay = regularPay + overtimePay;

  const fedTax = grossPay * (fedTaxRate / 100);
  const stateTax = grossPay * (stateTaxRate / 100);
  const ficaTax = grossPay * 0.0765; // 6.2% SS + 1.45% Medicare
  const totalDeductions = fedTax + stateTax + ficaTax;
  const netPay = grossPay - totalDeductions;

  const handlePrint = () => {
    window.print();
  };

  return (
    <DocGeneratorLayout
      title="Pay Stub Generator"
      description="Generate professional, itemized employee earnings statements and pay stubs for printing or PDF export."
      iconName="FileSpreadsheet"
      category="Business & Marketing"
      onDownloadPdf={handlePrint}
      onPrint={handlePrint}
      tips={[
        "Click Print / Save as PDF to generate clean letterhead pay stubs for loan or income verification.",
        "Ensure hours and deduction rates match your payroll schedule."
      ]}
      formControls={
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-400">Employer Information</div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Company Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Company Address</label>
              <input
                type="text"
                value={companyAddress}
                onChange={(e) => setCompanyAddress(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-400">Employee & Pay Period</div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Employee Name</label>
                <input
                  type="text"
                  value={employeeName}
                  onChange={(e) => setEmployeeName(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Employee ID</label>
                <input
                  type="text"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Pay Period</label>
                <input
                  type="text"
                  value={payPeriod}
                  onChange={(e) => setPayPeriod(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Payment Date</label>
                <input
                  type="text"
                  value={payDate}
                  onChange={(e) => setPayDate(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white"
                />
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-400">Hours & Compensation</div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Hourly Rate ($)</label>
                <input
                  type="number"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Regular Hours</label>
                <input
                  type="number"
                  value={regularHours}
                  onChange={(e) => setRegularHours(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Overtime Hours</label>
                <input
                  type="number"
                  value={overtimeHours}
                  onChange={(e) => setOvertimeHours(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Fed Tax Rate (%)</label>
                <input
                  type="number"
                  value={fedTaxRate}
                  onChange={(e) => setFedTaxRate(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">State Tax Rate (%)</label>
                <input
                  type="number"
                  value={stateTaxRate}
                  onChange={(e) => setStateTaxRate(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white"
                />
              </div>
            </div>
          </div>
        </div>
      }
      previewNode={
        <div className="bg-white text-slate-900 p-8 rounded-xl shadow-2xl space-y-6 text-sm font-sans">
          {/* Header */}
          <div className="flex justify-between items-start border-b border-slate-300 pb-4">
            <div>
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">{companyName}</h2>
              <p className="text-xs text-slate-600 mt-1 max-w-xs">{companyAddress}</p>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 bg-slate-100 border border-slate-300 rounded text-xs font-bold text-slate-800 uppercase">
                Earnings Statement
              </span>
              <p className="text-xs text-slate-500 mt-1">Pay Date: {payDate}</p>
            </div>
          </div>

          {/* Employee Meta */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 block">Employee:</span>
              <span className="font-bold text-slate-900">{employeeName}</span>
              <span className="text-slate-500 block mt-1">ID: {employeeId}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Pay Period:</span>
              <span className="font-bold text-slate-900">{payPeriod}</span>
            </div>
          </div>

          {/* Earnings & Deductions Tables */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-xs uppercase text-slate-700 mb-2 border-b border-slate-200 pb-1">Earnings</h3>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span>Regular ({regularHours} hrs @ ${hourlyRate})</span>
                  <span className="font-semibold">${regularPay.toFixed(2)}</span>
                </div>
                {overtimeHours > 0 && (
                  <div className="flex justify-between">
                    <span>Overtime ({overtimeHours} hrs @ ${(hourlyRate * 1.5).toFixed(2)})</span>
                    <span className="font-semibold">${overtimePay.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-slate-200 pt-1 font-bold text-slate-900">
                  <span>Gross Pay</span>
                  <span>${grossPay.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-xs uppercase text-slate-700 mb-2 border-b border-slate-200 pb-1">Deductions</h3>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span>Federal Tax ({fedTaxRate}%)</span>
                  <span className="font-semibold">-${fedTax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>State Tax ({stateTaxRate}%)</span>
                  <span className="font-semibold">-${stateTax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>FICA / Medicare (7.65%)</span>
                  <span className="font-semibold">-${ficaTax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-1 font-bold text-slate-900">
                  <span>Total Deductions</span>
                  <span>-${totalDeductions.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Net Pay Box */}
          <div className="bg-emerald-50 border-2 border-emerald-500/40 p-4 rounded-xl flex justify-between items-center">
            <div>
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">Net Take-Home Pay</span>
              <span className="text-[11px] text-emerald-600">Direct Deposit / Check</span>
            </div>
            <div className="text-2xl font-black text-emerald-700">
              ${netPay.toFixed(2)}
            </div>
          </div>
        </div>
      }
    />
  );
}
