import ProductItem from "@/components/ProductItem";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";

export const revalidate = 0;

const getProductsByCategory = async (categoryName) => {
  await dbConnect();
  const decodedCategory = decodeURIComponent(categoryName);
  const products = await Product.find({ category: decodedCategory }).lean();
  return products;
};

export default async function CategoryPage({ params: { name } }) {
  const products = await getProductsByCategory(name);
  const categoryName = decodeURIComponent(name);

  return (
    <div>
      <h1 className="text-2xl font-bold py-2">Category: {categoryName}</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductItem
            key={product.slug}
            product={JSON.parse(JSON.stringify(product))}
          />
        ))}
      </div>
    </div>
  );
}
