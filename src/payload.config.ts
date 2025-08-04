// storage-adapter-import-placeholder
import { multiTenantPlugin } from "@payloadcms/plugin-multi-tenant";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { payloadCloudPlugin } from "@payloadcms/payload-cloud";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "path";
import { buildConfig, Config } from "payload";
import { fileURLToPath } from "url";
import sharp from "sharp";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Categories } from "./collections/Categories";
import { Products } from "./collections/Products";
import { Tag } from "./collections/Tag";
import { Tenants } from "./collections/Tenants";
import { Orders } from "./collections/Orders";
import { Reviews } from "./collections/Reviews";
import { isSuperAdmin } from "./lib/access";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    // possible actions: beforeDashboard, afterDashboard, beforeLogin, afterLogin, beforeNavLinks, etc...
    // see https://payloadcms.com/docs/custom-components/root-components
    // you may have to run:
    // bun run generate:importmap
    components: {
      beforeNavLinks: ["@/components/ui/stripe/StripeVerify"],
    },
  },
  // the cookiePrefix can be accessed like so: ctx.db.config.cookiePrefix
  // https://github.com/payloadcms/payload/blob/84cb2b5819d5be44d6f54c37603ce9cedc55924b/packages/payload/src/auth/extractJWT.ts#L23
  cookiePrefix: "broadly",
  collections: [Users, Media, Categories, Products, Tag, Tenants, Orders, Reviews],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || "",
    connectOptions: {
      retryWrites: true,
    },
    transactionOptions: {
      retryWrites: true,
    },
  }),

  sharp,
  plugins: [
    payloadCloudPlugin(),
    multiTenantPlugin<Config>({
      collections: {
        // each product will be tied to the tenant
        products: {},
      },
      tenantsArrayField: {
        includeDefaultField: false,
      },
      // determines super admin user
      userHasAccessToAllTenants: (user) => isSuperAdmin(user),
    }),
    vercelBlobStorage({
      enabled: true,
      token: process.env.BLOB_READ_WRITE_TOKEN,
      collections: {
        media: true,
      },
    }),
  ],
});
