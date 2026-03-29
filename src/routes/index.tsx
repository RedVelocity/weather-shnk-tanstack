import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  server: {
    handlers: {
      GET: ({ request }) => {
        const { city, region, country } = request.cf!;
        if (city && region && country)
          throw redirect({ href: `/${city},${region},${country}` });
        throw redirect({ href: '/Scranton,Pennsylvania,US' });
      },
    },
  },
});
