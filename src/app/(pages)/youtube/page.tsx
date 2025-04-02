"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "next/image";
import { useEffect, useState } from "react";
import { RxLink2 } from "react-icons/rx";
import { GoPaste } from "react-icons/go";
import { FaVideo } from "react-icons/fa6";
import { RiMusicAiFill } from "react-icons/ri";
import { TfiDownload } from "react-icons/tfi";
import Link from "next/link";
import youtubeService from "@/services/youtube.service";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function Youtube() {
  const [url, setUrl] = useState<string>("");
  const [types] = useState(["video", "audio"]);
  const [selectedType, setSelectedType] = useState(types[0]);
  const [loading, setLoading] = useState<boolean>(false);
  const [videos, setvideos] = useState([]);
  const [audios, setaudios] = useState([]);
  const [details, setdetails] = useState<any>();

  const getVideos = async () => {
    setLoading(true);
    const { response } = await youtubeService.handleDownload({
      url,
    });
    if (response) {
      setvideos(response.video);
      console.log({ response });
      setaudios(response.audio);
      setdetails(response.videoDetails);
    }
    setLoading(false);
  };

  useEffect(() => {
    console.log(details?.thumbnails[details?.thumbnails?.length - 1].url);
  }, [details]);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
    } catch (err) {
      console.error("Failed to read clipboard:", err);
    }
  };
  return (
    <main className="flex items-center justify-center h-screen w-screen font-[family-name:var(--font-geist-sans)]">
      <div className="w-full flex items-center justify-between fixed top-0 left-0 py-4 px-10 border-b border-[#1a1919]">
        <Image
          src={"/images/logos/full-logo-dark.png"}
          alt=""
          width={100}
          height={100}
        />
      </div>
      <div className="flex flex-col items-center gap-4 max-w-[600px] w-full">
        <section className="w-full flex justify-center">
          <Image
            src={"/images/logos/logo-dark.png"}
            alt="Logo"
            width={100}
            height={100}
          />
        </section>
        <section className="w-full relative px-8 focus-within:border-[#7f7f7f] focus-within:text-[#fbfbfb] rounded-lg border-[#4f4f4f] text-[#4f4f4f] border">
          <RxLink2 className="absolute top-2.5 left-2" />
          <input
            type="url"
            value={url}
            className="w-full font-semibold py-1.5 outline-none"
            placeholder="paste the link here"
            onChange={(e) => setUrl(e.target.value)}
          />
          <div
            onClick={getVideos}
            className="rounded-r-md cursor-pointer p-4 flex justify-center items-center h-full bg-[#7f7f7f] absolute top-0 right-0"
          >
            {loading ? (
              <AiOutlineLoading3Quarters
                className="animate-spin"
                size={12}
                color="white"
              />
            ) : (
              <TfiDownload size={12} color="white" />
            )}
          </div>
        </section>
        <section className="flex w-full justify-between items-center">
          <div className="flex bg-[#4f4f4f] text-[#fbfbfb] items-center rounded-md">
            {types.map((type: string, index: number) => {
              const selected = selectedType == type;
              return (
                <div
                  onClick={() => setSelectedType(type)}
                  key={index}
                  className={`flex items-center px-4 py-1 gap-1 font-semibold cursor-pointer opacity-80 hover:opacity-100 ${
                    selected && "bg-[#fbfbfb] text-[#1d1d1d]"
                  } ${type == types[0] ? "rounded-l-md" : "rounded-r-md"}`}
                >
                  {type == types[0] ? <FaVideo /> : <RiMusicAiFill />}
                  {type}
                </div>
              );
            })}
          </div>
          <div
            onClick={handlePaste}
            className="bg-[#4f4f4f] text-[#fbfbfb] flex items-center rounded-md px-4 py-1 gap-1 font-semibold cursor-pointer opacity-80 hover:opacity-100"
          >
            <GoPaste />
            paste
          </div>
        </section>
        <section className="w-full flex flex-col scrollbar-hide max-h-[200px] overflow-scroll">
          {selectedType == types[0]
            ? videos?.map((video: any, index: any) => (
                <div
                  key={index}
                  className="w-full flex justify-between items-center font-semibold border-b border-[#3f3f3f]  py-2"
                >
                  <div className="flex flex-col">
                    <Image
                      src={
                        details?.thumbnails[details?.thumbnails?.length - 1]
                          .url || ""
                      }
                      alt=""
                      width={100}
                      height={100}
                      className="border border-[#4f4f4f] rounded-md w-32"
                    />
                    <p className="text-sm">Quality: {video?.qualityLabel}</p>
                  </div>
                  <a href={video?.url} download target="_blank">
                    <TfiDownload className="cursor-pointer" />
                  </a>
                </div>
              ))
            : audios.map((audio: any, index: any) => (
                <div
                  key={index}
                  className="w-full flex justify-between items-c font-semibold border-b  py-2"
                >
                  <p>Bitrate: {audio?.audioBitrate}</p>
                  <a href={audio?.url} download target="_blank">
                    <TfiDownload className="cursor-pointer" />
                  </a>
                </div>
              ))}
        </section>
      </div>

      <div className="fixed w-full text-center bottom-0 py-5 text-sm underline-offset-2 text-[#9e9a9a] font-medium">
        Developed by{" "}
        <Link href={"https://cermuel.vercel.app"} className="underline">
          CERMUEL
        </Link>{" "}
        - {new Date().getFullYear()}
      </div>
    </main>
  );
}
