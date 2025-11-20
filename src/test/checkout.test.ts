import { Checkout } from "../services/checkout";
import { PRODUCTS } from "../data/products";
import { bulkDiscount, multiBuyOffer } from "../rules/pricingRules";

describe("Checkout System Tests with and without Rules", () => {
  const rules = [
    multiBuyOffer("atv", 3, 2), // Apple TV: 3 for 2 deal
    bulkDiscount("ipd", 4, 499.99), // Super iPad: bulk discount > 4 items
  ];

  test("Scenario 1: three Apple TVs and one VGA adapter", () => {
    const co = new Checkout(rules);

    co.scan(PRODUCTS.atv);
    co.scan(PRODUCTS.atv);
    co.scan(PRODUCTS.atv);
    co.scan(PRODUCTS.vga);

    expect(co.total()).toBe(PRODUCTS.atv.price * 2 + PRODUCTS.vga.price);
  });

  test("Scenario 2: Mixed Apple TVs and discounted iPads", () => {
    const co = new Checkout(rules);

    co.scan(PRODUCTS.atv);
    co.scan(PRODUCTS.ipd);
    co.scan(PRODUCTS.ipd);
    co.scan(PRODUCTS.atv);
    co.scan(PRODUCTS.ipd);
    co.scan(PRODUCTS.ipd);
    co.scan(PRODUCTS.ipd);

    expect(co.total()).toBe(PRODUCTS.atv.price * 2 + 499.99 * 5);
  });

  test("Calculates total correctly when no pricing rules are applied", () => {
    const co = new Checkout([]);

    co.scan(PRODUCTS.vga);
    co.scan(PRODUCTS.atv);

    expect(co.total()).toBe(PRODUCTS.vga.price + PRODUCTS.atv.price);
  });
});
