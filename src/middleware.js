export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/shipping",
    "/payment",
    "/place-order",
    "/profile",
    "/wishlist",
    "/orders",
    "/my-addresses", // <-- ADD THIS
    "/my-addresses/add", // <-- AND THIS
  ],
};
