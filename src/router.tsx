import { createRouter } from '@tanstack/react-router';

// Import the generated route tree
import { routeTree } from './routeTree.gen';

// Create a new router instance
export const getRouter = () => {
  const router = createRouter({
    routeTree,
    context: {},
    defaultErrorComponent: ({ error }) => (
      <div className="absolute p-4 -translate-x-1/2 -translate-y-1/2 border-2 top-1/2 left-1/2 border-danger card">
        <h3 className="mb-2 text-center text-nowrap">
          Oops! There&apos;s a Problem!
        </h3>
        <p className="text-center secondary">{error.message}</p>
      </div>
    ),
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  return router;
};
