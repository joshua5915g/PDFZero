"use client";

import React, { useState, useMemo } from "react";
import CalculatorLayout from "@/components/tools/CalculatorLayout";

export default function DiscountCalculator() {
  const [originalPrice, setOriginalPrice] = useState(120);
  const [discountPercent, setDiscountPercent] = useState(25);
  const [additionalDiscount, setAdditionalDiscount] = useState(10); // stackable coupon %
  const [taxPercent, setTaxPercent] = useState(8.25);

  const { finalPrice, totalSaved, savingsPercent, subtotalBeforeTax } = useMemo(() => {
    const afterFirst = originalPrice * (1 - discountPercent / 100);
    const afterSecond = afterFirst * (1 - additionalDiscount / 100);
    const tax = afterSecond * (taxPercent / 100);
    const final = afterSecond + tax;
    const saved = originalPrice - afterSecond;
    const effectiveSavingsPct = originalPrice > 0 ? (saved / originalPrice) * 100 : 0;

    return {
      finalPrice: Math.max(0, final),
      totalSaved: Math.max(0, saved),
      savingsPercent: effectiveSavingsPct,
      subtotalBeforeTax: Math.max(0, afterSecond)
    };
  }, [originalPrice, discountPercent, additionalDiscount, taxPercent]);

  return (
    <CalculatorLayout
      title="Discount & Sale Calculator"
      description="Calculate sale price, double stackable coupons, and post-tax checkout total in seconds."
      iconName="Tag"
      category="Calculators & Units"
      resultSummary={{
        label: "Final Checkout Price",
        value: `$${finalPrice.toFixed(2)}`,
        subtext: `You Save: $${totalSaved.toFixed(2)} (${savingsPercent.toFixed(1)}% off)`
      }}
      breakdown={[
        { label: "Original Sticker Price", value: `$${originalPrice.toFixed(2)}` },
        { label: "Primary Sale Discount", value: `${discountPercent}% Off` },
        { label: "Additional Promo / Coupon", value: `${additionalDiscount}% Off` },
        { label: "Subtotal (Before Tax)", value: `$${subtotalBeforeTax.toFixed(2)}`, color: "text-emerald-400" },
        { label: "Estimated Sales Tax", value: `${taxPercent}%` }
      ]}
      tips={[
        "Stacked discounts compound sequentially rather than simply adding up.",
        "A 20% discount stacked with another 20% discount yields an effective 36% discount, not 40%."
      ]}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Original Price ($)
          </label>
          <input
            type="number"
            value={originalPrice}
            onChange={(e) => setOriginalPrice(Math.max(0, Number(e.target.value)))}
            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-lg font-semibold text-white focus:outline-none focus:border-purple-500"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Sale Discount (%): {discountPercent}%
          </label>
          <input
            type="range"
            min={0}
            max={90}
            step={5}
            value={discountPercent}
            onChange={(e) => setDiscountPercent(Number(e.target.value))}
            className="w-full accent-purple-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Extra Promo / Coupon Code (%): {additionalDiscount}%
          </label>
          <input
            type="range"
            min={0}
            max={50}
            step={5}
            value={additionalDiscount}
            onChange={(e) => setAdditionalDiscount(Number(e.target.value))}
            className="w-full accent-purple-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Local Sales Tax (%)
          </label>
          <input
            type="number"
            step="0.25"
            value={taxPercent}
            onChange={(e) => setTaxPercent(Math.max(0, Number(e.target.value)))}
            className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-semibold text-white focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>
    </CalculatorLayout>
  );
}
