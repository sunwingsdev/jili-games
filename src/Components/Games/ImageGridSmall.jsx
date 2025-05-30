import { useNavigate } from "react-router-dom";


const ImageGridSmall = ({ images, setModalData }) => {
  const navigate = useNavigate();
  const smMdPattern = [1, 2, 2];

  // Split images into chunks based on the pattern for layout
  const chunkImagesByPattern = (arr, pattern) => {
    const chunks = [];
    let i = 0,
      patternIndex = 0;

    while (i < arr.length) {
      const size = pattern[patternIndex];
      chunks.push(arr.slice(i, i + size));
      i += size;
      patternIndex = (patternIndex + 1) % pattern.length;
    }

    return chunks;
  };

  const chunks = chunkImagesByPattern(images, smMdPattern);

  return (
    <div className="flex flex-col gap-4 px-4 md:px-8 mt-8">
      {chunks.map((group, idx) => (
        <div
          key={idx}
          className={`grid gap-4 ${group.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}
        >
          {group.map((item, i) => (
            <div
              key={i}
              className="relative group rounded-lg shadow-md overflow-hidden cursor-pointer"
              
            >
              <img
                src={item.image}
                alt={`game-${idx}-${i}`}
                className="w-full h-48   "
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white text-center px-2 pointer-events-none group-hover:pointer-events-auto">
                <h3 className=" uppercase font-bold mb-3">{item.name}</h3>
                <button
                  onClick={() => setModalData(item)}
                  className="mb-2 bg-bgYellow text-black font-semibold py-1 w-[85%]  rounded-md"
                >
                  Play Now
                </button>
                <button
                onClick={() =>
                navigate(`/game/${item.id}`, {
                  state: { source: "tabImages" },
                })
              }
                className="bg-black whitespace-nowrap w-[85%]  font-semibold py-1 px-4 rounded-md">
                  Game Info
                </button>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ImageGridSmall;
