import { Product } from "./product";

export type PricingRule = (items: Product[]) => number;
