import { Pacifico } from "next/font/google";
import Link from "next/link";
import { FaFacebook, FaInstagram } from "react-icons/fa6";

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: "400",
});

export function Footer() {
  return (
    <footer className="w-full border-b bg-background/80 backdrop-blur">
      <div className="mx-auto grid max-w-7xl grid-cols-5 px-2 mb-4">
        {/* Left */}
        <div className="col-span-2">
          <Link href="/" className={`${pacifico.className} text-2xl`}>
            Movie.ai
          </Link>

          <div className="flex flex-left gap-3 mt-3">
            <FaFacebook className="h-5 w-5" />
            <FaInstagram className="h-5 w-5" />
          </div>
        </div>

        {/* Right */}
        <div className="col-span-3 grid grid-cols-4 justify-items-end gap-8 text-right">
          <div className="text-center">
            <h3 className="mb-4 font-bold">Movies</h3>

            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#">Popular</Link>
              </li>
              <li>
                <Link href="#">All movies</Link>
              </li>
            </ul>
          </div>

          <div className="text-center">
            <h3 className="mb-4 font-bold">Legal</h3>

            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#">Privacy Policy</Link>
              </li>
              <li>
                <Link href="#">Terms of Service</Link>
              </li>
            </ul>
          </div>

          <div className="text-center">
            <h3 className="mb-4 font-bold">Support</h3>

            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#">Help Center</Link>
              </li>
              <li>
                <Link href="#">FAQ</Link>
              </li>
            </ul>
          </div>

          <div className="text-center">
            <h3 className="mb-4 font-bold">Social</h3>

            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Facebook</li>
              <li>Instagram</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
