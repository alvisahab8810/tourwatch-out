// components/backend/RichTextEditor.jsx
import { useMemo, useRef, forwardRef } from "react";
import dynamic from "next/dynamic";

// CSS must be imported inside the dynamic import to avoid SSR path errors
const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill");
    await import("react-quill/dist/quill.snow.css");
    return forwardRef(({ forwardedRef, ...props }, _) => (
      <RQ ref={forwardedRef} {...props} />
    ));
  },
  { ssr: false }
);

export default function RichTextEditor({ label, value, onChange, rows = 6 }) {
  const quillRef = useRef(null);

  function imageHandler() {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/png,image/jpeg,image/webp,image/gif");
    input.click();

    input.onchange = () => {
      const file = input.files[0];
      if (!file) return;
      if (file.size > 6 * 1024 * 1024) {
        alert("Max image size is 6 MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const quill =
          typeof quillRef.current?.getEditor === "function"
            ? quillRef.current.getEditor()
            : quillRef.current?.editor ?? null;

        if (!quill) return;
        const range = quill.getSelection(true) || { index: 0 };
        quill.insertEmbed(range.index, "image", e.target.result);
        quill.setSelection(range.index + 1);
      };
      reader.readAsDataURL(file);
    };
  }

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ color: [] }, { background: [] }],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ indent: "-1" }, { indent: "+1" }],
          ["link", "image"],
          ["clean"],
        ],
        handlers: { image: imageHandler },
      },
    }),
    []
  );

  const formats = [
    "header",
    "bold", "italic", "underline", "strike",
    "color", "background",
    "list", "bullet",
    "indent",
    "link", "image",
  ];

  const editorHeight = rows * 24 + 42;

  return (
    <div className="bk-rte-wrap">
      {label && <label className="bk-form-label">{label}</label>}
      <ReactQuill
        forwardedRef={quillRef}
        theme="snow"
        value={value || ""}
        onChange={onChange}
        modules={modules}
        formats={formats}
        style={{ height: editorHeight, marginBottom: 42 }}
      />
    </div>
  );
}