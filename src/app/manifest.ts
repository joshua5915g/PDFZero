import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PDFZero",
    short_name: "PDFZero",
    description: "Zero-server client-side PDF utility suite",
    start_url: "/",
    display: "standalone",
    background_color: "#fafafa",
    theme_color: "#000000",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
