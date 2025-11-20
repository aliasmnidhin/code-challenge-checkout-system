import { PRODUCTS } from "../data/products";
import { bulkDiscount, multiBuyOffer } from "../rules/pricingRules";

describe("Pricing Rules Coverage Tests", () => {
  const { ipd } = PRODUCTS;

  test("multiBuyOffer: returns 0 when no matching SKU exists", () => {
    const rule = multiBuyOffer("atv", 3, 2);
    const discount = rule([]); // No items
    expect(discount).toBe(0);
  });

  test("bulkDiscount: returns 0 when quantity is equal to threshold", () => {
    const rule = bulkDiscount("ipd", 4, 499.99);
    const discount = rule([ipd, ipd, ipd, ipd]); // 4 items -> no discount
    expect(discount).toBe(0);
  });
});
