import { withAuth } from 'next-auth/middleware';

export default withAuth({
  callbacks: {
    authorized: ({ token }) => {
      // Only allow admins to access /admin routes
      return token?.role === 'ADMIN';
    },
  },
});

export const config = {
  matcher: ['/admin/:path*'],
};
