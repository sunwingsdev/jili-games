import { useEffect, useRef, useState } from "react";
import EmailEditor from "react-email-editor";
import { useParams, useNavigate } from "react-router";
import toast from "react-hot-toast";
import {
  useGetEmailTemplateByIdQuery,
  useUpdateEmailTemplateMutation,
} from "../../../redux/features/allApis/emailTemplateApi/emailTemplateApi";

const EditEmailTemplate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const emailEditorRef = useRef(null);

  const [isEditorLoaded, setIsEditorLoaded] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [updateEmailTemplate, { isLoading }] = useUpdateEmailTemplateMutation();

  const { data: templateData, isLoading: isFetching } =
    useGetEmailTemplateByIdQuery(id);

  useEffect(() => {
    if (isEditorLoaded && templateData?.design) {
      emailEditorRef.current?.editor.loadDesign(templateData.design);
      setTemplateName(templateData.name || "");
    }
  }, [isEditorLoaded, templateData]);

  const saveUpdatedTemplate = () => {
    const cleanedName = templateName.toLowerCase().replace(/\s+/g, "").trim();
    if (!cleanedName) {
      toast.error("Please provide a valid template name.");
      return;
    }

    emailEditorRef.current?.editor.exportHtml(async (data) => {
      const { design, html } = data;

      try {
        const result = await updateEmailTemplate({
          id,
          data: {
            name: cleanedName,
            subject: templateData?.subject || "Updated Subject",
            design,
            html,
          },
        });

        if (result.data.modifiedCount > 0) {
          toast.success(result.data.message || "Updated successfully");
          navigate("/dashboard/allemailtemplates");
        } else {
          toast.error("No changes made to the template");
        }
      } catch (error) {
        toast.error("Failed to update template");
      }
    });
  };

  if (isFetching) return <p>Loading template data...</p>;

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
          onClick={saveUpdatedTemplate}
          className="bg-green-600 text-white px-4 py-2 rounded w-full md:w-auto"
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Update Template"}
        </button>
      </div>

      {!isEditorLoaded && (
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-600 border-solid"></div>
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

export default EditEmailTemplate;
