export { default } from "next-auth/middleware"

export const config = { 
  matcher: [
    /*
     * Match all request paths except for:
     * - api/trpc routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api/socket|_next/static|_next/image|favicon.ico).*)',
  ],
}