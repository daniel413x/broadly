/*

when generating static build pages during the Next.js build process, the following ambiguous error can occur:

Error occurred prerendering page "/library". Read more: https://nextjs.org/docs/messages/prerender-error
Error: redacted
    at /app/.next/server/chunks/6661.js:1:17303
Export encountered an error on /(app)/(library)/library/page: /library, exiting the build.
 ⨯ Next.js build worker exited with code: 1 and signal: null
error: script "build" exited with code 1

this happens because the build time does not have the proper context in the form of a session

thus, the solution is to force dynamic rendering for this page

it is worth looking into making a static build possible by changing the procedures chain (init.ts and the procedures.ts files) to return non-error objects

*/
export const dynamic = "force-dynamic";

import { DEFAULT_LIMIT } from "@/lib/data/constants";
import LibraryView from "@/modules/library/ui/views/LibraryView";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

const LibraryPage = async () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchInfiniteQuery(trpc.library.getMany.infiniteQueryOptions({
    limit: DEFAULT_LIMIT,
  }));
  return (
    <main>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <LibraryView />
      </HydrationBoundary>
    </main>
  );
};

export default LibraryPage;
