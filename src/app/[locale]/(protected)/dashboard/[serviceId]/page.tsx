import { auth } from "@/auth";
import { getFormData } from "@/data/get-form-data";
import { convertFormDataToJSON } from "@/lib/utils";
import ClientForm from "./_components/ClientForm";
import { AnimatedMultiStepper } from "@/components/MultiStep";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Metadata");

  return {
    title: t("singleService.title"),
  };
}

export default async function SirvicePage({
  params,
}: {
  params: Promise<{ serviceId: string; locale: string }>;
}) {
  const t = await getTranslations("SingleServicePage");
  const session = await auth();
  const { serviceId, locale } = await params;
  const formRes = await getFormData(Number(serviceId), session!, locale);
  const parsedForm = convertFormDataToJSON(formRes.data);

  const steps = [
    { title: t("steps.step1") },
    { title: t("steps.step2") },
    { title: t("steps.step3") },
    { title: t("steps.step4") },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <AnimatedMultiStepper steps={steps}>
        <ClientForm formDataObj={parsedForm} DocumentTypeId={serviceId} />
      </AnimatedMultiStepper>
    </div>
  );
}
