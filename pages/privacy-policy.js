// pages/privacy-policy.js
import Head from "next/head";
import Link from "next/link";
import Layout from "@/components/Layout";

export default function PrivacyPolicy() {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-900 text-white">
        <Head>
          <title>Privacy Policy | Type Beat Video Generator</title>
          <meta
            name="description"
            content="Privacy Policy for Type Beat Video Generator - How we handle your data and protect your privacy."
          />
        </Head>

        <main className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-center mb-8">
            Privacy Policy
          </h1>

          <div className="bg-gray-800 p-6 rounded-lg mb-8">
            <div className="prose prose-invert max-w-none">
              <h2>1. Data Processing</h2>
              <p>
                Type Beat Video Generator processes all data locally in your
                browser. We do not collect, store, or transmit your audio files,
                images, or the videos you create.
              </p>

              <h2>2. Information Collection</h2>
              <p>
                We collect minimal information necessary for the operation of
                our service, which may include:
              </p>
              <ul>
                <li>Anonymous usage statistics (through analytics)</li>
                <li>Technical information about your browser and device</li>
                <li>Error reports</li>
              </ul>

              <h2>3. Cookies</h2>
              <p>
                We use cookies to enhance your experience on our website. You
                can control cookie settings through your browser preferences.
              </p>

              <h2>4. Third-Party Services</h2>
              <p>
                We may use third-party services such as Google Analytics to
                collect anonymized usage data. These services have their own
                privacy policies.
              </p>

              <h2>5. Data Security</h2>
              <p>
                Since all media processing occurs locally in your browser, your
                content never leaves your device unless you explicitly download
                and share it.
              </p>

              <h2>6. Children&apos;s Privacy</h2>
              <p>
                Our service is not directed to individuals under 13. We do not
                knowingly collect personal information from children under 13.
              </p>

              <h2>7. Changes to Privacy Policy</h2>
              <p>
                We may update our Privacy Policy from time to time. We will
                notify you of any changes by posting the new Privacy Policy on
                this page.
              </p>

              <h2>8. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please
                contact us at [your contact email].
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
