import { useTranslations } from "next-intl";
import LoginForm from "./_components/forms/LoginForm";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { nafathLogin } from "@/actions/NafathLogin";

const LoginPage = () => {
  const t = useTranslations("LoginPage");
  // Nafath URL from environment variable
  const nafathUrl =
    process.env.NEXT_PUBLIC_NAFATH_URL ||
    "https://iam.media.gov.sa/oauth/authorize?client_id=139&redirect_uri=http://localhost:3000&response_type=code&scope=";

  return (
    <div className="flex justify-center items-center w-full p-4">
      {/* Main container */}
      <div
        className={`flex flex-col lg:flex-row w-full max-w-5xl rounded-xl overflow-hidden border border-border bg-secondary/30 backdrop-blur-sm`}
      >
        {/* Image Section - Hidden on small screens */}
        <div className="hidden lg:block lg:w-1/2 relative">
          <div className="absolute inset-0 bg-linear-to-b dark:from-black/60 from-black/30 to-primary/40 z-10"></div>
          <Image
            src="/images/gmedia/auth.png"
            alt="Authentication"
            fill
            className="object-cover z-0"
            priority
          />
          <div className="absolute inset-0 flex flex-col justify-center z-20 p-10">
            <h1 className="text-4xl font-bold text-white drop-shadow-md mb-4">
              {t("welcome")}
            </h1>
            <p className="text-white/90 text-lg max-w-md drop-shadow-md">
              {t("welcomeDescription") ||
                "Access all your media services through our unified platform"}
            </p>
          </div>
        </div>

        {/* Form Section */}
        <div className="w-full lg:w-1/2">
          {/* Mobile image - Only shown on small screens */}
          <div className="relative w-full h-32 lg:hidden overflow-hidden">
            <Image
              src="/images/gmedia/auth.png"
              alt="GMB Auth"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-b from-primary/20 to-primary/40"></div>
          </div>

          <div className="p-6 lg:p-10 flex flex-col gap-6">
            <div className="">
              <h2 className="text-2xl font-bold">{t("title")}</h2>
              <p className="text-muted-foreground mt-1">{t("subtitle")}</p>
              <form
                action={async (formData) => {
                  "use server";
                  const res = await nafathLogin(formData);
                  console.log("res", res);
                }}
              >
                <input
                  type="hidden"
                  name="username"
                  value="nafathLoginProvider"
                />
                <input
                  type="hidden"
                  name="password"
                  value="nafathLoginProvider"
                />
                <input
                  type="hidden"
                  name="captchaToken"
                  value="nafathLoginProvider"
                />
                <input type="hidden" name="guid" value="nafathLoginProvider" />
                <Button
                  variant="secondary"
                  className="w-full mt-4 flex items-center justify-center gap-4"
                >
                  <Image
                    src="/images/gmedia/nafath.png"
                    alt="Nafath"
                    width={25 / 1.25}
                    height={25}
                  />
                  {t("nafath")}
                </Button>
              </form>
              <div className="relative mt-8">
                <div className="absolute inset-0 bg-border h-0.5 top-1/2 -translate-y-1/2" />
                <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 rounded-full bg-secondary py-1 w-[60px] text-center">
                  <p className="text-sm text-muted-foreground">{t("or")}</p>
                </div>
              </div>
            </div>

            <LoginForm />

            <div className="mt-6 text-center">
              <Link
                href="/auth/sign-up"
                className="text-sm text-muted-foreground"
              >
                {t("haveNoAccount")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
