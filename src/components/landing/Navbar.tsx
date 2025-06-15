import MaxWidthWrapper from "../shared/MaxWidthWrapper";
import LogoLink from "../shared/LogoLink";
import { ModeToggle } from "../shared/ModeToggle";
import { LanguageSelect } from "../shared/LanguageSelect";
import HomePageMobileMenu from "./MobileMenu";
import NavItems from "./NavItems";
import AvatarMenu from "../shared/AvatarMenu";
import { Session } from "@/lib/auth";

type Props = {
  session?: Session | null;
};

const Navbar = ({ session }: Props) => {
  return (
    <div className="top-0 left-0 z-50 fixed bg-background/70 backdrop-blur-md w-full">
      <MaxWidthWrapper className="px-2 md:px-4 lg:px-16 xl:px-32 2xl:px-48">
        <header className="pt-2 lg:pt-4 rounded-b-md">
          <nav className="flex justify-between items-center bg-secondary md:mx-0 p-2 border rounded-md">
            <LogoLink />
            <div className="hidden md:flex justify-center items-center gap-10 font-semibold text-lg">
              <NavItems />
            </div>
            <div className="flex justify-center items-center gap-1.5">
              <AvatarMenu session={session || null} />
              <ModeToggle buttonVariant="outline" className="hidden md:flex" />
              <LanguageSelect
                buttonVariant="outline"
                className="hidden md:flex"
              />
              <HomePageMobileMenu />
            </div>
          </nav>
        </header>
      </MaxWidthWrapper>
    </div>
  );
};

export default Navbar;
