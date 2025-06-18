import SignUpView from "@/modules/auth/ui/views/SignUpView";
import { caller } from "@/trpc/server";
import { redirect } from "next/navigation";

const SignupPage = async () => {
  const session = await caller.auth.session();
  if (session.user) {
    redirect("/");
  }
  return (
    <main>
      <SignUpView />
    </main>
  );
};

export default SignupPage;
