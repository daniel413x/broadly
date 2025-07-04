// solve:
// Error occurred prerendering page "/sign-in". Read more: https://nextjs.org/docs/messages/prerender-error
// Error: Dynamic server usage: Route /sign-in couldn't be rendered statically because it used `headers`. See more info here: https://nextjs.org/docs/messages/dynamic-server-error
export const dynamic = "force-dynamic";

import SignInView from "@/modules/auth/ui/views/SignInView";
import { caller } from "@/trpc/server";
import { redirect } from "next/navigation";

const SigninPage = async() => {
  const session = await caller.auth.session();
  if (session.user) {
    redirect("/");
  }
  return (
    <main>
      <SignInView />
    </main>
  );
};

export default SigninPage;
