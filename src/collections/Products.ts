import { isSuperAdmin } from "@/lib/access";
import { Tenant } from "@/payload-types";
import { lexicalEditor, UploadFeature } from "@payloadcms/richtext-lexical";
import type { CollectionConfig, PayloadRequest } from "payload";

const createUpdateAccessPermissions = ({ req }: { req: PayloadRequest }) => {
  if (isSuperAdmin(req.user)) {
    return true;
  }
  // default depth 2
  const tenant = req.user?.tenants?.[0]?.tenant as Tenant;
  // restrict tenants from creating products unless they have submitted stripe details
  return Boolean(tenant?.stripeDetailsSubmitted);
};

export const Products: CollectionConfig = {
  slug: "products",
  access: {
    read: () => true,
    create: createUpdateAccessPermissions,
    update: createUpdateAccessPermissions,
    delete: ({ req }) => isSuperAdmin(req.user),
  },
  admin: {
    useAsTitle: "name",
    description: "You must verify your account before creating products",
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "description",
      type: "richText",
    },
    {
      name: "price",
      type: "number",
      required: true,
      admin: {
        description: "USD",
      },
    },
    {
      name: "category",
      type: "relationship",
      relationTo: "categories",
      hasMany: false,
    },
    {
      name: "tags",
      type: "relationship",
      relationTo: "tags",
      hasMany: true,
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
    },
    // TODO? consider adding a cover image field so that you have separate fields for product card thumbnails and product page header covers
    // {
    //   name: "cover",
    //   type: "upload",
    //   relationTo: "media",
    // },
    {
      name: "refundPolicy",
      type: "select",
      options: ["30-day", "14-day", "7-day", "3-day", "1-day", "no-refunds"],
      defaultValue: "30-day",
    },
    {
      name: "content",
      type: "richText",
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          UploadFeature({
            collections: {
              media: {
                fields: [
                  {
                    name: "name",
                    type: "text",
                  },
                ],
              },
            },
          }),
        ],
      }),
      admin: {
        description: "Protected content only visible to costumers after purchase. Add product documentation, downloadable files, getting started guides, and bonus materials. Supports Markdown formatting.",
      },
    },
    {
      name: "isArchived",
      label: "Archive",
      defaultValue: false,
      type: "checkbox",
      admin: {
        description: "If checked, this product will be archived",
      },
    },
    {
      name: "isPrivate",
      label: "isPrivate",
      defaultValue: false,
      type: "checkbox",
      admin: {
        description: "If checked, this product will not be shown in the public storefront",
      },
    },
  ],
};
