import { useTranslations } from "next-intl";
import { getLocale } from "next-intl/server";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mic, Trophy, Calendar, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default async function LandingPage() {
  const locale = await getLocale();
  return (
    <div className="min-h-screen bg-white">
      <Navbar profile={null} />
      <LandingContent locale={locale} />
    </div>
  );
}

const creatorTypes = [
  { icon: Mic, title: "Podcast", desc: "Podcast creators can promote brands in episodes." },
  { icon: Trophy, title: "Athletes", desc: "Athletes collaborate with sponsors." },
  { icon: Calendar, title: "Events", desc: "Event organizers partner with brands." },
];

function LandingContent({ locale }: { locale: string }) {
  const t = useTranslations("landing");
  const tCommon = useTranslations("common");

  return (
    <>
      {/* HERO */}
      <section className="bg-slate-950 text-white py-32">
        <div className="max-w-6xl mx-auto px-6">
          <Badge className="mb-6">Azerbaijan · Russia</Badge>
          <h1 className="text-5xl font-bold mb-6">{t("hero.title")}</h1>
          <p className="text-xl text-slate-300 mb-10 max-w-xl">{t("hero.subtitle")}</p>
          <div className="flex gap-4">
            <Link
              href={`/${locale}/register?role=sponsor`}
              className={cn(buttonVariants({ size: "lg" }), "bg-white text-black hover:bg-slate-200")}
            >
              {t("hero.ctaSponsor")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href={`/${locale}/register?role=creator`}
              className={cn(buttonVariants({ size: "lg", variant: "outline" }), "border-white text-white")}
            >
              {t("hero.ctaCreator")}
            </Link>
          </div>
        </div>
      </section>

      {/* CREATOR TYPES */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-16 text-center">{t("creatorTypes.title")}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {creatorTypes.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white p-8 rounded-xl border border-slate-200">
                <div className="w-14 h-14 flex items-center justify-center rounded-lg bg-blue-100 text-blue-600 mb-6">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{title}</h3>
                <p className="text-slate-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-slate-950 text-white">
        <div className="max-w-3xl mx-auto text-center px-6">
          <h2 className="text-3xl font-bold mb-6">{tCommon("tagline")}</h2>
          <div className="flex gap-4 justify-center">
            <Link
              href={`/${locale}/browse`}
              className={cn(buttonVariants({ size: "lg" }), "bg-white text-black hover:bg-slate-200")}
            >
              Kreatorları kəşf et
            </Link>
            <Link
              href={`/${locale}/register`}
              className={cn(buttonVariants({ size: "lg", variant: "outline" }), "border-white text-white")}
            >
              {tCommon("signUp")}
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t py-8 text-center text-sm text-slate-500">
        © 2025 Antism
      </footer>
    </>
  );
}
