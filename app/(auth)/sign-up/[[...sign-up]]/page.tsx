import { SignUp } from "@clerk/nextjs";
import React from "react";

const SignUpPage = () => {
  return (
    <main className="auth-page">
      {/* Render the SignUp component from Clerk to handle user registration */}
      <SignUp />
    </main>
  );
};

export default SignUpPage;
