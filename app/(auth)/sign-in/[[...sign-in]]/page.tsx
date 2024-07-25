import { SignUp } from "@clerk/nextjs";

const SignUpPage = () => {
  return (
    <main className="auth-page">
      {/* Renders the Clerk SignUp component */}
      <SignUp />
    </main>
  );
};

export default SignUpPage;
