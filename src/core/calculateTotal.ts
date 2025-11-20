import { PricingRule } from "../models/pricingRule";
import { Product } from "../models/product";

export const calculateTotal = (
  items: Product[],
  rules: PricingRule[]
): number => {
  try {
    if (!Array.isArray(items) || !Array.isArray(rules)) {
      throw new Error("Invalid input: items and rules must be arrays.");
    }

    for (const item of items) {
      if (item.price == null || typeof item.price !== "number") {
        throw new Error(`Invalid product price for SKU: ${item.sku}`);
      }
    }

    const baseTotal = items.reduce((sum, item) => sum + item.price, 0);

    const discount = rules.reduce((sum, rule) => sum + rule(items), 0);

    if (typeof baseTotal !== "number" || typeof discount !== "number") {
      throw new Error("Calculation error: total or discount is not a number.");
    }

    const finalDiscount = Math.max(0, discount);

    const total = baseTotal - finalDiscount;

    if (total < 0) {
      throw new Error("Total cannot be negative.");
    }

    return parseFloat(total.toFixed(2));
  } catch (error) {
    throw error;
  }
};
