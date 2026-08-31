import AuthShell from "../../components/common/authShell";
import { ClerkSignUp } from "../../components/common/clerkAuth";

export const metadata = { title: "Sign up · FlashLoom" };

export default function SignUpPage() {
  return (
    <AuthShell
      heading="Three free generations, no card"
      sub="Create an account and turn your first document into a flashcard set."
    >
      <ClerkSignUp />
    </AuthShell>
  );
}
