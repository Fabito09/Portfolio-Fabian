"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/i18n/language-provider";
import { uiText } from "@/content/ui-text";

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <section className="flex min-h-svh flex-col items-center justify-center px-5 text-center sm:px-8">
      <p className="font-mono text-6xl font-bold text-white/20">404</p>
      <h1 className="mt-6 text-2xl font-bold text-white sm:text-3xl">
        {t(uiText.notFound.title)}
      </h1>
      <p className="mt-3 max-w-md text-sm text-white/60">
        {t(uiText.notFound.subtitle)}
      </p>
      <Link
        href="/"
        className="group mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-neutral-950 transition-all hover:-translate-y-0.5 hover:bg-white/90"
      >
        {t(uiText.notFound.backHome)}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </section>
  );
}
