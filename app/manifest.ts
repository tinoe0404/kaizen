import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kaizen Travel and Adventures",
    short_name: "Kaizen Travel",
    description:
      "Bespoke safari expeditions across Victoria Falls, Chobe and Namibia.",
    start_url: "/",
    display: "standalone",
    background_color: "#FBF8F1",
    theme_color: "#0C2E21",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}

