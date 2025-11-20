import { PricingRule } from "../models/pricingRule";
import { Product } from "../models/product";

const bulkDiscount = (
  sku: string,
  minQty: number,
  discountedPrice: number
): PricingRule => {
  return (items: Product[]) => {
    const matchedItems = items.filter(item => item.sku === sku);
    if (matchedItems.length === 0) return 0;

    const [item] = matchedItems;

    const count = matchedItems.length;
    if (count <= minQty) return 0;

    const discountPerItem = Math.max(0, item.price - discountedPrice);

    return discountPerItem * count;
  };
};

const multiBuyOffer = (
  sku: string,
  requiredQty: number,
  payForQty: number
): PricingRule => {
  return (items: Product[]): number => {
    const matchedItems = items.filter(item => item.sku === sku);
    if (matchedItems.length === 0) return 0;

    const [item] = matchedItems;

    const totalQty = matchedItems.length;
    const offerGroups = Math.floor(totalQty / requiredQty);

    const freeItems = offerGroups * (requiredQty - payForQty);

    return freeItems * item.price;
  }
};

export { bulkDiscount, multiBuyOffer };
