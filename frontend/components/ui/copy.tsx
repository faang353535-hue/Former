"use client";
import { useEffect, useState } from "react";

interface CopyToClipboardProps {
    formId: string;
}

export default function CopyToClipboard({ formId }: CopyToClipboardProps) {
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!copied) return;
        const timeout = setTimeout(() => setCopied(false), 2000);
        return () => clearTimeout(timeout);
    }, [copied]);

    const handleCopy = async () => {

        const CopyLink = `${window.location.origin}/forms/${formId}`;
        console.log(CopyLink)
        try {
            await navigator.clipboard.writeText(CopyLink);
            setCopied(true);
        } catch (error) {
            console.error("Failed to copy:", error);
        }
    };

    return (
        <button
            onClick={handleCopy}
            className="text-gray-900 dark:text-gray-400 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700 rounded-lg py-2 px-2.5 inline-flex items-center justify-center bg-white border-gray-200 border h-8"
        >
            {!copied ? (
                <span className="inline-flex items-center">
                    <svg
                        className="w-3 h-3 me-1.5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 18 20"
                    >
                        <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z" />
                    </svg>
                    <span className="text-xs font-semibold">Copy Link</span>
                </span>
            ) : (
                <span className="inline-flex items-center">
                    <svg
                        className="w-3 h-3 text-blue-700 dark:text-blue-500 me-1.5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 16 12"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M1 5.917 5.724 10.5 15 1.5"
                        />
                    </svg>
                    <span className="text-xs font-semibold text-blue-700 dark:text-blue-500">
                        Copied
                    </span>
                </span>
            )}
        </button>
    );
}
