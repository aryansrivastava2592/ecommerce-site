import ProductItem from "@/components/ProductItem";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";

export const revalidate = 0;

const getProductsByQuery = async (query) => {
  await dbConnect();
  const products = await Product.find({
    name: { $regex: query, $options: "i" },
  }).lean();
  return products;
};

export default async function SearchPage({ searchParams }) {
  const query = searchParams.q || "";
  const products = await getProductsByQuery(query);

  return (
    <div>
      <h1 className="text-2xl font-bold py-2">Search Results</h1>
      <p className="py-2">
        {products.length === 0 ? "No" : products.length} results
        {query && query !== "" && ' for "' + query + '"'}
      </p>

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
