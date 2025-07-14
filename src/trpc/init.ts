import { initTRPC, TRPCError } from "@trpc/server";
import payloadConfig from "@payload-config";
import { getPayload } from "payload";
import { cache } from "react";
import superjson from "superjson";
import { headers as getHeaders } from "next/headers";

export const createTRPCContext = cache(async () => {
  /**
   * @see: https://trpc.io/docs/server/context
   */
  return { userId: "user_123" };
});
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  transformer: superjson,
});
// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure.use(async ({ next }) => {
  const payload = await getPayload({
    config: payloadConfig,
  });
  return next({ ctx: { db: payload } });
});
// authenticate requests
// not added by default
export const protectedProcedure = baseProcedure.use(async ({ ctx, next }) => {
  const headers = await getHeaders();
  const session = await ctx.db.auth({ headers });
  if (!session.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Not authenticated",
    });
  }
  return next({
    // by virtue of TRPC and its type inference, verbosely defining queries' returned objects offers better type safety
    // in this case, we included an auth check branch to ensure the user object is defined, and we explicitly defined the user in the returned object
    ctx: {
      ...ctx,
      session: {
        ...session,
        user: session.user,
      },
    },
  });
});
