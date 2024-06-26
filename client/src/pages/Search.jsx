import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListingItem from "../components/ListingItem";

export default function Search() {
  const [sidebardata, setSidebardata] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "create_at",
    order: "desc",
  });
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTerm = urlParams.get("searchTerm");
    const type = urlParams.get("type");
    const parking = urlParams.get("parking");
    const furnished = urlParams.get("furnished");
    const offer = urlParams.get("offer");
    const sort = urlParams.get("sort");
    const order = urlParams.get("order");
    setSidebardata({
      searchTerm: searchTerm || "",
      type: type || "all",
      parking: parking === "true",
      furnished: furnished === "true",
      offer: offer === "true",
      sort: sort || "create_at",
      order: order || "desc",
    });

    const fetchData = async () => {
      try {
        setLoading(true);
        const url = urlParams.toString();
        const res = await fetch(`/api/listing/get?${url}`);
        const data = await res.json();
        if (data.length >= 9) {
          setShowMore(true);
        }
        setListings(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };
    fetchData();
  }, [window.location.search]);

  const handleChange = (e) => {
    if (e.target.id === "searchTerm") {
      setSidebardata({
        ...sidebardata,
        searchTerm: e.target.value,
      });
    }
    if (
      e.target.id === "all" ||
      e.target.id === "rent" ||
      e.target.id === "sale"
    ) {
      setSidebardata({
        ...sidebardata,
        type: e.target.id,
      });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setSidebardata({
        ...sidebardata,
        [e.target.id]: e.target.checked || e.target.checked === "true",
      });
    }
    if (e.target.id === "sort_order") {
      const [sort, order] = e.target.value.split("_");
      setSidebardata({
        ...sidebardata,
        sort,
        order,
      });
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    for (let key in sidebardata) {
      urlParams.set(key, sidebardata[key]);
    }
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const onShowMoreClick = async () => {
    try {
      const numberOfListings = listings.length;
      const startIndex = numberOfListings;
      const urlParams = new URLSearchParams(window.location.search);
      urlParams.set("startIndex", startIndex);
      const url = urlParams.toString();
      const res = await fetch(`/api/listing/get?${url}`);
      const data = await res.json();
      if (data.length < 9) {
        setShowMore(false);
      }
      setListings([...listings, ...data]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='flex flex-col md:flex-row '>
      <div className='p-7 border-b-2 md:border-r-2 md:min-h-screen'>
        <form className='flex flex-col gap-8' onSubmit={handleSubmit}>
          <div className='flex items-center gap-2'>
            <label className='whitespace-nowrap font-semibold'>
              Search Term:
            </label>
            <input
              type='text'
              id='searchTerm'
              placeholder='Search...'
              className='border rounded-lg p-3 w-full'
              value={sidebardata.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className='flex gap-2 flex-wrap items-center'>
            <label className='font-semibold'>Type:</label>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='all'
                className='w-5'
                onChange={handleChange}
                checked={sidebardata.type === "all"}
              />
              <span>Rent & Sale</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='rent'
                className='w-5'
                onChange={handleChange}
                checked={sidebardata.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='sale'
                className='w-5'
                onChange={handleChange}
                checked={sidebardata.type === "sale"}
              />
              <span>Sale</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='offer'
                className='w-5'
                onChange={handleChange}
                checked={sidebardata.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className='flex gap-2 flex-wrap items-center'>
            <label className='font-semibold'>Amenities:</label>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='parking'
                className='w-5'
                onChange={handleChange}
                checked={sidebardata.parking}
              />
              <span>Parking</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='furnished'
                className='w-5'
                onChange={handleChange}
                checked={sidebardata.furnished}
              />
              <span>Furnished</span>
            </div>
          </div>
          <div className='flex gap-2 items-center'>
            <label className='font-semibold'>Sort:</label>
            <select
              id='sort_order'
              className='border rounded-lg p-3'
              onChange={handleChange}
              defaultValue='create_at_desc'
            >
              <option value='regularPrice_desc'>Price high to low</option>
              <option value='regularPrice_asc'>Price low to high</option>
              <option value='createdAt_desc'>Latest</option>
              <option value='createdAt_asc'>Oldest</option>
            </select>
          </div>
          <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>
            Search
          </button>
        </form>
      </div>
      <div className='flex-1'>
        <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-5'>
          Listing Results:
        </h1>
        <div className='flex flex-wrap gap-4 p-7'>
          {!loading && listings.length === 0 && (
            <p className='text-xl text-slate-700 p-3 text-center w-full'>
              No listing found!
            </p>
          )}
          {loading && (
            <p className='text-xl text-slate-700 text-center w-full'>
              Loading...
            </p>
          )}
          {!loading &&
            listings.length > 0 &&
            listings.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))}
          {showMore && (
            <button
              type='button'
              onClick={onShowMoreClick}
              className='text-slate-700 hover: underline p-7 text-center w-full'
            >
              Show More
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
