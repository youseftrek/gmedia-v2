import { useTranslations } from "next-intl";
import Image from "next/image";

const Footer = () => {
  const t = useTranslations("Footer");
  return (
    <div className="flex flex-col-reverse text-sm md:text-base lg:flex-row flex-wrap bg-[#25155c] px-4 py-2 lg:px-8 gap-2 items-center justify-between">
      <p className="text-white">{t("tagline")}</p>
      <div className="flex gap-2 items-center w-fit">
        <div className="relative w-[110px] h-[60px]">
          <Image
            src="/images/gmedia/SA-Vision-white.svg"
            alt="gmedia"
            fill
            priority
            className="object-contain"
          />
        </div>
        <div className="relative w-[120px] h-[50px]">
          <Image
            src="/images/gmedia/gmedia-white.png"
            alt="gmedia"
            fill
            priority
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default Footer;
