export default function manifest() {
  return {
    name: "TVK Orathanadu - தமிழக வெற்றி கழகம்",
    short_name: "TVK 175",
    description: "Thamizhaga Vetri Kazhagam – Orathanadu Assembly Constituency 175 Digital Portal",
    start_url: "/",
    display: "standalone",
    background_color: "#080808",
    theme_color: "#000000",
    orientation: "portrait",
    categories: ["politics", "community", "social"],
    icons: [
      {
        "src": "/icon.png",
        "sizes": "192x192",
        "type": "image/png",
        "purpose": "maskable"
      },
      {
        "src": "/icon.png",
        "sizes": "512x512",
        "type": "image/png",
        "purpose": "any"
      },
      {
        "src": "/icon.png",
        "sizes": "1024x1024",
        "type": "image/png",
        "purpose": "any"
      }
    ],
    screenshots: [
      {
        "src": "/icon.png",
        "sizes": "1024x1024",
        "type": "image/png",
        "form_factor": "wide",
        "label": "TVK Orathanadu Portal"
      }
    ]
  }
}
