import { useState } from "react";
import api from "../services/api";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useEffect, useRef } from "react";

function ChatBox({ repoUrl }) {

    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([]);
    const bottomRef = useRef(null);

    useEffect(() => {

        bottomRef.current?.scrollIntoView({
            behavior: "smooth"
        });

    }, [messages]);

    async function askAI() {

        if (loading || !query.trim()) {
            return;
        }

        try {

            setLoading(true);

            const { data } = await api.post(
                "/search",
                {
                    query,
                    repoUrl
                }
            );

            setMessages(prev => [
                ...prev,
                {
                    type: "user",
                    content: query
                },
                {
                    type: "assistant",
                    content: data
                }
            ]);

            setQuery("");

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Something went wrong."
            );

        } finally {

            setLoading(false);

        }

    }

    function clearChat() {

        setMessages([]);
        setQuery("");

    }

    return (

        <div className="max-w-5xl mx-auto m-12">

            <h2 className="text-2xl font-semibold mb-5">
                Ask AI
            </h2>

            <div className="flex gap-4">

                <textarea
                    rows={3}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    disabled={loading}
                    onKeyDown={(e) => {

                        if (e.key === "Enter" && !e.shiftKey) {

                            e.preventDefault();

                            askAI();

                        }

                    }}
                    placeholder="Ask anything about this repository..."
                    className="disabled:opacity-50 mb-20 flex-1 bg-[#111827] border border-gray-800 rounded-xl p-5 outline-none resize-none"
                />

                {
                    messages.length === 0 ? (

                        <button
                            onClick={askAI}
                            disabled={loading}
                            className="mb-20 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-8 rounded-xl font-semibold whitespace-nowrap"
                        >
                            {loading ? "Thinking..." : "Ask AI"}
                        </button>

                    ) : (

                        <div className="flex flex-col gap-3">

                            <button
                                onClick={askAI}
                                disabled={loading}
                                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-8 py-4 rounded-xl font-semibold whitespace-nowrap"
                            >
                                {loading ? "Thinking..." : "Ask AI"}
                            </button>

                            <button
                                onClick={clearChat}
                                className="bg-gray-700 hover:bg-gray-600 px-8 py-4 rounded-xl font-semibold whitespace-nowrap"
                            >
                                Clear Chat
                            </button>

                        </div>

                    )
                }

            </div>

            {
                messages.map((message, index) => (

                    <div
                        key={index}
                        className={`mb-7 ${message.type === "user"
                            ? "text-right"
                            : ""
                            }`}
                    >

                        {
                            message.type === "user" ? (

                                <div className="inline-block bg-blue-600 px-4 py-3 rounded-xl max-w-2xl">
                                    {message.content}
                                </div>

                            ) : (

                                <div className="bg-[#111827] border border-gray-700 rounded-xl p-5">

                                    <div className="prose prose-invert max-w-none">
                                        <ReactMarkdown
                                            components={{
                                                code({ inline, className, children, ...props }) {

                                                    const match = /language-(\w+)/.exec(className || "");

                                                    return !inline && match ? (
                                                        <SyntaxHighlighter
                                                            style={oneDark}
                                                            language={match[1]}
                                                            PreTag="div"
                                                            {...props}
                                                        >
                                                            {String(children).replace(/\n$/, "")}
                                                        </SyntaxHighlighter>
                                                    ) : (
                                                        <code className={className} {...props}>
                                                            {children}
                                                        </code>
                                                    );
                                                }
                                            }}
                                        >
                                            {message.content.answer}
                                        </ReactMarkdown>
                                    </div>

                                </div>

                            )
                        }

                    </div>

                ))

            }

            <div ref={bottomRef}></div>

        </div>

    );

}

export default ChatBox;