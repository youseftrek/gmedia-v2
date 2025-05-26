import { buttonVariants } from "@/components/ui/button";
import Ripple from "@/components/ui/ripple";
import { WordRotate } from "@/components/ui/word-rotate";
import { PROTECTED_ROUTES } from "@/constants";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import Image from "next/image";

const Hero = () => {
  const t = useTranslations("HomePage");
  return (
    <div className="relative flex flex-col justify-center items-center mt-[75px] w-full min-h-[calc(100vh-75px)] overflow-hidden">
      <Ripple />
      <h3 className="rtl:mb-5 text-lg">{t("slogan")}</h3>
      <h2 className="z-10 mb-4 rtl:mb-6 font-medium text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-center rtl:leading-tight tracking-tighter whitespace-pre-wrap">
        <WordRotate
          className="font-bold text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-center rtl:leading-tight tracking-wide"
          words={[t("build"), t("launch"), t("grow")]}
        />
        {t("heading")}
        <span> {t("motager")}</span>
      </h2>
      <p className="mb-4 px-3 max-w-3xl text-muted-foreground text-center">
        {t("description")}
      </p>
      <div className="flex items-center gap-2">
        <Link
          href={PROTECTED_ROUTES.DASHBOARD}
          className={cn(buttonVariants({ size: "lg" }), "")}
        >
          {t("cta1")}
        </Link>
        <Link
          href="#"
          className={cn(
            buttonVariants({ variant: "secondary", size: "lg" }),
            ""
          )}
        >
          {t("cta2")}
        </Link>
      </div>
      <div className="items-center gap-2 grid grid-cols-2 lg:grid-cols-4 mt-10 p-4">
        <Image
          className="bg-background opacity-100 border border-primary rounded-md rounded-ss-[200px]"
          src="/images/heroWomen.jpg"
          height={300}
          width={300}
          alt="Group"
        />
        <Image
          className="bg-background opacity-100 border border-primary rounded-md rounded-se-[50px] lg:rounded-se-md"
          src="/images/men2.jpg"
          height={300}
          width={300}
          alt="Group"
        />
        <Image
          className="bg-background opacity-100 border border-primary rounded-md rounded-es-[50px] lg:rounded-es-md"
          src="/images/women2.jpg"
          height={300}
          width={300}
          alt="Group"
        />
        <Image
          className="bg-background opacity-100 border border-primary rounded-md rounded-ee-[200px] lg:rounded-ee-[200px]"
          src="/images/heroMen.jpg"
          height={300}
          width={300}
          alt="Group"
        />
      </div>
    </div>
  );
};

export default Hero;
