
/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
      domains: [
        "googleusercontent.com",
        "oaidalleapiprodscus.blob.core.windows.net",
        "cdn.openai.com"
      ]
    }
  }

module.exports = nextConfig
