import { auth } from "@/auth";
import axios from "axios";
import SignUpClient from "./_components/sign-up-client";
import { LOCALE_CODE } from "@/constants/locale";

// Function to fetch registration form data
async function getRegistrationForm(locale: string) {
  try {
    const response = await axios.get(
      "https://e-api-stg.gmedia.gov.sa/api/request/registration",
      {
        headers: {
          "Accept-Language": LOCALE_CODE[locale as keyof typeof LOCALE_CODE],
        },
      }
    );

    // Log the API response for debugging

    return response.data;
  } catch (error) {
    console.error("Error fetching registration form:", error);
    return { data: {} };
  }
}

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function SignUpPage({ params }: Props) {
  const { locale } = await params;
  const session = await auth();
  const formData = await getRegistrationForm(locale);

  // If user is already logged in, they shouldn't access the sign-up page
  if (session) {
    return (
      <div className="mx-auto py-8 container">
        <div className="bg-yellow-50 p-4 rounded-md">
          <h2 className="font-medium text-yellow-800">Already Authenticated</h2>
          <p className="text-yellow-700">You are already signed in.</p>
        </div>
      </div>
    );
  }

  // Parse the formDesigner string to an object
  let formDesigner;
  try {
    formDesigner =
      typeof formData.formDesigner === "string"
        ? JSON.parse(formData.formDesigner)
        : formData.formDesigner || { components: [], display: "form" };
  } catch (error) {
    console.error("Error parsing formDesigner:", error);
    formDesigner = { components: [], display: "form" };
  }

  // Parse the translations
  let translations;
  try {
    translations =
      typeof formData.formDesignerTranslation === "string"
        ? JSON.parse(formData.formDesignerTranslation)
        : formData.formDesignerTranslation || [];
  } catch (error) {
    console.error("Error parsing translations:", error);
    translations = [];
  }

  // Format the data properly before passing to the client component
  const enhancedFormData = {
    formDesigner,
    translations,
    formData: {},
    documentTypesBase: formData.documentTypesBase || "",
  };

  return <SignUpClient formData={enhancedFormData} />;
}
