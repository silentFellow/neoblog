"use client";

import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { Plate } from "@udecode/plate/react";

import { useCreateEditor } from "@/components/editor/use-create-editor";
import { Editor, EditorContainer } from "@/components/plate-ui/editor";
import { EditorState } from "@/types";

export function PlateEditor({
  editable = true,
  initialValue = [],
  onChange,
}: {
  editable?: boolean;
  initialValue?: EditorState;
  onChange?: (v: EditorState) => void;
}) {
  const editor = useCreateEditor({ initialValue, editable });

  return (
    <DndProvider backend={HTML5Backend}>
      <Plate
        editor={editor}
        onChange={(v) => {
          if (onChange) onChange(v.value);
        }}
      >
        <EditorContainer className="border-2 border-black">
          <Editor variant="fullWidth" />{" "}
        </EditorContainer>
      </Plate>
    </DndProvider>
  );
}
