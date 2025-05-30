import configPromise from "@payload-config";
import { getPayload } from "payload";

async function Home() {
  const payload = await getPayload({
    config: configPromise,
  });
  const data = await payload.find({
    collection: "categories",
  });
  return (
    <main className="flex flex-col gap-y-4 p-6">
      <h1>
        Payload data
      </h1>
      {JSON.stringify(data, null, 2)}
    </main>
  );
}

export default Home;
