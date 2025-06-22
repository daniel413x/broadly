import type { CollectionConfig } from "payload";

export const Categories: CollectionConfig = {
  slug: "categories",
  admin: {
    // use this property so that categories in the /admin dashboard dropdowns aren't just shown as their ID's
    useAsTitle: "name",
  },
  access: {
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
    },
    {
      name: "color",
      type: "text",
    },
    {
      name: "parent",
      type: "relationship",
      relationTo: "categories",
      hasMany: false,
    },
    {
      name: "subcategories",
      type: "join",
      collection: "categories",
      on: "parent",
      hasMany: true,
    },
  ],
};
