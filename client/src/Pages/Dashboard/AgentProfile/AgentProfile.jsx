import { useState } from "react";
import { useParams } from "react-router";
import noImage from "../../../assets/noImageAvailable.png";
import { ClipLoader } from "react-spinners";
import { FaCheck } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import { RiErrorWarningLine } from "react-icons/ri";
import { PhotoView } from "react-photo-view";
import { IoCameraOutline } from "react-icons/io5";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  useGetAgentByIdQuery,
  useUpdateAgentMutation,
} from "../../../redux/features/allApis/usersApi/agentsApi";
import { useUpdateUserProfileImageMutation } from "../../../redux/features/allApis/usersApi/usersApi";
import {
  useGetKycByIdQuery,
  useUpdateKycStatusMutation,
} from "../../../redux/features/allApis/kycApi/kycApi";
import { useGetAllPaymentNumbersQuery } from "../../../redux/features/allApis/paymentNumberApi/paymentNumberApi";
import { uploadImage } from "../../../hooks/files";
import CashAgentProfileUserInfo from "../../../Components/Dashboard/AgentProfile/CashAgentProfileUserInfo";

const AgentProfile = () => {
  const { id } = useParams();
  const [selectedSection, setSelectedSection] = useState("userInfo");
  const [selectedImage, setSelectedImage] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const { handleSubmit, reset } = useForm();
  const { data: singleAgent, isLoading: agentLoading } =
    useGetAgentByIdQuery(id);
  const [updateAgent, { isLoading: updateAgentLoading }] =
    useUpdateAgentMutation();
  const [updateProfileImage, { isLoading: isProfileImageLoading }] =
    useUpdateUserProfileImageMutation();
  const { data: singleKyc } = useGetKycByIdQuery(id);
  const [updateKycStatus, { isLoading: isKycLoading }] =
    useUpdateKycStatusMutation();
  const { data: allPaymentNumber } = useGetAllPaymentNumbersQuery();

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setSelectedImage(URL.createObjectURL(file)); // For preview
    }
  };

  const balances = [
    { label: "Main Balance", value: "500 BDT" },
    { label: "Deposit Balance", value: "800 BDT" },
    { label: "Withdraw Balance", value: "1000 BDT" },
    { label: "Support Pin", value: "123456" },
  ];

  const handleKycStatus = async (kycId, newStatus) => {
    if (!newStatus) return;
    try {
      const response = await updateKycStatus({ id: kycId, status: newStatus });

      if (response?.data?.message) {
        toast.success(response.data.message);
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      toast.error(error || "An error occurred while updating the status.");
    }
  };

  const onSubmit = async () => {
    if (!profileImage) {
      toast.error("Please upload a profile image");
      return;
    }
    try {
      const frontImagePath = await uploadImage(profileImage);

      const formattedData = {
        id,
        profileImage: frontImagePath.filePath, // This should be the correct path
      };

      const response = await updateProfileImage(formattedData).unwrap();

      if (response) {
        toast.success("Profile image updated successfully");
        reset();
        setProfileImage(null); // Clear state after successful upload
        setSelectedImage(null);
      }
    } catch (error) {
      toast.error(error || "Failed to upload profile image");
    }
  };

  const filteredPaymentNumber = allPaymentNumber?.filter(
    (paymentNumber) => paymentNumber?.userId === id
  );

  return (
    <div className="bg-gray-100 min-h-screen p-2">
      <h1 className="text-center bg-gradient-to-r from-gray-300 to-gray-500 text-lg lg:text-xl font-bold text-white p-4 rounded-md shadow-md mb-6">
        Agent Profile
      </h1>

      <div className="flex flex-col lg:flex-row gap-6 ">
        {/* Left Section */}
        <div className="bg-white w-full lg:w-2/3 rounded-lg shadow-lg p-2 text-nowrap text-center">
          <div className="mb-6">
            <h1 className="text-gray-800 font-bold text-lg md:text-xl mb-2">
              Agent Name:{" "}
              <span className="capitalize">{singleAgent?.fullName}</span>
            </h1>
            <p className="text-gray-500">User Name: {singleAgent?.username}</p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col items-center mb-6"
          >
            <div className="relative w-32 h-32">
              {/* Image Preview */}
              {!singleAgent?.profileImage && agentLoading ? (
                <div className="flex justify-center items-center w-full h-full border-4 border-gray-500 rounded-full">
                  <ClipLoader size={40} color="#4b5563" />
                </div>
              ) : (
                <img
                  className="rounded-full w-full h-full object-cover border-4 border-gray-500"
                  src={
                    selectedImage ||
                    (singleAgent?.profileImage
                      ? `${import.meta.env.VITE_BASE_API_URL}${
                          singleAgent.profileImage
                        }`
                      : noImage)
                  }
                  alt="User Avatar"
                />
              )}

              {/* Camera Icon and Input */}
              <label
                htmlFor="profileImage"
                className="absolute bottom-2 right-2 bg-gray-800 text-white p-2 rounded-full cursor-pointer hover:bg-gray-600"
              >
                <IoCameraOutline className="text-lg" />
                <input
                  id="profileImage"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>

            <button
              type="submit"
              className="bg-[#6b7699f1] text-white rounded-md px-4 py-2 hover:bg-gray-300 mt-4"
              disabled={isProfileImageLoading}
            >
              {isProfileImageLoading ? "Uploading..." : "Upload New Photo"}
            </button>
          </form>

          {/* Balance Section */}
          <div className="space-y-4">
            {balances.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-100 p-2 rounded-md"
              >
                <p className="text-gray-600 font-semibold">{item.label}</p>
                <p className="text-green-600 font-bold ml-2">{item.value}</p>
              </div>
            ))}
            {filteredPaymentNumber?.length !== 0 && (
              <div className="px-2">
                <p className="text-left">Payment Methods & Numbers:</p>
              </div>
            )}

            {filteredPaymentNumber?.map((paymentNum, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-100 p-2 rounded-md"
              >
                <p className="text-gray-600 font-semibold capitalize">
                  {paymentNum?.paymentNumberMethod}
                </p>
                <div className="flex flex-row items-center gap-2">
                  <p
                    className={`font-bold ml-2 ${
                      paymentNum?.status === "reject"
                        ? "line-through text-red-600"
                        : paymentNum?.status === "pending"
                        ? "text-gray-400"
                        : "text-green-600"
                    }`}
                  >
                    {paymentNum?.paymentNumber}
                  </p>
                  <p
                    className={`${
                      paymentNum?.status === "pending"
                        ? "bg-yellow-400"
                        : paymentNum?.status === "approve"
                        ? "bg-green-400"
                        : "bg-red-400"
                    } text-capitalize text-xs px-3 rounded-full`}
                  >
                    {paymentNum?.status === "pending"
                      ? "Pending"
                      : paymentNum?.status === "approve"
                      ? "Approved"
                      : "Rejected"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Section */}
        <div className="bg-white w-full lg:w-2/3 rounded-lg shadow-lg p-6">
          <h2 className="text-center text-xl text-gray-800 font-semibold mb-6">
            Edit Agent Profile
          </h2>

          <div className="flex sm:flex-row flex-col justify-center gap-2 mb-6 text-nowrap">
            <button
              onClick={() => setSelectedSection("userInfo")}
              className={`p-2 rounded-md transition-all ${
                selectedSection === "userInfo"
                  ? "bg-[#6b7699f1] text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              User Info
            </button>
            <button
              onClick={() => setSelectedSection("transactionHistory")}
              className={`p-2 rounded-md transition-all ${
                selectedSection === "transactionHistory"
                  ? "bg-[#6b7699f1] text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              Transaction History
            </button>
            <button
              onClick={() => setSelectedSection("kycUpdate")}
              className={`p-2 rounded-md transition-all ${
                selectedSection === "kycUpdate"
                  ? "bg-[#6b7699f1] text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              KYC Update
            </button>
          </div>

          {selectedSection === "userInfo" && (
            <CashAgentProfileUserInfo
              id={id}
              singleUser={singleAgent}
              updateUser={updateAgent}
              isLoading={updateAgentLoading}
            />
          )}

          {selectedSection === "transactionHistory" && (
            <div className="text-center text-gray-600">
              No transactions available.
            </div>
          )}

          {selectedSection === "kycUpdate" && (
            <div>
              <div className="flex flex-col items-center justify-center bg-white pt-5">
                <div>
                  <h2 className="text-lg font-semibold text-center mb-4 capitalize">
                    Agent NID for KYC Verification
                  </h2>

                  <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="mb-6">
                      <label className="block text-sm font-medium mb-2">
                        Front Side
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center">
                        {singleKyc?.frontImage ? (
                          <PhotoView
                            src={`${import.meta.env.VITE_BASE_API_URL}${
                              singleKyc?.frontImage
                            }`}
                          >
                            <img
                              src={`${import.meta.env.VITE_BASE_API_URL}${
                                singleKyc?.frontImage
                              }`}
                              alt="nid front image"
                              className="w-full h-40 object-cover rounded-lg cursor-pointer"
                            />
                          </PhotoView>
                        ) : (
                          <span className="text-gray-500">
                            No image uploaded
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium mb-2">
                        Back Side
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center">
                        {singleKyc?.backImage ? (
                          <PhotoView
                            src={`${import.meta.env.VITE_BASE_API_URL}${
                              singleKyc?.backImage
                            }`}
                          >
                            <img
                              src={`${import.meta.env.VITE_BASE_API_URL}${
                                singleKyc?.backImage
                              }`}
                              alt="nid front image"
                              className="w-full h-40 object-cover rounded-lg cursor-pointer"
                            />
                          </PhotoView>
                        ) : (
                          <span className="text-gray-500">
                            No image uploaded
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {singleKyc && (
                    <div className="mb-6">
                      <div className="p-4 border rounded-md shadow-sm bg-gray-50">
                        <h3 className="font-semibold text-gray-700 text-lg mb-2 flex items-center space-x-2">
                          <span>Status Info:</span>
                          {isKycLoading && (
                            <ClipLoader size={18} color="#000000" />
                          )}
                        </h3>
                        {!isKycLoading && (
                          <div
                            className={`flex items-start p-3 border-l-4 rounded-md ${
                              singleKyc?.status === "approve"
                                ? "border-green-500 bg-green-50"
                                : singleKyc?.status === "reject"
                                ? "border-red-500 bg-red-50"
                                : "border-yellow-500 bg-yellow-50"
                            }`}
                          >
                            <div className="mr-3 mt-1">
                              {singleKyc?.status === "approve" && (
                                <FaCheck className="text-2xl text-green-600" />
                              )}
                              {singleKyc?.status === "reject" && (
                                <IoMdClose className="text-2xl text-red-600" />
                              )}
                              {singleKyc?.status === "pending" && (
                                <RiErrorWarningLine className="text-2xl text-yellow-600" />
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-lg">
                                {singleKyc?.status === "approve" && "Approved"}
                                {singleKyc?.status === "reject" && "Rejected"}
                                {singleKyc?.status === "pending" &&
                                  "Pending Review"}
                              </p>
                              <p className="text-gray-600 mt-1">
                                {singleKyc?.status === "approve" &&
                                  "KYC approved. No action needed."}
                                {singleKyc?.status === "reject" &&
                                  "KYC rejected. Review the reason."}
                                {singleKyc?.status === "pending" &&
                                  "KYC under review. Take action."}
                              </p>
                              {singleKyc?.status === "reject" && (
                                <div className="mt-2 text-sm text-gray-700">
                                  <p>
                                    <span className="font-semibold">
                                      Reason:
                                    </span>{" "}
                                    Photo not clear.
                                  </p>
                                  <p className="mt-2">
                                    <span className="font-semibold">
                                      Action:
                                    </span>{" "}
                                    Request resubmission.
                                  </p>
                                </div>
                              )}
                              {singleKyc?.status === "pending" && (
                                <div className="mt-2 text-sm text-gray-700">
                                  <p>
                                    <span className="font-semibold">Next:</span>{" "}
                                    Verify documents and update status.
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">
                      Update KYC Status
                    </label>
                    <select
                      className="w-full border border-gray-300 rounded-lg p-2"
                      onChange={(e) =>
                        handleKycStatus(singleKyc?._id, e.target.value)
                      }
                    >
                      <option value="">Select Status</option>
                      <option value="approve">Approve</option>
                      <option value="reject">Reject</option>
                    </select>
                  </div>

                  {/* <button
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold"
                    onClick={() => {
                      if (status) {
                        alert(
                          `Images submitted successfully with status: ${status}`
                        );
                      } else {
                        alert("Please select a status before submitting.");
                      }
                    }}
                  >
                    Submit
                  </button> */}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentProfile;
