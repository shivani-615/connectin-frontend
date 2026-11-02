const configuredApiUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : "https://connectin-backend-xwar.onrender.com");

export const API_URL = configuredApiUrl.replace(/\/$/, "");

export const getMediaUrl = (mediaUrl) =>
  mediaUrl?.replace(/^http:\/\/localhost:5000/, API_URL);
