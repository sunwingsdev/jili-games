import { useState } from "react";
import toast from "react-hot-toast";
import {
  useDeletePromotionMutation,
  useGetPromotionsQuery,
} from "../../../redux/features/allApis/promotionApi/promotionApi";
import { deleteImage } from "../../../hooks/files";
import AddPromotionSection from "../../../Components/Dashboard/PromotionOffer/AddPromotionSection";
import PromotionCategoriesSection from "../../../Components/Dashboard/PromotionOffer/PromotionCategoriesSection";
import PromotionOfferCard from "../../../Components/Dashboard/PromotionOffer/PromotionOfferCard";
import DeleteModal from "../../../Components/Shared/DeleteModal";

const PromotionOffer = () => {
  const { data: promotions, isLoading, refetch } = useGetPromotionsQuery();
  const [deletePromotion] = useDeletePromotionMutation();
  const [item, setItem] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleDeleteButtonClick = (item) => {
    setIsOpen(true);
    setItem(item);
  };

  const handleDelete = async () => {
    try {
      const { message } = await deleteImage(item?.image);
      if (message) {
        const result = await deletePromotion(item?._id);
        if (result.data) {
          toast.success("Promotion deleted successfully");
        }
        refetch();
        setIsOpen(false);
      }
    } catch (error) {
      toast.error(error || "Failed to delete promotion");
    }
  };

  return (
    <>
      <div className="rounded-md">
        <div className="bg-[#222222] flex flex-col md:flex-row items-start md:items-center justify-between p-4 mb-2">
          <div className="flex flex-row items-start justify-between w-full mb-4 md:mb-0">
            <h1 className="text-2xl text-white font-bold">Promotion Offers</h1>
          </div>
        </div>

        <div className="flex flex-col md:flex-row lg:space-x-6">
          <AddPromotionSection />
          <PromotionCategoriesSection />
        </div>

        <div className="mt-6">
          <div className="bg-[#222222] w-full mb-4 md:mb-0 p-4">
            <h1 className="text-2xl text-white font-bold">All Offers</h1>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 my-4 mt-4">
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              promotions?.map((promotion) => (
                <PromotionOfferCard
                  key={promotion?._id}
                  offer={promotion}
                  hidden={true}
                  handleDeleteButtonClick={handleDeleteButtonClick}
                />
              ))
            )}
          </div>
        </div>
      </div>

      <DeleteModal
        isOpen={isOpen}
        closeModal={() => setIsOpen(false)}
        handleDelete={handleDelete}
      ></DeleteModal>
    </>
  );
};

export default PromotionOffer;
