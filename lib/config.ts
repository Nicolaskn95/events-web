const isDevelopment = process.env.NODE_ENV === "development";

export const config = {
  apiUrl: isDevelopment
    ? "http://localhost:3001"
    : process.env.NEXT_PUBLIC_API_URL || "https://events-api-fatec.vercel.app",
};
