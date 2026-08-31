"use client";

import { useEffect, useState } from "react";
import { SignIn, SignUp } from "@clerk/nextjs";
import { getResolvedTheme, subscribeTheme } from "@/utils/theme";

const SHARED = {
  fontFamily: "var(--font-sora)",
  borderRadius: "8px",
};

const LIGHT = {
  ...SHARED,
  colorPrimary: "#0b6f96",
  colorText: "#10141a",
  colorTextSecondary: "#5c6873",
  colorTextOnPrimaryBackground: "#ffffff",
  colorBackground: "#ffffff",
  colorInputBackground: "#f7f9fa",
  colorInputText: "#10141a",
  colorNeutral: "#10141a",
  colorDanger: "#aa3333",
};

const DARK = {
  ...SHARED,
  colorPrimary: "#0d95c9",
  colorText: "#e8ecef",
  colorTextSecondary: "#8b959c",
  colorTextOnPrimaryBackground: "#04222e",
  colorBackground: "#14171a",
  colorInputBackground: "#101316",
  colorInputText: "#e8ecef",
  colorNeutral: "#e8ecef",
  colorDanger: "#e58b8b",
};

const ELEMENTS = {
  rootBox: "w-full",
  cardBox: "w-full overflow-hidden rounded-xl !border !border-hairline !bg-surface !shadow-none",
  card: "!bg-transparent !shadow-none !border-0 gap-6",
  header: "gap-1",
  headerTitle: "text-[20px] font-semibold tracking-[-0.02em] text-ink",
  headerSubtitle: "text-[13.5px] text-ink-muted",
  main: "!bg-transparent gap-4",
  socialButtonsBlockButton:
    "!border !border-hairline-strong !bg-transparent text-ink hover:!bg-surface-sunken rounded-md !shadow-none",
  socialButtonsBlockButtonText: "font-medium text-[13.5px]",
  dividerRow: "!my-1",
  dividerLine: "!bg-rule",
  dividerText: "text-ink-faint text-[11px] uppercase tracking-[0.08em] font-mono",
  formFieldLabel: "text-ink-muted text-[11.5px] uppercase tracking-[0.09em] font-mono",
  formFieldInput:
    "!bg-surface-sunken !border !border-hairline text-ink rounded-md focus:!border-accent",
  formButtonPrimary:
    "!bg-accent !text-accent-ink hover:!brightness-[1.08] !shadow-none rounded normal-case text-[14px] font-semibold",
  footer: "!bg-transparent !border-t !border-rule !bg-none",
  footerAction: "!bg-transparent",
  footerActionText: "text-ink-muted text-[13px]",
  footerActionLink: "!text-accent hover:!text-accent font-medium",
  identityPreviewText: "text-ink",
  identityPreviewEditButton: "!text-accent",
  formResendCodeLink: "!text-accent",
  formFieldAction: "!text-accent",
  formFieldInputShowPasswordButton: "text-ink-faint hover:text-ink",
  otpCodeFieldInput: "!border-hairline text-ink",
  spinner: "!text-accent",
  formFieldErrorText: "!text-danger",
  formFieldSuccessText: "text-ink-muted",
  alert: "!border !border-danger-border !bg-danger-bg !text-danger rounded",
};

function useClerkAppearance() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    setTheme(getResolvedTheme());
    return subscribeTheme(setTheme);
  }, []);

  return { variables: theme === "dark" ? DARK : LIGHT, elements: ELEMENTS };
}

export function ClerkSignIn() {
  return <SignIn appearance={useClerkAppearance()} />;
}

export function ClerkSignUp() {
  return <SignUp appearance={useClerkAppearance()} />;
}
