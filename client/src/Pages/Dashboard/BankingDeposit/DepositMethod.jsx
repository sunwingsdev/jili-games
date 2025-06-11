import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import {
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlineRollback,
} from "react-icons/ai";
import { IoReloadOutline } from "react-icons/io5";
import { Link } from "react-router";
import toast from "react-hot-toast";
import {
  useDeletePaymentMethodMutation,
  useGetPaymentMethodsQuery,
  useUpdatePaymentMethodMutation,
} from "../../../redux/features/allApis/paymentMethodApi/paymentMethodApi";
import { deleteImage } from "../../../hooks/files";
import AddDepositMethodForm from "../../../Components/Dashboard/BankingDeposit/AddDepositMethodForm";
import DeleteModal from "../../../Components/Shared/DeleteModal";

const DepositMethod = () => {
  const { data: gateways } = useGetPaymentMethodsQuery();
  const [deleteGateway, { isLoading }] = useDeletePaymentMethodMutation();
  const [updateStatus] = useUpdatePaymentMethodMutation();
  const [item, setItem] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [addNewMethod, setAddNewMethod] = useState(false);
  const filteredGateways = gateways?.filter(
    (gateway) => gateway.paymentType === "deposit"
  );

  const handleOpenModal = (item) => {
    setIsOpen(true);
    setItem(item);
  };

  const handleDelete = async () => {
    const { message } = await deleteImage(item?.image);
    if (message) {
      const result = await deleteGateway(item?._id);
      if (result.error) {
        toast.error("Failed to delete the payment method.");
        return;
      }
      if (result.data.deletedCount > 0) {
        toast.success("Payment method deleted successfully.");
        setIsOpen(false);
      }
    } else {
      toast.error("Image not deleted");
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    const statusInfo = {
      id,
      data: {
        status: newStatus,
      },
    };

    const result = await updateStatus(statusInfo);
    if (result.error) {
      toast.error(result.error.data.error || "Something went wrong");
    } else if (result.data.modifiedCount > 0) {
      toast.success("Status updated successfully.");
    }
  };

  return (
    <>
      {!addNewMethod ? (
        <section className="bg-[#F3F3F9] p-6">
          <div className="w-full bg-white p-4">
            <h1 className="text-2xl font-semibold text-gray-800 mb-6">
              Manual Gateways
            </h1>
            <div className="flex justify-between items-center mb-4">
              <div className="relative w-1/2">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <FiSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
              </div>
              <button
                onClick={() => setAddNewMethod(true)}
                className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-[3px] focus:outline-none"
              >
                + Add New
              </button>
            </div>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-green-700 text-white">
                  <th className="py-3 px-4 text-left">Gateway</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredGateways?.map((gateway) => (
                  <tr
                    key={gateway?._id}
                    className="border-b border-x border-slate-500"
                  >
                    <td className="py-1 px-4">
                      <img
                        className="size-12 inline-flex items-center gap-2"
                        src={`${import.meta.env.VITE_BASE_API_URL}${
                          gateway?.image
                        }`}
                        alt=""
                      />
                      <span className="ps-2">{gateway?.method}</span>
                    </td>
                    <td className="py-1 px-4">
                      <div className="flex items-center">
                        <span
                          className={`h-2 w-2 ${
                            gateway?.status === "active"
                              ? "bg-green-500"
                              : "bg-red-500"
                          } rounded-full mr-2`}
                        />
                        <select
                          value={gateway?.status}
                          onChange={(e) =>
                            handleUpdateStatus(gateway._id, e.target.value)
                          }
                          className={`text-sm capitalize border rounded px-2 py-1 focus:outline-none ${
                            gateway?.status === "active"
                              ? "text-green-700 border-green-500"
                              : "text-red-700 border-red-500"
                          }`}
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                    </td>

                    <td className="py-1 px-4 mx-auto">
                      <div className="flex items-center justify-center">
                        {isLoading ? (
                          <IoReloadOutline className="animate-spin" />
                        ) : (
                          <div className="flex items-center gap-4">
                            <Link
                              to={`/dashboard/edit-depositmethod/${gateway?._id}`}
                              className={`${
                                gateway?.status === "inactive"
                                  ? ""
                                  : "invisible"
                              }`}
                            >
                              <AiOutlineEdit
                                title="Edit"
                                className="text-3xl text-blue-600 hover:text-blue-800 hover:cursor-pointer"
                              />
                            </Link>

                            <AiOutlineDelete
                              title="Delete"
                              onClick={() => handleOpenModal(gateway)}
                              className="text-3xl text-red-600 hover:text-red-800 hover:cursor-pointer"
                            />
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : (
        <section className="p-6">
          <button
            onClick={() => setAddNewMethod(false)}
            className="flex items-center text-gray-500 hover:text-blue-600 hover:underline focus:outline-none"
          >
            <AiOutlineRollback className="mr-1" /> Back
          </button>
          <AddDepositMethodForm />
        </section>
      )}

      <DeleteModal
        closeModal={() => setIsOpen(false)}
        isOpen={isOpen}
        handleDelete={handleDelete}
      />
    </>
  );
};

export default DepositMethod;
