import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
} from "lucide-react";
import { BackButton } from "@/components/shared/BackButton";
import Link from "next/link";
import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Metadata");

  return {
    title: t("serviceDetails.title"),
  };
}

const ServiceInfoPage = () => {
  const serviceData = {
    serviceTitle:
      "البيع بالجملة للكتب والمجلات والصحف والوسائل التعليمية المساعدة",
    description:
      "تمكن هذه الخدمة من تسويق الكتب والمجلات والصحف والوسائل التعليمية المساعدة الداخلية والخارجية على نقاط التوزيع، والمشاركة في معارض الكتب.",
    licenseDuration: "3 سنوات",
    steps: [
      "الدخول على بوابة الخدمات الإلكترونية (منصة إعلام).",
      "اختيار التراخيص الإعلامية.",
      "اختيار خدمة (خدمات البث غير المجدولة).",
      "استكمال البيانات المطلوبة.",
    ],
    conditions: [
      "سجل تجاري مضاف به النشاط الإعلامي المطلوب.",
      "أن يكون لطالب الترخيص عنوان محدد (العنوان الوطني).",
      "أن تكون هوية مقدم الطلب سارية الصلاحية (الهوية الوطنية – هوية مقيم – جواز سفر).",
      "أن يكون المتقدم مالك المؤسسة (المؤسسات)، أو مديرًا للشركة (الشركات).",
      "أن لا يقل المؤهل الدراسي عن المرحلة الابتدائية.",
    ],
    requirements: ["إثبات ممارسة النشاط."],
    serviceDetails: {
      beneficiaries: "المؤسسات / الشركات",
      executionTime: "فوري",
      serviceFee: "2,000 ريال",
      serviceChannels: ["الموقع الإلكتروني"],
    },
    relatedServices: [
      {
        title: "تسجيل قنوات وبرامج التدوين الصوتي والمرئي",
        url: "https://gmedia.gov.sa/ar/services/register-podcast-channels-and-programs",
      },
      {
        title: "ترخيص البيع بالتجزئة لأجهزة استقبال المحتوى الإعلامي وملحقاتها",
        url: "https://gmedia.gov.sa/ar/services/retail-license-for-media-content-receivers-and-accessories",
      },
      {
        title: "البث الإذاعي عن طريق الإنترنت (محطات إذاعة الإنترنت)",
        url: "https://gmedia.gov.sa/ar/services/internet-radio-broadcasting",
      },
    ],
    targetAudience:
      "الموظفين ومنسوبي دول مجلس التعاون الخليجي والمستثمرين والأجانب",
    serviceDuration: "سنة إلى 3 سنوات",
    paymentOptions: "تطبيق الويب والموبايل",
    serviceCost: "مجاناً",
    supportQuestions: [
      {
        title: "Ministry-FAQ's page",
        icon: "Info",
      },
      {
        title: "9200343222",
        icon: "Phone",
      },
      {
        title: "help@company.sa",
        icon: "Mail",
      },
    ],
    startServiceLink: "https://elaam.gamr.gov.sa",
  };

  return (
    <div className="min-h-screen bg-muted/30" dir="rtl">
      <div className="max-w-7xl mx-auto p-3 sm:p-6">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <div className="flex items-center gap-2">
            <Image
              src="/images/gmedia/logo.png"
              alt="logo"
              width={32}
              height={32}
              className="hidden dark:block"
            />
            <Image
              src="/images/gmedia/logo-dark.png"
              alt="logo"
              width={32}
              height={32}
              className="block dark:hidden"
            />
            <h1 className="text-lg md:text-xl lg:text-2xl font-bold truncate">
              الهيئة العامة لتنظيم الإعلام
            </h1>
          </div>
          <BackButton label="الرجوع" className="hidden md:flex" />
          <BackButton size="icon" className="md:hidden" />
        </div>

        {/* Main Service Card with Tabs */}
        <div className="flex flex-col-reverse md:flex-row gap-4 sm:gap-6 md:rtl:flex-row-reverse">
          {/* Left Sidebar - Combined Card */}
          <div className="md:w-1/3 md:sticky md:top-4">
            <Card className="shadow-sm bg-background">
              <CardHeader className="border-b">
                <CardTitle>معلومات الخدمة</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {/* Target Audience */}
                <div className="border-b p-3 sm:p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                    <h3 className="text-sm sm:text-base font-medium">
                      الفئة المستهدفة
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground pr-6">
                    {serviceData.targetAudience}
                  </p>
                </div>

                {/* Service Duration */}
                <div className="border-b p-3 sm:p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                    <h3 className="text-sm sm:text-base font-medium">
                      مدة الخدمة
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground pr-6">
                    {serviceData.serviceDuration}
                  </p>
                </div>

                {/* Payment Options */}
                <div className="border-b p-3 sm:p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                    <h3 className="text-sm sm:text-base font-medium">
                      قنوات الدفع
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground pr-6">
                    {serviceData.paymentOptions}
                  </p>
                </div>

                {/* Service Cost */}
                <div className="p-3 sm:p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                    <h3 className="text-sm sm:text-base font-medium">
                      تكلفة الخدمة
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground pr-6">
                    {serviceData.serviceCost}
                  </p>
                </div>
              </CardContent>
              <div className="px-3 pb-3 sm:px-4 sm:pb-4">
                <Button variant="outline" className="w-full text-xs sm:text-sm">
                  <Download className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
                  تحميل دليل المستخدم
                </Button>
              </div>
            </Card>
          </div>

          {/* Right Main Content Area */}
          <div className="md:w-2/3">
            {/* Service Header */}
            <Card className="shadow-sm bg-background mb-4 sm:mb-6 relative">
              <CardContent className="">
                <div className="flex flex-col space-y-3 sm:space-y-4">
                  <div className="flex justify-between">
                    <h2 className="text-xl sm:text-2xl font-bold line-clamp-2">
                      {serviceData.serviceTitle}
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {serviceData.description}
                  </p>
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="text-xs sm:text-sm text-green-600 flex items-center">
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                      فعالية مستوى الخدمة
                    </div>
                    <Button
                      size="sm"
                      className="w-fit cursor-pointer sm:size-lg"
                    >
                      بدء الخدمة
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs Navigation */}
            <Tabs defaultValue="steps" dir="rtl" className="w-full">
              <TabsList className="w-full bg-background mb-4 sm:mb-6 justify-start overflow-x-auto">
                <TabsTrigger
                  value="steps"
                  className="flex-1 text-xs sm:text-sm"
                >
                  الخطوات
                </TabsTrigger>
                <TabsTrigger
                  value="conditions"
                  className="flex-1 text-xs sm:text-sm"
                >
                  الشروط
                </TabsTrigger>
                <TabsTrigger
                  value="requirements"
                  className="flex-1 text-xs sm:text-sm"
                >
                  المتطلبات
                </TabsTrigger>
                <TabsTrigger value="faq" className="flex-1 text-xs sm:text-sm">
                  الأسئلة الشائعة
                </TabsTrigger>
              </TabsList>

              {/* Steps Tab */}
              <TabsContent value="steps" className="space-y-4 sm:space-y-6">
                <Card className="shadow-sm bg-background">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                      <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                      خطوات تقديم الطلب
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-4 pt-2">
                    <div className="space-y-4 sm:space-y-6">
                      {serviceData.steps.map((step, index) => (
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
                            <p className="text-xs sm:text-sm text-foreground font-medium">
                              {step}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Conditions Tab */}
              <TabsContent
                value="conditions"
                className="space-y-4 sm:space-y-6"
              >
                <Card className="shadow-sm bg-background">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                      <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                      شروط الخدمة
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-4 pt-2">
                    <div className="space-y-3">
                      {serviceData.conditions.map((condition, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="min-w-5 sm:min-w-6">
                            <span className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary/10 text-primary text-[10px] sm:text-xs">
                              {index + 1}
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            {condition}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent
                value="requirements"
                className="space-y-4 sm:space-y-6"
              >
                <Card className="shadow-sm bg-background">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                      <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                      المتطلبات والوثائق المطلوبة
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-4 pt-2">
                    <div className="space-y-3 sm:space-y-4">
                      {serviceData.requirements.map((requirement, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 p-3 sm:p-4 bg-secondary/30 rounded-lg"
                        >
                          <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-primary shrink-0 mt-0.5" />
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            {requirement}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Requirements and FAQ Tab */}
              <TabsContent value="faq" className="space-y-4 sm:space-y-6">
                {/* FAQ Section */}
                <Card className="shadow-sm bg-background">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                      <Info className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                      الأسئلة الشائعة
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-4 pt-2">
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="item-1">
                        <AccordionTrigger className="px-4 text-[#25155c] dark:text-foreground">
                          كم مدة الخدمة؟
                        </AccordionTrigger>
                        <AccordionContent className="px-4">
                          يتم تقديم الخدمة لمدة سنة إلى 3 سنوات
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-2">
                        <AccordionTrigger className="px-4 text-[#25155c] dark:text-foreground">
                          كم تكلفة الخدمة؟
                        </AccordionTrigger>
                        <AccordionContent className="px-4">
                          يتم تقديم الخدمة مجاناً
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-3">
                        <AccordionTrigger className="px-4 text-[#25155c] dark:text-foreground">
                          كيف يمكن التواصل مع الخدمة؟
                        </AccordionTrigger>
                        <AccordionContent className="px-4">
                          يمكن التواصل مع الخدمة عن طريق البريد الإلكتروني
                          help@company.sa
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>

                {/* Related Services */}
              </TabsContent>
            </Tabs>
            <Card className="shadow-sm bg-background mt-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  خدمات ذات صلة
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 pt-2">
                <div className="flex flex-col gap-3 sm:gap-4">
                  {serviceData.relatedServices.map((service, index) => (
                    <Link
                      href={service.url}
                      key={index}
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
                        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground flex-shrink-0" />
                      </div>
                    </Link>
                  ))}
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
