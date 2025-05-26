// app/drafts/[refId]/page.tsx
import { auth } from "@/auth";
import { getFormDisplayByRefNum } from "@/data/get-form-display-by-ref-num";
import { SingleDraftFormClient } from "./_components/SingleDraftFormClient";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Metadata");

  return {
    title: t("singleDraft.title"),
  };
}

type Props = {
  params: Promise<{ refId: string }>;
};

export default async function SingleDraftFormPage({ params }: Props) {
  const { refId } = await params;
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

  const res = await getFormDisplayByRefNum(session, refId);

  return (
    <div className="mx-auto max-w-5xl">
      <SingleDraftFormClient refId={refId} formData={res} session={session} />
    </div>
  );
}
