import React from "react";
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
  ChevronLeft,
  Phone,
  Mail,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BackButton } from "@/components/shared/BackButton";
import { getServiceDetails } from "@/data/get-service-details";

// Define types for the service data
interface RelatedService {
  id: string;
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
  id: string;
  serviceTitle: string;
  description: string;
  licenseDuration: string;
  category: string;
  status: string;
  priority: string;
  steps: string[];
  conditions: string[];
  requirements: string[];
  serviceDetails: ServiceDetails;
  relatedServices: RelatedService[];
  targetAudience: string;
  serviceDuration: string;
  paymentOptions: string;
  serviceCost: string;
  supportQuestions: SupportQuestion[];
  startServiceLink: string;
  faq: FAQ[];
  lastUpdated: string;
  version: string;
}

// Single service data
const serviceData: Service = {
  id: "wholesale-books-magazines",
  serviceTitle:
    "البيع بالجملة للكتب والمجلات والصحف والوسائل التعليمية المساعدة",
  description:
    "تمكن هذه الخدمة من تسويق الكتب والمجلات والصحف والوسائل التعليمية المساعدة الداخلية والخارجية على نقاط التوزيع، والمشاركة في معارض الكتب.",
  licenseDuration: "3 سنوات",
  category: "media-licenses",
  status: "active",
  priority: "high",
  steps: [
    "الدخول على بوابة الخدمات الإلكترونية (منصة إعلام).",
    "اختيار التراخيص الإعلامية.",
    "اختيار خدمة (خدمات البث غير المجدولة).",
    "استكمال البيانات المطلوبة.",
    "رفع الوثائق المطلوبة.",
    "دفع الرسوم المطلوبة.",
    "انتظار الموافقة والحصول على الترخيص.",
  ],
  conditions: [
    "سجل تجاري مضاف به النشاط الإعلامي المطلوب.",
    "أن يكون لطالب الترخيص عنوان محدد (العنوان الوطني).",
    "أن تكون هوية مقدم الطلب سارية الصلاحية (الهوية الوطنية – هوية مقيم – جواز سفر).",
    "أن يكون المتقدم مالك المؤسسة (المؤسسات)، أو مديرًا للشركة (الشركات).",
    "أن لا يقل المؤهل الدراسي عن المرحلة الابتدائية.",
    "عدم وجود مخالفات مالية أو إدارية سابقة.",
    "تقديم ضمان بنكي بقيمة 50,000 ريال.",
  ],
  requirements: [
    "إثبات ممارسة النشاط.",
    "صورة من السجل التجاري ساري المفعول.",
    "صورة من الهوية الوطنية أو هوية المقيم.",
    "خطاب عدم ممانعة من الجهات ذات العلاقة.",
    "دراسة جدوى اقتصادية للمشروع.",
    "عقد إيجار أو ملكية المقر.",
  ],
  serviceDetails: {
    beneficiaries: "المؤسسات / الشركات",
    executionTime: "فوري",
    serviceFee: "2,000 ريال",
    serviceChannels: ["الموقع الإلكتروني", "التطبيق الذكي", "مراكز الخدمة"],
  },
  relatedServices: [
    {
      id: "podcast-registration",
      title: "تسجيل قنوات وبرامج التدوين الصوتي والمرئي",
      url: "https://gmedia.gov.sa/ar/services/register-podcast-channels-and-programs",
    },
    {
      id: "retail-media-devices",
      title: "ترخيص البيع بالتجزئة لأجهزة استقبال المحتوى الإعلامي وملحقاتها",
      url: "https://gmedia.gov.sa/ar/services/retail-license-for-media-content-receivers-and-accessories",
    },
    {
      id: "internet-radio",
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
      url: "https://gmedia.gov.sa/faq",
    },
    {
      title: "9200343222",
      icon: "Phone",
      type: "phone",
    },
    {
      title: "help@company.sa",
      icon: "Mail",
      type: "email",
    },
  ],
  startServiceLink: "https://elaam.gamr.gov.sa",
  faq: [
    {
      question: "كم مدة الخدمة؟",
      answer: "يتم تقديم الخدمة لمدة سنة إلى 3 سنوات حسب نوع الترخيص المطلوب.",
    },
    {
      question: "كم تكلفة الخدمة؟",
      answer:
        "يتم تقديم الخدمة مجاناً، ولكن قد تطبق رسوم إضافية حسب نوع الترخيص.",
    },
    {
      question: "كيف يمكن التواصل مع الخدمة؟",
      answer:
        "يمكن التواصل مع الخدمة عن طريق البريد الإلكتروني help@company.sa أو الاتصال على الرقم 9200343222.",
    },
    {
      question: "ما هي المدة المطلوبة للحصول على الموافقة؟",
      answer: "عادة ما تستغرق عملية المراجعة والموافقة من 5 إلى 10 أيام عمل.",
    },
    {
      question: "هل يمكن تجديد الترخيص؟",
      answer: "نعم، يمكن تجديد الترخيص قبل انتهاء صلاحيته بـ 30 يوم على الأقل.",
    },
  ],
  lastUpdated: "2025-06-01T10:30:00Z",
  version: "1.2",
};

const ServiceInfoPage = async ({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) => {
  const { id, locale } = await params;

  const res = await getServiceDetails(Number(id), locale);

  console.log("dsdsd: ", JSON.parse(res.data.data));

  return (
    <div className="min-h-screen bg-muted/30" dir="rtl">
      <div className="max-w-7xl mx-auto p-3 sm:p-6">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <Globe className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-lg md:text-xl lg:text-2xl font-bold truncate">
              الهيئة العامة لتنظيم الإعلام
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <BackButton label="الرجوع" />
          </div>
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
                      {serviceData.status === "active"
                        ? "خدمة فعالة"
                        : "خدمة غير متاحة"}
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
                  className="flex-1 text-xs sm:text-sm cursor-pointer"
                >
                  الخطوات
                </TabsTrigger>
                <TabsTrigger
                  value="conditions"
                  className="flex-1 text-xs sm:text-sm cursor-pointer"
                >
                  الشروط
                </TabsTrigger>
                <TabsTrigger
                  value="requirements"
                  className="flex-1 text-xs sm:text-sm cursor-pointer"
                >
                  المتطلبات
                </TabsTrigger>
                <TabsTrigger
                  value="faq"
                  className="flex-1 text-xs sm:text-sm cursor-pointer"
                >
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
                      {serviceData.steps.map((step: string, index: number) => (
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
                    <div className="space-y-4 sm:space-y-6">
                      {serviceData.conditions.map(
                        (condition: string, index: number) => (
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
              >
                <Card className="shadow-sm bg-background">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                      <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                      المتطلبات والوثائق المطلوبة
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-4 pt-2">
                    <div className="space-y-4 sm:space-y-6">
                      {serviceData.requirements.map(
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
                              <p className="text-xs sm:text-sm text-foreground font-medium">
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

              {/* FAQ Tab */}
              <TabsContent value="faq" className="space-y-4 sm:space-y-6">
                <Card className="shadow-sm bg-background">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                      <Info className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                      الأسئلة الشائعة
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-4 pt-2">
                    <Accordion type="single" collapsible className="w-full">
                      {serviceData.faq.map((item: FAQ, index: number) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                          <AccordionTrigger className="px-4 text-[#25155c] dark:text-foreground cursor-pointer">
                            {item.question}
                          </AccordionTrigger>
                          <AccordionContent className="px-4 text-muted-foreground">
                            {item.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Related Services */}
            <Card className="shadow-sm bg-background mt-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  خدمات ذات صلة
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 pt-2">
                <div className="flex flex-col gap-3 sm:gap-4">
                  {serviceData.relatedServices.map(
                    (service: RelatedService, index: number) => (
                      <button
                        key={index}
                        className="block p-3 sm:p-4 border rounded-lg hover:bg-muted transition-colors text-right"
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
                      </button>
                    )
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Service Metadata */}
            <Card className="shadow-sm bg-background mt-4">
              <CardContent className="p-3 sm:p-4">
                <div className="text-xs text-muted-foreground text-center">
                  آخر تحديث:{" "}
                  {new Date(serviceData.lastUpdated).toLocaleDateString(
                    "ar-SA"
                  )}{" "}
                  | الإصدار: {serviceData.version}
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
