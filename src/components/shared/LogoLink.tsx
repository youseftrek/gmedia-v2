import { Link } from "@/i18n/routing";
import Image from "next/image";

type LogoLinkProps = {
  size?: number;
  href?: string;
  className?: string;
};

const LogoLink = ({ size = 50, href, className }: LogoLinkProps) => {
  return (
    <Link
      href={href || "/"}
      className={`hover:opacity-70 mr-1 w-fit transition-all duration-200 ${
        className || ""
      }`}
    >
      <Image
        src="/images/gmedia/dark-logo.png"
        alt="motager logo"
        width={size}
        height={size / 2.99}
        className="dark:hidden flex"
      />
      <Image
        src="/images/gmedia/light-logo.png"
        alt="motager logo"
        width={size}
        height={size / 2.99}
        className="hidden dark:flex"
      />
    </Link>
  );
};

export default LogoLink;
