import axios from "axios";
/* eslint-disable @typescript-eslint/no-explicit-any */

const BASE_URL = "/api/";

const handleDownload = async ({ url }: { url: string }) => {
  if (!url) return { error: "URL is required", response: null, status: 400 };

  try {
    const response = await axios.get(
      `${BASE_URL}youtube?url=${encodeURIComponent(url)}`
    );

    return {
      error: null,
      response: response.data,
      status: response.status,
    };
  } catch (error: any) {
    return {
      error: error,
      response: null,
      status: error.response?.status || 500,
    };
  }
};

const youtubeService = { handleDownload };

export default youtubeService;
