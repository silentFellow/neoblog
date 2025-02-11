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
  changeRef,
}: {
  editable?: boolean;
  initialValue?: EditorState;
  changeRef?: any;
}) {
  const editor = useCreateEditor({ initialValue, editable });

  // Update changeRef.current whenever the editor state changes
  const handleChange = (newState: any) => {
    if (!changeRef) return;
    changeRef.current = newState;
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Plate editor={editor} onChange={handleChange} readOnly={!editable}>
        <EditorContainer
          className={`${editable} ? "border-2 border-black max-h[27rem]" : "max-h-screen"`}
        >
          <Editor variant={editable ? "fullWidth" : "none"} />
        </EditorContainer>
      </Plate>
    </DndProvider>
  );
}
