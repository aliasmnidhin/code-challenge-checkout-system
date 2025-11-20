import { calculateTotal } from "../core/calculateTotal";
import { PRODUCTS } from "../data/products";
import { Product } from "../models/product";
import { Checkout } from "../services/checkout";

describe("calculateTotal - Error & Edge Case Coverage", () => {
  test("throws error when items is not an array", () => {
    expect(() => calculateTotal(null as any, [])).toThrow(
      "Invalid input: items and rules must be arrays."
    );
  });

  test("throws error when rules is not an array", () => {
    expect(() => calculateTotal([], null as any)).toThrow(
      "Invalid input: items and rules must be arrays."
    );
  });

  test("throws error for invalid product price (undefined)", () => {
    const items = [{ sku: "xx", name: "test", price: undefined as any }];
    expect(() => calculateTotal(items, [])).toThrow(
      "Invalid product price for SKU: xx"
    );
  });

  test("throws error for NaN product price", () => {
    const items = [{ sku: "xx", name: "test", price: "100" as any }];
    expect(() => calculateTotal(items, [])).toThrow(
      "Invalid product price for SKU: xx"
    );
  });

  test("total cannot be negative (rule returns huge discount)", () => {
    const items = [{ sku: "xx", name: "test", price: 10 }];
    const badRule = () => 9999;

    expect(() => calculateTotal(items, [badRule])).toThrow(
      "Total cannot be negative."
    );
  });

  test("handles zero items and zero rules", () => {
    expect(calculateTotal([], [])).toBe(0);
  });

  test("throws error when a pricing rule returns a non number", () => {
    const badRule = () => "100" as any;
    const co = new Checkout([badRule]);

    co.scan(PRODUCTS.atv);

    expect(() => co.total()).toThrow("Calculation error");
  });
});
