import { useState, Fragment, useMemo } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { FaTimes, FaRegEye, FaRegTrashAlt } from "react-icons/fa";
import { HiOutlineUser } from "react-icons/hi";
import { IoMdBusiness, IoIosSend } from "react-icons/io";
import { MdDateRange, MdEmail, MdInfo } from "react-icons/md";
import {
  useDeleteContactMutation,
  useGetAllUserContactsQuery,
  useSendEmailOnUserContactMutation,
} from "../../../redux/features/allApis/userContactsApi/userContactsApi";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

const UserContacts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContact, setSelectedContact] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [sortOrder, setSortOrder] = useState("latest");

  const { data: allContacts, refetch } = useGetAllUserContactsQuery();
  const [deleteContact] = useDeleteContactMutation();
  const [sendEmail, { isLoading: sendEmailLoading }] =
    useSendEmailOnUserContactMutation();

  // Sort contacts
  const sortedContacts = useMemo(() => {
    if (!allContacts) return [];
    return [...allContacts].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === "latest" ? dateB - dateA : dateA - dateB;
    });
  }, [allContacts, sortOrder]);

  const filteredContacts = sortedContacts?.filter((contact) =>
    [contact?.name, contact?.email, contact?.company].some((field) =>
      field?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredContacts?.length / itemsPerPage);

  const paginatedContacts = filteredContacts?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const toggleSort = () =>
    setSortOrder((prev) => (prev === "latest" ? "oldest" : "latest"));

  const openDetailsModal = (contact) => {
    setSelectedContact(contact);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedContact(null);
  };

  const openEmailModal = () => {
    setShowDetailsModal(false);
    setTimeout(() => setShowEmailModal(true), 300);
  };

  const closeEmailModal = () => {
    setShowEmailModal(false);
    setSelectedContact(null);
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
      await deleteContact(id).unwrap();
      toast.success("Deleted successfully");
      refetch();
    } catch (error) {
      toast.error(error || "Failed to delete");
    }
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();

    if (!selectedContact || !subject || !message) {
      toast.error("Please fill out all fields.");
      return;
    }

    const payload = {
      contactId: selectedContact._id,
      to: selectedContact.email,
      subject,
      html: message,
    };

    try {
      const res = await sendEmail(payload);

      if (res?.data?.message === "Email sent and status updated successfully") {
        toast.success("Email sent successfully!");
        setSelectedContact(null);
        setSubject("");
        setMessage("");
      } else {
        toast.error(res?.data?.error || "Failed to send email.");
      }
    } catch (error) {
      toast.error("Something went wrong while sending email.");
      console.error(error);
    }
  };

  return (
    <div className="">
      <div className="bg-[#222222] flex flex-col md:flex-row items-start md:items-center justify-between p-4 mb-2">
        <div className="flex flex-row items-start justify-between w-full">
          <h1 className="text-2xl text-white font-bold">
            User Contact Queries
          </h1>
        </div>
      </div>
      <div>
        {/* Sort Control */}
        <div className="flex justify-between items-center mb-2">
          {/* Search input */}
          <input
            type="text"
            placeholder="Search by name, email or company"
            className="border border-gray-500 px-3 py-1 rounded text-sm w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <button
            className="bg-indigo-600 text-white px-4 py-1 rounded hover:bg-indigo-700 text-sm"
            onClick={toggleSort}
          >
            Sort: {sortOrder === "latest" ? "Latest" : "Oldest"}
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-blue-600">
            <thead>
              <tr className="bg-blue-600 text-white whitespace-nowrap text-center">
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Company</th>
                <th className="px-4 py-2 border">Query</th>
                <th className="px-4 py-2 border">Mail Date</th>
                <th className="px-4 py-2 border">Replied At</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedContacts?.map((contact) => (
                <tr
                  key={contact?._id}
                  className="even:bg-gray-100 odd:bg-white text-black whitespace-nowrap text-center"
                >
                  <td className="px-4 py-2 border">{contact?.name}</td>
                  <td className="px-4 py-2 border">{contact?.email}</td>
                  <td className="px-4 py-2 border">{contact?.company}</td>
                  <td className="px-4 py-2 border">
                    {contact?.query?.slice(0, 40)}...
                  </td>
                  <td className="px-4 py-2 border">
                    {new Date(contact?.date).toLocaleString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </td>

                  <td className="px-4 py-2 border text-center">
                    {contact?.repliedDate
                      ? new Date(contact.repliedDate).toLocaleString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })
                      : "N/A"}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    <span
                      className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                        contact?.status === "replied"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {contact?.status === "replied"
                        ? "Replied"
                        : "Not Replied"}
                    </span>
                  </td>

                  <td className="px-4 py-2 border space-x-2 text-center">
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      onClick={() => openDetailsModal(contact)}
                    >
                      <FaRegEye />
                    </button>
                    <button
                      onClick={() => handleDelete(contact._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      <FaRegTrashAlt />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="px-4 py-1 bg-gray-300 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-1 bg-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Contact Details Modal */}
      <Transition appear show={showDetailsModal} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeDetailsModal}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-40" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="w-full max-w-2xl transform overflow-hidden rounded-xl bg-white p-6 text-left align-middle shadow-2xl transition-all relative">
                  {/* Close Button */}
                  <button
                    onClick={closeDetailsModal}
                    className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
                  >
                    <FaTimes size={18} />
                  </button>

                  {/* Header */}
                  <DialogTitle
                    as="h3"
                    className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2"
                  >
                    Contact Details
                  </DialogTitle>

                  {/* Contact Info */}
                  <div className="space-y-4 text-sm text-gray-700">
                    <div className="flex items-center gap-3">
                      <HiOutlineUser className="text-blue-500" />
                      <p>
                        <span className="font-semibold">Name:</span>{" "}
                        {selectedContact?.name}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <IoMdBusiness className="text-green-600" />
                      <p>
                        <span className="font-semibold">Company:</span>{" "}
                        {selectedContact?.company}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <MdEmail className="text-red-500" />
                      <p>
                        <span className="font-semibold">Email:</span>{" "}
                        {selectedContact?.email}
                      </p>
                    </div>

                    <div className="flex items-start gap-3">
                      <MdInfo className="text-purple-500 mt-1" />
                      <div className="flex-1">
                        <p className="font-semibold">Query:</p>
                        <div className="bg-gray-100 p-3 rounded text-sm max-h-48 overflow-y-auto whitespace-pre-line">
                          {selectedContact?.query}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <MdDateRange className="text-yellow-600" />
                      <p>
                        <span className="font-semibold">Date:</span>{" "}
                        {new Date(selectedContact?.date).toLocaleString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          }
                        )}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-semibold">Status:</span>
                      <span
                        className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                          selectedContact?.status === "replied"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {selectedContact?.status === "replied"
                          ? "Replied"
                          : "Not Replied"}
                      </span>
                    </div>
                  </div>

                  {/* Action */}
                  <div className="mt-6 text-right">
                    <button
                      className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
                      onClick={openEmailModal}
                    >
                      Send Email
                    </button>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Send Email Modal */}
      <Transition appear show={showEmailModal} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeEmailModal}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-30" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all relative">
                  <button
                    onClick={closeEmailModal}
                    className="absolute top-4 right-4"
                  >
                    <FaTimes className="text-gray-700" />
                  </button>
                  <DialogTitle className="text-xl font-bold mb-4">
                    Send Email to{" "}
                    <span className="text-base italic font-normal">
                      {selectedContact?.email}
                    </span>
                  </DialogTitle>
                  <form className="space-y-4">
                    <div>
                      <label className="block font-semibold mb-2">
                        Subject <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded px-3 py-2"
                        placeholder="Enter subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-2">
                        Message <span className="text-red-600">*</span>
                      </label>
                      <textarea
                        className="w-full border border-gray-300 rounded px-3 py-2 h-40"
                        placeholder="Write your message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                      ></textarea>
                    </div>
                    <div className="flex justify-end gap-4">
                      <button
                        type="button"
                        className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                        onClick={closeEmailModal}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSendEmail}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
                      >
                        {sendEmailLoading ? (
                          "Sending..."
                        ) : (
                          <>
                            Send <IoIosSend />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default UserContacts;
