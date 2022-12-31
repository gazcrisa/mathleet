import dynamic from "next/dynamic";

import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

type TextEditorProps = {
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
};

const TextEditor: React.FC<TextEditorProps> = ({
  value,
  onChange,
  placeholder,
}) => {
  const modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      ["link"],
      ["blockquote", "code-block"],
      [{ list: "ordered" }, { list: "bullet" }],
    ],
  };

  const formats = [
    "bold",
    "code",
    "italic",
    "link",
    "size",
    "strike",
    "script",
    "underline",
    "blockquote",
    "code-block",
    "list"
  ];

  return (
    <ReactQuill
      theme="snow"
      modules={modules}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      formats={formats}
    />
  );
};
export default TextEditor;
