import { NextRequest, NextResponse } from "next/server";
import ytdl from "@distube/ytdl-core";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");

  if (!url || !ytdl.validateURL(url)) {
    return NextResponse.json({ error: "Invalid YouTube URL" }, { status: 400 });
  }

  try {
    const info = await ytdl.getInfo(url);

    // Ensure we have valid formats
    const videoFormats = info.formats
      .filter((format) => format.hasVideo && !format.hasAudio)
      .sort((a, b) => (b.height || 0) - (a.height || 0));

    const audioFormats = info.formats
      .filter((format) => format.hasAudio && !format.hasVideo)
      .sort((a, b) => (b.audioBitrate || 0) - (a.audioBitrate || 0));

    if (!videoFormats.length || !audioFormats.length) {
      return NextResponse.json(
        { error: "No suitable formats found" },
        { status: 404 }
      );
    }

    const response = NextResponse.json(
      {
        videoDetails: info.videoDetails,
        title: info.videoDetails.title,
        video: videoFormats.map((format) => ({
          url: format.url,
          qualityLabel: format.qualityLabel,
        })),
        audio: audioFormats.map((format) => ({
          url: format.url,
          audioBitrate: format.audioBitrate,
        })),
      },
      { status: 200 }
    );

    // Set CORS headers to allow cross-origin requests
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");

    return response;
  } catch (error) {
    console.error("Error fetching video info:", error);
    return NextResponse.json(
      { error: "Failed to fetch video data" },
      { status: 500 }
    );
  }
}
