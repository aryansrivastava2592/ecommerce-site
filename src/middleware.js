import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  // This function runs if the user is authenticated
  function middleware(req) {
    // If the user is trying to access admin routes
    if (
      req.nextUrl.pathname.startsWith('/admin') &&
      !req.nextauth.token?.user?.isAdmin
    ) {
      // Redirect non-admins away from admin pages
      return NextResponse.rewrite(new URL('/api/auth/error?error=Unauthorized', req.url))
    }
  },
  {
    callbacks: {
      // This callback determines if the user is authorized to even run the middleware
      authorized: ({ token }) => !!token, // User must be logged in for any matched route
    },
  }
)

export const config = {
  // This matcher applies the middleware to all the specified routes
  matcher: [
    '/shipping',
    '/payment',
    '/place-order',
    '/profile',
    '/profile/edit',
    '/wishlist',
    '/orders',
    '/my-addresses',
    '/my-addresses/add',
    '/admin/:path*', // Protects all admin routes
  ],
}
