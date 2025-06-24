import toast from "react-hot-toast";
import {
  useGetAllEmailTemplatesQuery,
  useDeleteEmailTemplateMutation,
} from "../../../redux/features/allApis/emailTemplateApi/emailTemplateApi";
import { Link } from "react-router";
import Swal from "sweetalert2";

const AllEmailTemplates = () => {
  const {
    data: templates,
    isLoading,
    isError,
  } = useGetAllEmailTemplatesQuery();

  const [deleteEmailTemplate, { isLoading: isDeleting }] =
    useDeleteEmailTemplateMutation();

  const formatTemplateName = (name) => {
    return name
      .replace(/([a-z])([A-Z])/g, "$1 $2") // insert space before capital letters
      .replace(/[^a-zA-Z0-9]/g, " ") // replace symbols (if any) with space
      .replace(/\s+/g, " ") // collapse multiple spaces
      .trim()
      .replace(/^[a-z]/, (c) => c.toUpperCase()) // capitalize first letter
      .replace(/\b\w/g, (c) => c.toUpperCase()); // capitalize every word
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Confirm Deletion",
      text: "This action cannot be undone. Do you want to Delete?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      focusCancel: true,

      // Custom button colors
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",

      // Custom styling
      customClass: {
        popup: "rounded-xl p-6",
        title: "text-lg font-semibold text-gray-800",
        htmlContainer: "text-sm text-gray-600",
        actions: "flex justify-end gap-4 mt-4",
        confirmButton:
          "bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600",
        cancelButton:
          "bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300",
      },

      buttonsStyling: false,
      backdrop: true,
      background: "#f9fafb",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await deleteEmailTemplate(id);
      if (res.data.deletedCount > 0) {
        toast.success(res.data.message || "Deleted Successfully");
      }
    } catch (error) {
      toast.success(error || "Failed to delete template");
    }
  };

  if (isLoading) return <p>Loading templates...</p>;
  if (isError) return <p>Failed to load templates.</p>;

  return (
    <div>
      <div className="bg-[#222222] flex flex-col md:flex-row items-start md:items-center justify-between p-4 mb-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between w-full mb-4 md:mb-0 gap-4 md:gap-0">
          <h1 className="text-2xl text-white font-bold">All Email Templates</h1>
          <Link
            to="/dashboard/emaileditor"
            className="bg-yellow-500 hover:bg-yellow-600 transition-all ease-in-out duration-300 text-black py-2 px-4 rounded md:w-1/7 text-center"
          >
            Create Template
          </Link>
        </div>
      </div>
      {templates?.length === 0 ? (
        <p>No templates found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates?.map((template) => (
            <div
              key={template?._id}
              className="border rounded-lg p-4 shadow bg-white space-y-4"
            >
              <h3 className="text-lg font-bold">
                {formatTemplateName(template?.name)}
              </h3>
              <p className="text-sm text-gray-500">{template?.subject}</p>

              <div className="border p-2 rounded bg-gray-50 overflow-auto max-h-64">
                <div dangerouslySetInnerHTML={{ __html: template?.html }} />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 justify-end mt-2">
                <Link
                  to={`/dashboard/editemailtemplate/${template._id}`}
                  className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded transition"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(template._id)}
                  disabled={isDeleting}
                  className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllEmailTemplates;
