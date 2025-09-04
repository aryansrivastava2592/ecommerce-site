import dbConnect from '@/lib/dbConnect'
import Product from '@/models/Product'
import Link from 'next/link'

const getCategories = async () => {
  await dbConnect()
  const categories = await Product.find().distinct('category')
  return categories
}

export default async function CategoryNav() {
  const categories = await getCategories()
  return (
    <div className="bg-white dark:bg-gray-800 shadow-md">
      {/* We removed 'container mx-auto' and adjusted spacing/padding */}
      <div className="w-full px-4 py-2 flex justify-center space-x-4 overflow-x-auto hide-scrollbar">
        {categories.map((category) => (
          <Link
            key={category}
            href={`/category/${category}`}
            className="text-gray-700 dark:text-gray-200 hover:text-amber-500 whitespace-nowrap"
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Link>
        ))}
      </div>
    </div>
  )
}
