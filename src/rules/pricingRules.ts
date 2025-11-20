import { PricingRule } from "../models/pricingRule";
import { Product } from "../models/product";

const bulkDiscount = (
  sku: string,
  minQty: number,
  discountedPrice: number
): PricingRule => {
  if (
    !sku ||
    typeof minQty !== "number" ||
    minQty <= 0 ||
    typeof discountedPrice !== "number" ||
    discountedPrice < 0
  ) {
    throw new Error("Invalid parameters for bulkDiscount rule.");
  }

  return (items: Product[]) => {
    const matchedItems = items.filter(item => item.sku === sku);
    if (matchedItems.length === 0) return 0;

    const [item] = matchedItems;

    if (item.price == null || typeof item.price !== "number") {
      throw new Error("Invalid product price.");
    }

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
  if (
    !sku ||
    typeof requiredQty !== "number" ||
    requiredQty <= 0 ||
    typeof payForQty !== "number" ||
    payForQty < 0 ||
    payForQty > requiredQty
  ) {
    throw new Error("Invalid parameters for multiBuyOffer rule.");
  }

  return (items: Product[]): number => {
    const matchedItems = items.filter(item => item.sku === sku);
    if (matchedItems.length === 0) return 0;

    const [item] = matchedItems;
    if (item.price == null || typeof item.price !== "number") {
      throw new Error("Invalid product price.");
    }

    const totalQty = matchedItems.length;
    const offerGroups = Math.floor(totalQty / requiredQty);

    const freeItems = offerGroups * (requiredQty - payForQty);

    return freeItems * item.price;
  }
};

export { bulkDiscount, multiBuyOffer };
