import Link from "next/link";
import MaxWidthWrapper from "./MaxWidthWrapper";

type Props = {};

const Footer = (props: Props) => {
  const items = [
    {
      name: "Terms",
      href: "#",
    },
    {
      name: "Privacy Policy",
      href: "#",
    },
    {
      name: "Cookies Policy",
      href: "#",
    },
  ];
  return (
    <footer className="bg-white h-20 relative">
      <MaxWidthWrapper>
        <div className="border-t border-gray-200" />
        <div className="h-full flex flex-col md:flex-row  md:justify-between items-center justify-center">
          <div className="text-center md:text-left pb-2 md:pb-0">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} All Rights reserved
            </p>
          </div>

          <div className="flex items-center justify-center">
            <div className="flex space-x-8">
              {items.map(({ name, href }, index) => (
                <Link
                  href={href}
                  className="text-sm text-muted-foreground hover:text-gray-600"
                  key={index}
                >
                  {name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </footer>
  );
};

export default Footer;
