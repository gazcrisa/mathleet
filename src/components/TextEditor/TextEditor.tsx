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
      [{ script: "sub" }, { script: "super" }],
      ["blockquote", "code-block"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
    ],
  };

  return (
    <ReactQuill
      theme="snow"
      modules={modules}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
};
export default TextEditor;
