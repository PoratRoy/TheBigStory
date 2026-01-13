'use client';

import React, { useState, useEffect } from 'react';
import { EditorState, convertToRaw } from 'draft-js';
import dynamic from 'next/dynamic';
import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import styles from './RichTextEditor.module.css';

// Dynamically import the Editor component
const Editor = dynamic(
  () => import('react-draft-wysiwyg').then((mod) => mod.Editor),
  { ssr: false }
);

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const [isClient, setIsClient] = useState(false);
  const isMounted = React.useRef(true);

  useEffect(() => {
    setIsClient(true);
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const onEditorStateChange = (newEditorState: EditorState) => {
    if (isMounted.current) {
      setEditorState(newEditorState);
      const content = newEditorState.getCurrentContent();
      if (content) {
        const html = draftToHtml(convertToRaw(content));
        onChange(html);
      }
    }
  };

  if (!isClient) {
    return <div className={styles.editorPlaceholder}>טוען עורך...</div>;
  }

  return (
    <div className={styles.editorWrapper} dir="rtl">
      <Editor
        editorState={editorState}
        onEditorStateChange={onEditorStateChange}
        placeholder={placeholder}
        toolbarClassName={styles.toolbar}
        wrapperClassName={styles.wrapper}
        editorClassName={styles.editor}
        textAlignment="right"
        toolbar={{
          options: ['inline', 'list', 'textAlign', 'history'],
          inline: {
            options: ['bold', 'italic', 'underline', 'strikethrough'],
          },
          list: {
            options: ['unordered', 'ordered'],
          },
          textAlign: {
            inDropdown: false,
            options: ['left', 'center', 'right', 'justify'],
            default: 'right',
          },
        }}
        localization={{
          locale: 'he',
        }}
      />
    </div>
  );
}
