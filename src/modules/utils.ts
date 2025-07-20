import { Product, Review } from "@/payload-types";
import { BasePayload, PaginatedDocs } from "payload";

// in-memory computation utility for generating products with review data
// avoids N+1 query pattern which becomes more and more problematic as the busiess's products count increases
export const generateProductsWithSummarizedReviews = async (db: BasePayload, productsData: PaginatedDocs<Product>) => {
  const productIds = productsData.docs.map((product) => product.id);
  // reviews but ungrouped
  // length cannot yet be used to calculate reviewRating
  const reviewsData = await db.find({
    collection: "reviews",
    pagination: false,
    depth: 0,
    where: {
      product: {
        in: productIds,
      },
    },
  });
  const reviewsByProductId = reviewsData.docs.reduce((acc: Record<string, Review[]>, review) => {
    const productId = review.product as string;
    if (!acc[productId]) {
      // eslint-disable-next-line no-param-reassign
      acc[productId] = [];
    }
    acc[productId].push(review);
    return acc;
  }, {});
  const dataWithSummarizedReviews = productsData.docs.map((doc) => {
    // reviews grouped for the operative doc
    // this array can be used to calculate reviewRating
    const productReviews = reviewsByProductId[doc.id] || [];
    const reviewCount = productReviews.length;
    const reviewRating =generateReviewRating(productReviews);
    return {
      ...doc,
      reviewCount,
      reviewRating,
    };
  });
  return dataWithSummarizedReviews;
};

export const generateReviewRating = (reviews: Review[]) => {
  // return ratings as
  // 5.0
  // 3.3
  // etc.
  const reviewRating = (reviews.length > 0 ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length : 0).toFixed(1);
  return reviewRating;
};
