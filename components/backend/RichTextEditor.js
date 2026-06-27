// components/backend/RichTextEditor.jsx
import { useMemo, useRef, forwardRef } from "react";
import dynamic from "next/dynamic";

const ReactQuill = dynamic(
  async () => {
    const { default: RQ, Quill } = await import("react-quill");
    await import("react-quill/dist/quill.snow.css");

    const SizeStyle = Quill.import("attributors/style/size");
    SizeStyle.whitelist = ["10px", "12px", "14px", "16px", "18px", "20px", "24px", "28px", "32px"];
    Quill.register(SizeStyle, true);

    const QuillWrapper = forwardRef(({ forwardedRef, ...props }, _) => (
      <RQ ref={forwardedRef} {...props} />
    ));
    QuillWrapper.displayName = "QuillWrapper";
    return QuillWrapper;
  },
  { ssr: false }
);

export default function RichTextEditor({ label, value, onChange, rows = 6, placeholder }) {
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
          [{ size: ["10px", "12px", "14px", false, "18px", "20px", "24px", "28px", "32px"] }],
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
    "size",
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
        placeholder={placeholder}
        style={{ height: editorHeight, marginBottom: 42 }}
      />
    </div>
  );
}