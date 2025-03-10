// pages/terms-of-service.js
import Head from "next/head";
import Link from "next/link";
import Layout from "@/components/Layout";

export default function TermsOfService() {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-900 text-white">
        <Head>
          <title>Terms of Service | Type Beat Video Generator</title>
          <meta
            name="description"
            content="Terms of Service for Type Beat Video Generator - Rules and guidelines for using our video creation tool."
          />
        </Head>

        <main className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-center mb-8">
            Terms of Service
          </h1>

          <div className="bg-gray-800 p-6 rounded-lg mb-8">
            <div className="prose prose-invert max-w-none">
              <h2>1. Acceptance of Terms</h2>
              <p>
                By accessing and using Type Beat Video Generator, you accept and
                agree to be bound by the terms and provisions of this agreement.
              </p>

              <h2>2. Description of Service</h2>
              <p>
                Type Beat Video Generator provides tools for creating videos
                with audio tracks and images. All files are processed in your
                browser and are not uploaded to our servers.
              </p>

              <h2>3. User Conduct</h2>
              <p>
                You are responsible for all content you create using our
                service. You agree not to use our service to create content
                that:
              </p>
              <ul>
                <li>
                  Infringes on intellectual property rights of third parties
                </li>
                <li>Contains defamatory, obscene, or offensive material</li>
                <li>Violates any applicable law or regulation</li>
              </ul>

              <h2>4. Intellectual Property</h2>
              <p>
                You retain all rights to the content you create using our
                service. We claim no ownership over your audio files, images, or
                resulting videos.
              </p>

              <h2>5. Disclaimer of Warranties</h2>
              <p>
                The service is provided "as is" without warranties of any kind.
                We do not guarantee that the service will be error-free or
                uninterrupted.
              </p>

              <h2>6. Limitation of Liability</h2>
              <p>
                We shall not be liable for any indirect, incidental, special,
                consequential or punitive damages resulting from your use of or
                inability to use the service.
              </p>

              <h2>7. Changes to Terms</h2>
              <p>
                We reserve the right to modify these terms at any time.
                Continued use of the service after changes constitutes
                acceptance of the modified terms.
              </p>

              <h2>8. Governing Law</h2>
              <p>
                These terms shall be governed by the laws of [Your
                Jurisdiction], without regard to its conflict of law provisions.
              </p>
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/"
              className="inline-block py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg"
            >
              Return to Home
            </Link>
          </div>
        </main>

        <footer className="text-center py-6 text-gray-500">
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
    </Layout>
  );
}
