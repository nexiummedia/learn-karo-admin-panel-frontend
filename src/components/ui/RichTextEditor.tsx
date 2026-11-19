"use client";

import React from "react";
import dynamic from "next/dynamic";
import type { RichTextEditorProps } from "./RichTextEditorInner";

const DynamicRichTextEditorInner = dynamic(
  () => import("./RichTextEditorInner").then((mod) => mod.RichTextEditorInner),
  {
    ssr: false,
    loading: () => (
      <div className="border border-slate-200 rounded-xl bg-white p-4 min-h-[220px] text-xs text-slate-400 flex items-center justify-center">
        Loading editor...
      </div>
    ),
  }
);

export const RichTextEditor: React.FC<RichTextEditorProps> = (props) => {
  return <DynamicRichTextEditorInner {...props} />;
};

export type { RichTextEditorProps };
