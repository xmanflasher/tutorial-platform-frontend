"use client";

import React from "react";
import ReactMarkdown, { Components } from 'react-markdown';

interface MarkdownRendererProps {
    content: string;
}

const MarkdownRenderer = ({ content }: MarkdownRendererProps) => {
    // 定義 Markdown 標籤對應的 Tailwind 樣式
    const markdownComponents: Components = {
        // 標題 (###)
        h3: ({ node, ...props }) => <h3 className="text-xl font-bold text-yellow-500 mt-6 mb-3" {...props} />,
        // 列表 ( * )
        ul: ({ node, ...props }) => <ul className="list-disc list-outside pl-5 space-y-2 mb-4 text-gray-300" {...props} />,
        // 列表項
        li: ({ node, ...props }) => <li className="leading-relaxed" {...props} />,
        // 段落
        p: ({ node, ...props }) => <p className="mb-4 leading-relaxed text-gray-300" {...props} />,
        // 分隔線 (---)
        hr: ({ node, ...props }) => <hr className="my-6 border-gray-700" {...props} />,
    };

    return (
        <ReactMarkdown components={markdownComponents}>
            {content}
        </ReactMarkdown>
    );
};

export default MarkdownRenderer;
