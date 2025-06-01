"use client";

import MaxWidthWrapper from "@/components/shared/MaxWidthWrapper";
import { Badge } from "@/components/ui/badge";
import { Zap } from "lucide-react";
import ServicesCardsWithFilters from "./ServicesCardaWithFilters";
import { ScaleIn, FadeIn, SlideIn } from "@/components/ui/layout-animations";
import AnimateInView from "@/components/ui/animate-in-view";
import dynamic from "next/dynamic";
import { Session } from "next-auth";
import { useLocale } from "next-intl";

// Dynamically import the client components with no SSR
const AnimatedButton = dynamic(() => import("./AnimatedButton"), {
  ssr: false,
});

const ParallaxBackground = dynamic(() => import("./ParallaxBackground"), {
  ssr: false,
});

interface HomeClientProps {
  session: Session | null;
  translations: {
    welcome: string;
    heroTitle: string;
    heroDescription: string;
    cta1: string;
    cta2: string;
    secondaryCta: string;
    servicesTitle: string;
    servicesDescription: string;
  };
}

export default function HomeClient({ session, translations }: HomeClientProps) {
  const {
    welcome,
    heroTitle,
    heroDescription,
    cta1,
    cta2,
    secondaryCta,
    servicesTitle,
    servicesDescription,
  } = translations;
  const locale = useLocale();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <div className="relative bg-linear-to-br from-background via-background to-primary/5 p-3 overflow-hidden">
        <MaxWidthWrapper className="pt-20 md:pt-28 pb-16 md:pb-24">
          <div className="z-10 relative flex flex-col justify-center items-center mx-auto max-w-3xl text-center">
            <ScaleIn delay={0.1}>
              <Badge
                variant="secondary"
                className="bg-background/80 backdrop-blur-sm mb-6 px-4 py-2 border-primary/20 text-xs rounded-full"
              >
                <Zap className="mr-1 w-3.5 h-3.5 text-primary" />
                <span>{welcome}</span>
              </Badge>
            </ScaleIn>

            <SlideIn direction="up" delay={0.2}>
              <h1 className="mb-6 font-bold text-4xl md:text-6xl tracking-tight">
                <span className="bg-clip-text bg-linear-to-r from-primary to-primary/80 text-transparent">
                  {heroTitle || "Supercharge Your Digital Media Presence"}
                </span>
              </h1>
            </SlideIn>

            <FadeIn delay={0.4}>
              <p className="mb-8 max-w-2xl text-muted-foreground text-lg md:text-xl">
                {heroDescription ||
                  "Access all digital media services through our unified platform with streamlined processes and instant approvals"}
              </p>
            </FadeIn>

            <SlideIn direction="up" delay={0.6} className="w-full sm:w-auto">
              <div className="flex sm:flex-row flex-col justify-center gap-4 w-full">
                {session?.user ? (
                  <AnimatedButton
                    href={`/${locale}/dashboard`}
                    variant="primary"
                    className="px-8 h-11 text-base"
                  >
                    {cta2 || "Dashboard"}
                  </AnimatedButton>
                ) : (
                  <AnimatedButton
                    href={`/${locale}/auth/login`}
                    variant="primary"
                    className="px-8 h-11 text-base"
                  >
                    {cta1 || "Login Now"}
                  </AnimatedButton>
                )}

                <AnimatedButton
                  href="#services"
                  variant="outline"
                  className="px-8 h-11 text-base"
                >
                  {secondaryCta || "Explore Services"}
                </AnimatedButton>
              </div>
            </SlideIn>
          </div>

          {/* Use ParallaxBackground component */}
          <ParallaxBackground animationSpeed={2} />
        </MaxWidthWrapper>
      </div>

      {/* Services Section */}
      <div id="services" className="bg-muted/30 px-3 py-16">
        <MaxWidthWrapper className="mx-auto max-w-(--breakpoint-xl)">
          <AnimateInView direction="up" delay={0.1}>
            <div className="flex flex-col mb-12 ltr:text-left rtl:text-right">
              <h2 className="mb-4 font-bold text-3xl md:text-4xl tracking-tight">
                {servicesTitle || "Our Services"}
              </h2>
              <p className="max-w-2xl text-muted-foreground text-lg">
                {servicesDescription ||
                  "Browse through our comprehensive collection of digital media services"}
              </p>
            </div>
          </AnimateInView>
          <AnimateInView direction="up" delay={0.2}>
            <ServicesCardsWithFilters />
          </AnimateInView>
        </MaxWidthWrapper>
      </div>

      {/* Animation keyframes still needed for the ParallaxBackground */}
      <style jsx global>{`
        @keyframes floatBlob {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(20px, -15px) scale(1.1);
          }
          50% {
            transform: translate(-5px, 20px) scale(0.95);
          }
          75% {
            transform: translate(-15px, -10px) scale(1.05);
          }
        }

        @keyframes floatBlobReverse {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(-20px, 15px) scale(0.9);
          }
          50% {
            transform: translate(10px, -20px) scale(1.1);
          }
          75% {
            transform: translate(15px, 10px) scale(0.95);
          }
        }

        @keyframes pulseBlob {
          0%,
          100% {
            opacity: 0.6;
            filter: blur(70px);
          }
          50% {
            opacity: 0.8;
            filter: blur(60px);
          }
        }

        @keyframes fadeInOut {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.7;
          }
        }
      `}</style>
    </div>
  );
}
