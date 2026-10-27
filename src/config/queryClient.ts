import { QueryClient } from "@tanstack/react-query";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import type { PersistedClient } from "@tanstack/react-query-persist-client";

import superjson from "superjson";

export const QUERY_STALE_TIME = 10 * 60 * 1000;

export const QUERY_CACHE_MAX_AGE = 10 * 60 * 1000;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: QUERY_STALE_TIME,
      gcTime: 30 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export const queryPersister = createAsyncStoragePersister({
  storage: window.localStorage,
  key: "workout-app-query-cache",
  throttleTime: 1000,

  serialize: (client) => {
    return superjson.stringify(client);
  },

  deserialize: (cachedClient) => {
    return superjson.parse<PersistedClient>(cachedClient);
  },
});
