  import { calculateTotal } from "../core/calculateTotal";
  import { PricingRule } from "../models/pricingRule";
  import { Product } from "../models/product";

  export class Checkout {
    private items: Product[] = [];

    constructor(private rules: PricingRule[]) {}

    scan(item: Product) {
      this.items.push(item);
    }

    total(): number {
      return calculateTotal(this.items, this.rules);
    }
  }
