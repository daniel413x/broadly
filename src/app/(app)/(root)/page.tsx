"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

function Home() {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.auth.session.queryOptions());
  return (
    <main className="flex flex-col gap-y-4 p-6">
      <h1>
        Home page
      </h1>
      <div>
        {JSON.stringify(data?.user, null, 2)}
      </div>
    </main>
  );
}

export default Home;
