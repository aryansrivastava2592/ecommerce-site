import AddToCart from "@/components/AddToCart";
import ProductItem from "@/components/ProductItem";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
import Link from "next/link";
import { notFound } from "next/navigation";
import WishlistButton from "@/components/WishlistButton"; // 1. IMPORT

export const revalidate = 0;

const getProduct = async (slug) => {
  await dbConnect();
  const product = await Product.findOne({ slug }).lean();
  if (!product) {
    return null;
  }
  const relatedProducts = await Product.find({
    category: product.category,
    slug: { $ne: product.slug },
  })
    .limit(4)
    .lean();

  return { product, relatedProducts };
};

export default async function ProductDetailsPage({ params: { slug } }) {
  const data = await getProduct(slug);

  if (!data || !data.product) {
    return notFound();
  }

  const { product, relatedProducts } = data;

  return (
    <div>
      <div className="my-2">
        <Link href="/">Back to products</Link>
      </div>
      <div className="grid md:grid-cols-4 md:gap-5">
        <div className="md:col-span-2">
          <div className="flex items-center justify-center h-96 w-full">
            <img
              src={product.image}
              alt={product.name}
              className="max-h-full max-w-full object-contain"
            />
          </div>
        </div>
        <div>
          <ul>
            <li>
              {/* 2. ADD WISHLIST BUTTON HERE */}
              <div className="flex justify-between items-start">
                <h1 className="text-xl font-bold">{product.name}</h1>
                <WishlistButton
                  productId={JSON.parse(JSON.stringify(product._id))}
                />
              </div>
            </li>
            <li>
              {product.rating} of {product.numReviews} reviews
            </li>
            <li>Brand: {product.brand}</li>
            <li>
              <div className="divider my-2"></div>
            </li>
            <li>
              Description: <p>{product.description}</p>
            </li>
          </ul>
        </div>
        <div>
          <AddToCart product={JSON.parse(JSON.stringify(product))} />
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Related Products</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {relatedProducts.map((relatedProduct) => (
            <ProductItem
              key={relatedProduct.slug}
              product={JSON.parse(JSON.stringify(relatedProduct))}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
