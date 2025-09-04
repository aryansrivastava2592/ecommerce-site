import ProductCarousel from '@/components/ProductCarousel'
import ProductItem from '@/components/ProductItem'
import dbConnect from '@/lib/dbConnect'
import Product from '@/models/Product'

export const revalidate = 0

const getLatestProducts = async () => {
  await dbConnect()
  // The .limit(20) has been removed to fetch all products
  const products = await Product.find({}).sort({ createdAt: -1 }).lean()
  return products
}

export default async function HomePage() {
  const allProducts = await getLatestProducts()
  
  const latestProducts = JSON.parse(JSON.stringify(allProducts));

  // The carousel will show the first 5 products, the grid will show the rest
  const gridProducts = latestProducts.slice(5)

  return (
    <div>
      <ProductCarousel products={latestProducts} />

      <h1 className="text-2xl font-bold py-2">Latest Products</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {gridProducts.map((product) => (
          <ProductItem key={product.slug} product={product} />
        ))}
      </div>
    </div>
  )
}
