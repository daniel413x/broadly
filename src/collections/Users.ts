import type { CollectionConfig } from "payload";
import { tenantsArrayField } from "@payloadcms/plugin-multi-tenant/fields";
import { isSuperAdmin } from "@/lib/access";

const defaultTenantArrayField = tenantsArrayField({
  tenantsArrayFieldName: "tenants",
  tenantsCollectionSlug: "tenants",
  tenantsArrayTenantFieldName: "tenant",
  // define api access permissions
  arrayFieldAccess: {
    read: () => true,
    // control api access at /admin/collections/users
    create: ({ req }) => isSuperAdmin(req.user),
    // control api access at /admin/collections/users/[id]
    update: ({ req }) => isSuperAdmin(req.user),
  },
  tenantFieldAccess: {
    read: () => true,
    create: ({ req }) => isSuperAdmin(req.user),
    update: ({ req }) => isSuperAdmin(req.user),
  },
});

// in src/lib/data/seeder/seed.ts
// a super admin is created
export const Users: CollectionConfig = {
  slug: "users",
  access: {
    read: () => true,
    create: ({ req }) => isSuperAdmin(req.user),
    // req must originate from the super admin or the principal owner of the user object
    update: ({ req, id }) => {
      if (isSuperAdmin(req.user)) {
        return true;
      }
      return req.user?.id === id;
    },
    delete: ({ req }) => isSuperAdmin(req.user),
  },
  admin: {
    useAsTitle: "email",
    // hide users link from admin dashboard if not super admin
    hidden: ({ user }) => !isSuperAdmin(user),
  },
  auth: true,
  fields: [
    // Email added by default
    {
      name: "username",
      required: true,
      unique: true,
      type: "text",
    },
    {
      admin: {
        position: "sidebar",
      },
      name: "roles",
      type: "select",
      defaultValue: ["user"],
      hasMany: true,
      options: ["super-admin", "user"],
      access: {
        // restrict users from changing their own role in /admin/account
        update: ({ req }) => isSuperAdmin(req.user),
      },
    },
    {
      ...defaultTenantArrayField,
      admin: {
        ...(defaultTenantArrayField?.admin || {}),
        position: "sidebar",
      },
    },
  ],
};
