import { PricingRule } from "../models/pricingRule";
import { Product } from "../models/product";

export const calculateTotal = (
  items: Product[],
  rules: PricingRule[]
): number => {
  const baseTotal = items.reduce((sum, item) => sum + item.price, 0);
  const discount = rules.reduce((sum, rule) => sum + rule(items), 0);
  const finalDiscount = Math.max(0, discount);
  const total = baseTotal - finalDiscount;

  return total;
};
