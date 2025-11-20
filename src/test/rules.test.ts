import { PRODUCTS } from "../data/products";
import { bulkDiscount, multiBuyOffer } from "../rules/pricingRules";

describe("Pricing Rules Coverage Tests", () => {
  const { atv, ipd } = PRODUCTS;

  test("multiBuyOffer: returns 0 when no matching SKU exists", () => {
    const rule = multiBuyOffer("atv", 3, 2);
    const discount = rule([]); // No items
    expect(discount).toBe(0);
  });

  test("multiBuyOffer: returns 0 when quantity is below required threshold", () => {
    const rule = multiBuyOffer("atv", 3, 2);
    const discount = rule([atv, atv]); // Only 2 items
    expect(discount).toBe(0);
  });

  test("multiBuyOffer: applies discount for exactly one eligible group", () => {
    const rule = multiBuyOffer("atv", 3, 2);
    const discount = rule([atv, atv, atv]); // Exactly 3 -> 1 free
    expect(discount).toBe(atv.price);
  });

  test("multiBuyOffer: applies discount for multiple eligible groups", () => {
    const rule = multiBuyOffer("atv", 3, 2);
    const items = [atv, atv, atv, atv, atv, atv]; // 6 TVs -> 2 free
    const discount = rule(items);
    expect(discount).toBe(2 * atv.price);
  });

  test("bulkDiscount: returns 0 when no matching SKU exists", () => {
    const rule = bulkDiscount("ipd", 4, 499.99);
    const discount = rule([]);
    expect(discount).toBe(0);
  });

  test("bulkDiscount: returns 0 when quantity is equal to threshold", () => {
    const rule = bulkDiscount("ipd", 4, 499.99);
    const discount = rule([ipd, ipd, ipd, ipd]); // 4 items -> no discount
    expect(discount).toBe(0);
  });

  test("bulkDiscount: applies correct discount when quantity exceeds threshold", () => {
    const rule = bulkDiscount("ipd", 4, 499.99);
    const items = [ipd, ipd, ipd, ipd, ipd]; // 5 -> discount applies
    const discount = rule(items);
    const expected = (ipd.price - 499.99) * 5;
    expect(discount).toBe(expected);
  });
});

describe("Pricing Rules: Error and Edge Case", () => {
  const { ipd } = PRODUCTS;

  test("bulkDiscount throws error for invalid parameters", () => {
    expect(() => bulkDiscount("", 3, 5)).toThrow();
    expect(() => bulkDiscount("ipd", -1, 5)).toThrow();
    expect(() => bulkDiscount("ipd", 3, -1)).toThrow();
  });

  test("bulkDiscount throws when product price is invalid", () => {
    const rule = bulkDiscount("ipd", 4, 499.99);

    expect(() => rule([{ sku: "ipd", price: "100" } as any])).toThrow(
      "Invalid product price."
    );
  });

  test("bulkDiscount returns 0 when discountPerItem becomes negative", () => {
    const rule = bulkDiscount("ipd", 1, 10000); // discount higher than price
    const result = rule([ipd, ipd]);
    expect(result).toBe(0); // max(0, price - discountedPrice)
  });

  test("multiBuyOffer throws error for invalid parameters", () => {
    expect(() => multiBuyOffer("", 3, 2)).toThrow();
    expect(() => multiBuyOffer("atv", -1, 2)).toThrow();
    expect(() => multiBuyOffer("atv", 3, -1)).toThrow();
    expect(() => multiBuyOffer("atv", 2, 3)).toThrow(); // payForQty > requiredQty
  });

  test("multiBuyOffer throws when product price is invalid", () => {
    const rule = multiBuyOffer("atv", 3, 2);
    expect(() => rule([{ sku: "atv", price: "100" } as any])).toThrow(
      "Invalid product price."
    );
  });
});
