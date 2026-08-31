import AuthShell from "../../components/common/authShell";
import { ClerkSignIn } from "../../components/common/clerkAuth";

export const metadata = { title: "Sign in · FlashLoom" };

export default function SignInPage() {
  return (
    <AuthShell
      heading="Pick up where you left off"
      sub="Sign in to reach your saved sets and keep studying."
    >
      <ClerkSignIn />
    </AuthShell>
  );
}
