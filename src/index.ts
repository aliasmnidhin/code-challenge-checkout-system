import { Checkout } from "./services/checkout";
import { bulkDiscount, multiBuyOffer } from "./rules/pricingRules";
import { PRODUCTS } from "./data/products";
import { formatCurrency } from "./utils/currency";

const pricingRules = [
  multiBuyOffer("atv", 3, 2), // Apple TV: 3 for 2 deal
  bulkDiscount("ipd", 4, 499.99), // Brand new Super iPad bulk discount > 4 items
];

const co = new Checkout(pricingRules);

// Case 1: SKUs Scanned: atv, atv, atv, vga. Total expected: $249.00
// co.scan(PRODUCTS.atv);
// co.scan(PRODUCTS.atv);
// co.scan(PRODUCTS.atv);
// co.scan(PRODUCTS.vga);

// Case 2: SKUs Scanned: atv, ipd, ipd, atv, ipd, ipd, ipd. Total expected: $2718.95
co.scan(PRODUCTS.atv);
co.scan(PRODUCTS.ipd);
co.scan(PRODUCTS.ipd);
co.scan(PRODUCTS.atv);
co.scan(PRODUCTS.ipd);
co.scan(PRODUCTS.ipd);
co.scan(PRODUCTS.ipd);

const total = co.total();

console.log("Total:", formatCurrency(total));
