// app/drafts/[refId]/page.tsx
import { auth } from "@/lib/auth";
import { getFormDisplayByRefNum } from "@/data/get-form-display-by-ref-num";
import { convertFormDataToJSON } from "@/lib/utils";
import { AnimatedMultiStepper } from "@/components/MultiStep";
import ClientDraftForm from "./_components/ClientDraftForm";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Metadata");

  return {
    title: t("singleDraft.title"),
  };
}

export default async function SingleDraftFormPage({
  params,
}: {
  params: Promise<{ refId: string; locale: string }>;
}) {
  const t = await getTranslations("SingleServicePage");
  const { refId, locale } = await params;
  const session = await auth();

  if (!session) {
    return (
      <div className="mx-auto py-8 container">
        <div className="bg-red-50 p-4 rounded-md">
          <h2 className="font-medium text-red-800">Authentication Required</h2>
          <p className="text-red-700">Please sign in to view this draft.</p>
        </div>
      </div>
    );
  }

  const formRes = await getFormDisplayByRefNum(session, refId);
  const parsedForm = convertFormDataToJSON(formRes.data);

  // Extract DocumentTypeId from the form data response
  const documentTypeId =
    formRes.data?.documentTypeId || formRes.data?.DocumentTypeId || "";

  const steps = [
    { title: t("steps.step1") },
    { title: t("steps.step2") },
    { title: t("steps.step3") },
    { title: t("steps.step4") },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <AnimatedMultiStepper steps={steps}>
        <ClientDraftForm
          formDataObj={parsedForm}
          DocumentTypeId={documentTypeId}
          refId={refId}
        />
      </AnimatedMultiStepper>
    </div>
  );
}
