// components/Layout.js
import Link from "next/link";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <header className="bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-4 flex flex-wrap items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            Type Beat Video Generator
          </Link>

          <nav className="flex items-center space-x-4">
            <Link href="/" className="hover:text-blue-400 transition-colors">
              Home
            </Link>
            <Link
              href="/terms-of-service"
              className="hover:text-blue-400 transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/privacy-policy"
              className="hover:text-blue-400 transition-colors"
            >
              Privacy
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">{children}</main>

      <footer className="text-center py-6 text-gray-500 bg-gray-800">
        <p>
          Type Beat Video Generator - Create videos for your YouTube channel
        </p>
        <div className="mt-2">
          <Link
            href="/privacy-policy"
            className="text-blue-400 hover:text-blue-300 mx-2"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms-of-service"
            className="text-blue-400 hover:text-blue-300 mx-2"
          >
            Terms of Service
          </Link>
        </div>
      </footer>
    </div>
  );
}
