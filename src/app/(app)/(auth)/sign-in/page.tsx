import SignInView from "@/modules/auth/ui/views/SignInView";
import { caller } from "@/trpc/server";
import { redirect } from "next/navigation";

const SigninPage = async () => {
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
