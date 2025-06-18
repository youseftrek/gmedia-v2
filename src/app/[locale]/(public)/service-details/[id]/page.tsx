import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  DollarSign,
  Globe,
  CheckCircle,
  FileText,
  ArrowRight,
  ExternalLink,
  Shield,
  Calendar,
  Target,
  Sparkles,
  Info,
  Download,
  ChevronLeft,
  Phone,
  Mail,
  GamepadIcon,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BackButton } from "@/components/shared/BackButton";
import { getServiceDetails } from "@/data/get-service-details";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { DIRECTIONS } from "@/constants/locale";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";

// Define types for the service data
interface RelatedService {
  id?: string;
  title: string;
  url: string;
}

interface SupportQuestion {
  title: string;
  icon: string;
  url?: string;
  type?: string;
}

interface FAQ {
  question: string;
  answer: string;
}

interface ServiceDetails {
  beneficiaries: string;
  executionTime: string;
  serviceFee: string;
  serviceChannels: string[];
}

interface Service {
  id?: string;
  serviceCategory?: string;
  serviceTitle: string;
  description: string;
  licenseDuration?: string;
  category?: string;
  status?: string;
  priority?: string;
  steps: string[];
  conditions: string[];
  requirements: string[];
  serviceDetails: ServiceDetails;
  relatedServices: RelatedService[];
  targetAudience?: string;
  serviceDuration?: string;
  paymentOptions?: string;
  serviceCost?: string;
  supportQuestions?: SupportQuestion[];
  startServiceLink: string;
  faq?: FAQ[];
  lastUpdated?: string;
  version?: string;
}

const ServiceInfoPage = async ({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) => {
  const { id, locale } = await params;
  const t = await getTranslations("ServiceDetailsPage");
  const direction = DIRECTIONS[locale as keyof typeof DIRECTIONS] as
    | "ltr"
    | "rtl";

  const res = await getServiceDetails(Number(id), locale);
  console.log(res.data.data);

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="max-w-7xl mx-auto p-3 sm:p-6">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <div className="flex items-center gap-2">
            <Image
              src="/images/gmedia/logo-dark.png"
              alt="logo"
              width={100}
              height={100}
              className="w-10 h-10 text-primary-foreground"
            />

            <h1 className="text-lg md:text-xl lg:text-2xl font-bold truncate">
              {locale === "ar"
                ? "الهيئة العامة لتنظيم الإعلام"
                : "General Commission Of Audiovisual Media"}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <BackButton label={locale === "ar" ? "الرجوع" : "Back"} />
          </div>
        </div>

        {/* Main Service Card with Tabs */}
        <div className="flex flex-col md:flex-row ltr:md:flex-row rtl:md:flex-row-reverse gap-4 sm:gap-6">
          {/* Service Information Card - Right in EN, Left in AR */}
          <div className="md:w-1/3 md:order-2 ltr:md:order-2 rtl:md:order-1">
            <Card className="shadow-sm bg-background gap-0">
              <CardHeader className="border-b">
                <CardTitle>
                  {locale === "ar" ? "معلومات الخدمة" : "Service Information"}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {/* Service Category */}
                <div className="border-b p-3 sm:p-4">
                  <div className="flex items-center gap-2">
                    <GamepadIcon className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                    <h3 className="text-sm sm:text-base font-medium">
                      {locale === "ar" ? "فئة الخدمة" : "Service Category"}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground ltr:pl-6 rtl:pr-6">
                    {res.data.data.serviceCategory}
                  </p>
                </div>

                {/* Beneficiaries */}
                <div className="border-b p-3 sm:p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                    <h3 className="text-sm sm:text-base font-medium">
                      {locale === "ar" ? "المستفيدون" : "Beneficiaries"}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground ltr:pl-6 rtl:pr-6">
                    {res.data.data.serviceDetails.beneficiaries}
                  </p>
                </div>

                {/* Execution Time */}
                <div className="border-b p-3 sm:p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                    <h3 className="text-sm sm:text-base font-medium">
                      {locale === "ar" ? "زمن التنفيذ" : "Execution Time"}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground ltr:pl-6 rtl:pr-6">
                    {res.data.data.serviceDetails.executionTime}
                  </p>
                </div>

                {/* Service Fee */}
                <div className="border-b p-3 sm:p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                    <h3 className="text-sm sm:text-base font-medium">
                      {locale === "ar" ? "رسوم الخدمة" : "Service Fee"}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground ltr:pl-6 rtl:pr-6">
                    {res.data.data.serviceDetails.serviceFee}
                  </p>
                </div>

                {/* Service Channels */}
                <div className="p-3 sm:p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                    <h3 className="text-sm sm:text-base font-medium">
                      {locale === "ar" ? "قنوات الخدمة" : "Service Channels"}
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2 ltr:pl-6 rtl:pr-6">
                    {res.data.data.serviceDetails.serviceChannels.map(
                      (channel: string, index: number) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs sm:text-[10px]"
                        >
                          {channel}
                        </Badge>
                      )
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area - Left in EN, Right in AR */}
          <div className="md:w-2/3 md:order-1 ltr:md:order-1 rtl:md:order-2">
            {/* Service Header */}
            <Card className="shadow-sm bg-background mb-4 sm:mb-6 relative">
              <CardContent className="">
                <div className="flex flex-col space-y-3 sm:space-y-4">
                  <div className="flex justify-between">
                    <h2 className="text-xl sm:text-2xl font-bold line-clamp-2">
                      {res.data.data.serviceTitle}
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {res.data.data.description}
                  </p>
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="text-xs sm:text-sm text-green-600 flex items-center">
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 ltr:mr-1 rtl:ml-1" />
                      {res.data.data.status === "active"
                        ? locale === "ar"
                          ? "خدمة فعالة"
                          : "Active Service"
                        : locale === "ar"
                        ? "خدمة غير متاحة"
                        : "Unavailable Service"}
                    </div>
                    <Link
                      href={`/dashboard/${id}`}
                      className={cn(
                        buttonVariants({ size: "sm" }),
                        "w-fit cursor-pointer sm:size-lg"
                      )}
                    >
                      {locale === "ar" ? "بدء الخدمة" : "Start Service"}
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs Navigation */}
            <Tabs defaultValue="steps" className="w-full" dir={direction}>
              <TabsList className="w-full bg-background mb-4 sm:mb-6 justify-start overflow-x-auto">
                <TabsTrigger
                  value="steps"
                  className="flex-1 text-xs sm:text-sm cursor-pointer"
                >
                  {locale === "ar" ? "الخطوات" : "Steps"}
                </TabsTrigger>
                <TabsTrigger
                  value="conditions"
                  className="flex-1 text-xs sm:text-sm cursor-pointer"
                >
                  {locale === "ar" ? "الشروط" : "Conditions"}
                </TabsTrigger>
                <TabsTrigger
                  value="requirements"
                  className="flex-1 text-xs sm:text-sm cursor-pointer"
                >
                  {locale === "ar" ? "المتطلبات" : "Requirements"}
                </TabsTrigger>
              </TabsList>

              {/* Steps Tab */}
              <TabsContent
                value="steps"
                className="space-y-4 sm:space-y-6"
                dir={direction}
              >
                <Card className="shadow-sm bg-background">
                  <CardHeader className="ltr:text-left rtl:text-right">
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg ltr:flex-row rtl:flex-row-reverse ltr:justify-start rtl:justify-end">
                      <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                      {locale === "ar"
                        ? "خطوات تقديم الطلب"
                        : "Request Submission Steps"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 sm:space-y-6 ltr:text-left rtl:text-right">
                      {res.data.data.steps.map(
                        (step: string, index: number) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 sm:gap-4 border-b pb-3 sm:pb-4 last:border-0"
                          >
                            <div className="min-w-6 sm:min-w-8">
                              <span className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary/10 text-primary text-xs sm:font-medium">
                                {index + 1}
                              </span>
                            </div>
                            <div className="space-y-1">
                              <p className="text-xs sm:text-sm text-foreground font-medium ltr:text-left rtl:text-right">
                                {step}
                              </p>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Conditions Tab */}
              <TabsContent
                value="conditions"
                className="space-y-4 sm:space-y-6"
                dir={direction}
              >
                <Card className="shadow-sm bg-background">
                  <CardHeader className="ltr:text-left rtl:text-right">
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg ltr:flex-row rtl:flex-row-reverse ltr:justify-start rtl:justify-end">
                      <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                      {locale === "ar" ? "شروط الخدمة" : "Service Conditions"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 sm:space-y-6 ltr:text-left rtl:text-right">
                      {res.data.data.conditions.map(
                        (condition: string, index: number) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 sm:gap-4 border-b pb-3 sm:pb-4 last:border-0 "
                          >
                            <div className="min-w-6 sm:min-w-8">
                              <span className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary/10 text-primary text-xs sm:font-medium">
                                {index + 1}
                              </span>
                            </div>
                            <div className="space-y-1">
                              <p className="text-xs sm:text-sm text-foreground font-medium ltr:text-left rtl:text-right">
                                {condition}
                              </p>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent
                value="requirements"
                className="space-y-4 sm:space-y-6"
                dir={direction}
              >
                <Card className="shadow-sm bg-background">
                  <CardHeader className="ltr:text-left rtl:text-right">
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg ltr:flex-row rtl:flex-row-reverse ltr:justify-start rtl:justify-end">
                      <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                      {locale === "ar"
                        ? "المتطلبات والوثائق المطلوبة"
                        : "Requirements and Documents"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 sm:space-y-6 ltr:text-left rtl:text-right">
                      {res.data.data.requirements.map(
                        (requirement: string, index: number) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 sm:gap-4 border-b pb-3 sm:pb-4 last:border-0"
                          >
                            <div className="min-w-6 sm:min-w-8">
                              <span className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary/10 text-primary text-xs sm:font-medium">
                                {index + 1}
                              </span>
                            </div>
                            <div className="space-y-1">
                              <p className="text-xs sm:text-sm text-foreground font-medium ltr:text-left rtl:text-right">
                                {requirement}
                              </p>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Related Services */}
            <Card className="shadow-sm bg-background mt-4">
              <CardHeader className="ltr:text-left rtl:text-right">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg ltr:flex-row rtl:flex-row-reverse ltr:justify-start rtl:justify-end">
                  <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  {locale === "ar" ? "خدمات ذات صلة" : "Related Services"}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 pt-2">
                <div className="flex flex-col gap-3 sm:gap-4 ltr:text-left rtl:text-right">
                  {res.data.data.relatedServices.map(
                    (service: RelatedService, index: number) => (
                      <a
                        key={index}
                        href={service.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-3 sm:p-4 border rounded-lg hover:bg-muted transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-md flex items-center justify-center">
                              <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                            </div>
                            <span className="text-xs sm:text-sm line-clamp-2">
                              {service.title}
                            </span>
                          </div>
                          <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground flex-shrink-0 ltr:rotate-0 rtl:rotate-180" />
                        </div>
                      </a>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceInfoPage;
