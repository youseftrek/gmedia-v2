import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  DollarSign,
  Globe,
  CheckCircle,
  FileText,
  ArrowRight,
  ExternalLink,
  Zap,
  Shield,
  Calendar,
  Star,
  Target,
  Award,
  Sparkles,
} from "lucide-react";
import { Particles } from "@/components/magicui/particles";
import { BackButton } from "@/components/shared/BackButton";
import Image from "next/image";

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
    startServiceLink: "https://elaam.gamr.gov.sa",
  };

  return (
    <div className="min-h-screen bg-muted/30" dir="rtl">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
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
            <h1 className="text-xl md:text-2xl font-bold">
              الهيئة العامة لتنظيم الإعلام
            </h1>
          </div>
          <BackButton label="الرجوع" className="hidden md:flex" />
          <BackButton size="icon" className="md:hidden" />
        </div>
        {/* Hero Card */}
        <Card className="relative bg-linear-to-br from-[#00bbbe]/5 via-background to-primary/5 p-3 overflow-hidden mb-8">
          <CardContent className="p-12 z-10">
            <div className="max-w-4xl">
              <div className="flex items-center gap-2 mb-6">
                <Badge variant="secondary" className="flex items-center gap-2">
                  <Calendar size={14} />
                  {serviceData.licenseDuration}
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-2">
                  <Award size={14} />
                  خدمة معتمدة
                </Badge>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-10">
                {serviceData.serviceTitle}
              </h1>

              <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-3xl">
                {serviceData.description}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  ابدأ الآن
                </Button>
              </div>
            </div>
          </CardContent>
          <Particles
            className="absolute inset-0 z-0"
            quantity={80}
            ease={100}
            color="#7a3996"
            refresh
          />
          <Particles
            className="absolute inset-0 z-0"
            quantity={80}
            ease={80}
            color="#00bbbe"
            refresh
          />
        </Card>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* Quick Stats */}
          <Card className="lg:col-span-2 shadow-sm bg-background">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 mr-3 text-[#00bbbe]" />
                معلومات سريعة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-1">المستفيدون</h3>
                  <p className="text-sm text-muted-foreground">
                    {serviceData.serviceDetails.beneficiaries}
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Zap className="w-6 h-6 text-green-500" />
                  </div>
                  <h3 className="font-semibold mb-1">مدة التنفيذ</h3>
                  <p className="text-sm text-muted-foreground">
                    {serviceData.serviceDetails.executionTime}
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <DollarSign className="w-6 h-6 text-purple-500" />
                  </div>
                  <h3 className="font-semibold mb-1">رسوم الخدمة</h3>
                  <p className="text-sm text-muted-foreground">
                    {serviceData.serviceDetails.serviceFee}
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Globe className="w-6 h-6 text-orange-500" />
                  </div>
                  <h3 className="font-semibold mb-1">قناة الخدمة</h3>
                  <p className="text-sm text-muted-foreground">
                    {serviceData.serviceDetails.serviceChannels[0]}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Process Overview */}
          <Card className="lg:col-span-2 shadow-sm bg-background">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 mr-3 text-[#00bbbe]" />
                خطوات بسيطة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {serviceData.steps.slice(0, 2).map((step, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm font-semibold shrink-0">
                      {index + 1}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Process */}
        <Card className="shadow-sm mb-8 bg-background">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 mr-3 text-[#00bbbe]" />
              خطوات التقديم التفصيلية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {serviceData.steps.map((step, index) => (
                <div
                  key={index}
                  className="p-6 border rounded-xl transition-all duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-bold shrink-0">
                      {index + 1}
                    </div>

                    <p className="text-muted-foreground leading-relaxed">
                      {step}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Requirements Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Conditions */}
          <Card className="lg:col-span-2 shadow-sm bg-background">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 mr-3 text-[#00bbbe]" />
                الشروط الأساسية
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {serviceData.conditions.map((condition, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 bg-secondary/40 rounded-lg"
                  >
                    <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {condition}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card className="shadow-sm bg-background">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 mr-3 text-[#00bbbe]" />
                الوثائق المطلوبة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {serviceData.requirements.map((requirement, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 bg-secondary/40 rounded-lg"
                  >
                    <FileText className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {requirement}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Related Services */}
        <Card className="shadow-sm mb-8 bg-background">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 mr-3 text-[#00bbbe]" />
              خدمات ذات صلة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {serviceData.relatedServices.map((service, index) => (
                <div
                  key={index}
                  className="p-6 border rounded-xl hover:shadow-md transition-all duration-200 cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center group-hover:bg-primary/10 transition-all duration-200">
                      <ExternalLink className="w-5 h-5 text-primary transition-colors duration-200" />
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" />
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed transition-colors duration-200">
                    {service.title}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Final CTA */}
        <Card className="border-0 shadow-lg bg-linear-to-br from-[#00bbbe]/5 via-background to-primary/5">
          <CardContent className="p-12 text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">جاهز للبدء؟</h2>
              <p className="text-xl text-muted-foreground mb-8">
                احصل على ترخيصك في دقائق معدودة من خلال النظام الإلكتروني
              </p>
              <Button size="lg">
                <ExternalLink className="w-4 h-4 mr-2" />
                ابدأ التقديم الآن
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ServiceInfoPage;
