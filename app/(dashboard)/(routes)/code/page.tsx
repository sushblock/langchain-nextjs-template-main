"use client";

import React, { lazy, Suspense } from 'react';
import { Code } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { ChatCompletionRequestMessage } from "openai";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Loader } from "@/components/loader";
import { useProModal } from "@/hooks/use-pro-modal";
import ReactMarkdown from "react-markdown";

const Heading = lazy(() => import('@/components/heading'));
const BotAvatar = lazy(() => import('@/components/bot-avatar'));
const UserAvatar = lazy(() => import('@/components/user-avatar'));


const renderLoader = () => <p>Loading</p>;

const CodePage = () => {
  const router = useRouter();
  const proModal = useProModal();

  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const [response, setResponse] = useState<String>("");
  const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([]);

  const prompt = `Q: ${input} Generate a response with less than 200 characters.`;

  const generateResponse = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setResponse("");
    setLoading(true);

    try {

      const authResponse = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        }
      });

      if (!authResponse.ok) {
        throw new Error(authResponse.statusText);
      }

    } catch (error: any) {

      toast.error(`Something went wrong in Auth. ${error}`);

    }

    try {
      const userMessage: ChatCompletionRequestMessage = { role: "user", content: input };
      setMessages((current) => [...current, userMessage]);

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
        }),
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      // This data is a ReadableStream
      const data = response.body;
      if (!data) {
        return;
      }

      const reader = data.getReader();
      const decoder = new TextDecoder();
      let done = false;

      let str = "";

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);
        str += chunkValue;
        setResponse((prev) => prev + chunkValue);
      }

      const systemMessage: ChatCompletionRequestMessage = { role: "system", content: str };
      setMessages((current) => [...current, systemMessage]);

      setLoading(false);
      setInput("");
    } catch (error: any) {
      if (error?.response?.status === 403) {
        proModal.onOpen();
      } else {
        toast.error(`Something went wrong. ${error}`);
      }
    } finally {
      router.refresh();
    }
  };

  return (
    <div>
      <Suspense fallback={renderLoader()}>
        <Heading
          title="Code Generation"
          description="Generate code using descriptive text."
          icon={Code}
          iconColor="text-green-700"
          bgColor="bg-green-700/10" 
        />
      </Suspense>
      <div className="px-4 lg:px-8">

        <div className="
                rounded-lg 
                border 
                w-full 
                p-4 
                px-3 
                md:px-6 
                focus-within:shadow-sm
                grid
                grid-cols-12
                gap-2
              ">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="col-span-12 lg:col-span-10 m-0 p-0 border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
            disabled={loading}
            placeholder="Simple toggle button using react hooks."
          />
          <Button className="col-span-12 lg:col-span-2 w-full" onClick={(e) => generateResponse(e)} disabled={loading} size="icon">
            Generate
          </Button>
        </div>
        <div className="space-y-4 mt-4">
          {loading && (
            <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
              <Loader />
            </div>
          )}
          <div className="flex flex-col-reverse gap-y-4">
            {messages.map((message) => (
              <div
                key={message.content}
                className={cn(
                  "p-8 w-full flex items-start gap-x-8 rounded-lg",
                  message.role === "user" ? "bg-white border border-black/10" : "bg-muted",
                )}
              >
                <Suspense fallback={renderLoader()}>
                  {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
                </Suspense>
                <ReactMarkdown components={{
                  pre: ({ node, ...props }) => (
                    <div className="overflow-auto w-full my-2 bg-black/10 p-2 rounded-lg">
                      <pre {...props} />
                    </div>
                  ),
                  code: ({ node, ...props }) => (
                    <code className="bg-black/10 rounded-lg p-1" {...props} />
                  )
                }} className="text-sm overflow-hidden leading-7">
                  {message.content || ""}
                </ReactMarkdown>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CodePage;

