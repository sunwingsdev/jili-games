import { useNavigate } from "react-router";

const ImageGridLarge = ({ images, setModalData }) => {
  const navigate = useNavigate();
  // Pattern logic to determine how many items in each row
  const getRowIndex = (index) => {
    let count = 0;
    let rowIndex = 0;

    while (count <= index) {
      count += rowIndex % 3 === 2 ? 4 : 3; // every 3rd row has 4 items, others have 3
      rowIndex++;
    }

    return rowIndex - 1;
  };

  // Count how many items came before the current row
  const getStartIndexOfRow = (rowIndex) => {
    let startIndex = 0;
    for (let i = 0; i < rowIndex; i++) {
      startIndex += i % 3 === 2 ? 4 : 3;
    }
    return startIndex;
  };

  // Determine col-span class based on row pattern
  const getColSpanClass = (index) => {
    const rowIndex = getRowIndex(index);
    const rowType = rowIndex % 3; // 0, 1, 2 → repeating pattern
    const startIndex = getStartIndexOfRow(rowIndex);
    const positionInRow = index - startIndex;

    if (
      (rowType === 0 && positionInRow === 0) ||
      (rowType === 1 && positionInRow === 2)
    ) {
      return "col-span-2";
    }
    return "col-span-1";
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-4 md:px-8 mt-8">
      {images.map((item, index) => (
        <div
          key={index}
          className={`relative group rounded-lg shadow-md overflow-hidden cursor-pointer ${getColSpanClass(
            index
          )}`}
        >
          <img
            src={item.image}
            alt={`game-${index}`}
            className="w-full  h-96"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white text-center px-2 pointer-events-none group-hover:pointer-events-auto">
            <h3 className="2xl:text-xl xl:text-lg lg:text-base uppercase font-bold mb-3">
              {item.name}
            </h3>
            <button
              onClick={() => setModalData(item)}
              className="mb-2 bg-bgYellow text-black font-semibold py-1 w-[60%] text-lg rounded-md"
            >
              Play Now
            </button>
            {/* <button className="bg-black whitespace-nowrap w-[60%] text-lg font-semibold py-1 px-4 rounded-md">
              Game Info
            </button> */}
            <button
              onClick={() =>
                navigate(`/game/${item.id}`, {
                  state: { source: "tabImages" },
                })
              }
              className="bg-black whitespace-nowrap w-[60%] text-lg font-semibold py-1 px-4 rounded-md"
            >
              Game Info
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImageGridLarge;
