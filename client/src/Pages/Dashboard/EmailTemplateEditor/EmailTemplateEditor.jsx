import { useRef, useState } from "react";
import EmailEditor from "react-email-editor";
import { useAddEmailTemplateMutation } from "../../../redux/features/allApis/emailTemplateApi/emailTemplateApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

const EmailTemplateEditor = () => {
  const emailEditorRef = useRef(null);
  const navigate = useNavigate();
  const [isEditorLoaded, setIsEditorLoaded] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [addEmailTemplate, { isLoading }] = useAddEmailTemplateMutation();

  const saveDesign = () => {
    const cleanedName = templateName.toLowerCase().replace(/\s+/g, "").trim();
    if (!cleanedName) {
      toast.error("Please provide template name.");
      return;
    }

    emailEditorRef.current?.editor.exportHtml(async (data) => {
      const { design, html } = data;

      try {
        const result = await addEmailTemplate({
          name: cleanedName,
          subject: "We received your message",
          design,
          html,
        });

        if (result.data.insertedId) {
          toast.success("Template created successfully");
          setTemplateName("");
        }
        navigate("/dashboard/allemailtemplates");
      } catch (error) {
        toast.error("Failed to create template");
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <input
          type="text"
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
          placeholder="Template Name"
          className="px-4 py-2 rounded border border-indigo-600 w-full md:w-1/3 outline-none"
        />

        <button
          onClick={saveDesign}
          className="bg-blue-500 text-white px-4 py-2 rounded w-full md:w-auto"
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Save Template"}
        </button>
      </div>

      {!isEditorLoaded && (
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
        </div>
      )}

      <div className={`${isEditorLoaded ? "block" : "hidden"}`}>
        <EmailEditor
          ref={emailEditorRef}
          onLoad={() => setIsEditorLoaded(true)}
        />
      </div>
    </div>
  );
};

export default EmailTemplateEditor;
