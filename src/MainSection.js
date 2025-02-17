import React, { useEffect, useRef, useState, Link } from "react";
import dotenv from "dotenv";
import { links } from "./utils/links";
import SelectionMenu from "./components/menu/SelectionMenu";

const API_URL = "https://api.unsplash.com/search/photos";
const Image_count = 28;
dotenv.config();

const MainSection = () => {
  const searchInput = useRef(null);
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [bannerImage, setBannerImage] = useState(null);
  const [linkInfo, setlinkInfo] = useState({});

  const fetchImages = async () => {
    try {
      const data = await fetch(
        `${API_URL}?query=${searchInput.current.value}&page=${page}&per_page=${Image_count}&client_id=${process.env.REACT_APP_UNSPLASH_API_KEY}`,
      );
      const json = await data.json();
      setImages(json?.results);
      setTotalPages(json?.total_pages);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClick = (e) => {
    e.preventDefault();
    // console.log(searchInput.current.value);
    images != null ? (
      fetchImages()
    ) : (
      <div className="font-bold text-black">Error</div>
    );
    setPage(1);
  };
  const handleSelection = (selectionIndex) => {
    const selectedLink = links[selectionIndex]
    if (selectedLink) {
      searchInput.current.value = selectedLink.title;
      fetchImages();
      setPage(1);
      setBannerImage(selectedLink.url);
      setlinkInfo(selectedLink);
    } else {
      setBannerImage(null);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [page]);

  return (
    <>
      <div className="flex flex-col justify-center items-center">
        <img
          src="https://i.ibb.co/gSSxMS4/Image-1-removebg-preview.png"
          alt="logo"
          className="w-[120px]"
        />
        <a
          class="fixed top-10 right-10"
          href="https://github.com/Vijaykv5/Image-Searcher"
          target="_blank"
        >
          <i class="fa fa-github fa-2x text-violet-500"></i>
        </a>
        <div className="text-violet-500 text-center font-bold text-5xl my-8 md:mb-28 ">
          Image Search
        </div>
      </div>
      <div className="text-center md:-my-16  -my-4">
        <form onSubmit={handleClick}>
          <input
            className="w-96 h-9 border border-violet-500 hover:border-violet-500 bg-gray-100 rounded-md p-2"
            placeholder=" Try Something Search here ..."
            ref={searchInput}
          />
        </form>
      </div>
      <div className="my-8 md:mt-20 mb-5 mx-auto md:max-w-screen-lg">
        <SelectionMenu links={links} handleSelection={handleSelection} />
      </div>
      <div className="relative h-128">
        {bannerImage && (
          <img
            src={bannerImage}
            alt="Banner"
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute top-10 left-0 p-4 text-white max-w-2xl">
          <h1 className="top-15 font-bold text-left pt-20 px-20 text-5xl">
            {linkInfo?.title}
          </h1>
          <div
            className="px-20 font-light text-slate-200 pt-5"
            dangerouslySetInnerHTML={{ __html: linkInfo?.description }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-5">
        {images.map((image) => {
          return (
            <img
              key={image?.id}
              src={image?.urls?.small}
              className="w-full md:w-80 h-72 rounded-md transform hover:scale-105 duration-200 shadow-lg hover:shadow-md object-cover"
            />
          );
        })}
      </div>
      <div className="flex justify-center mt-8">
        {page > 1 && (
          <button
            onClick={() => setPage(page - 1)}
            className=" p-1 px-2 bg-violet-500 text-white w-fit rounded-md"
          >
            Previous
          </button>
        )}
        {page < totalPages && (
          <button
            onClick={() => setPage(page + 1)}
            className="p-1 px-2 mx-6  bg-violet-500 text-white w-fit rounded-md"
          >
            Next
          </button>
        )}
      </div>
    </>
  );
};

export default MainSection;
