// pages/_app.js (Updated)
import "@/styles/globals.css";
import Head from "next/head";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }) {
  const router = useRouter();

  // Default meta data
  const defaultMeta = {
    title: "Type Beat Video Generator - Create YouTube Videos Easily",
    description:
      "Create professional type beat videos for YouTube with custom audio, images, waveform visualizations and effects - all in your browser.",
    image: "/og-image.jpg", // You'll need to create this image in your public folder
    url: "https://your-domain.com" + router.asPath,
  };

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Default SEO Meta Tags */}
        <title>{defaultMeta.title}</title>
        <meta name="description" content={defaultMeta.description} />

        {/* Open Graph */}
        <meta property="og:url" content={defaultMeta.url} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={defaultMeta.title} />
        <meta property="og:description" content={defaultMeta.description} />
        <meta property="og:image" content={defaultMeta.image} />

        {/* Twitter */}
        <meta name="twitter:title" content={defaultMeta.title} />
        <meta name="twitter:description" content={defaultMeta.description} />
        <meta name="twitter:image" content={defaultMeta.image} />

        {/* Canonical URL */}
        <link rel="canonical" href={defaultMeta.url} />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
