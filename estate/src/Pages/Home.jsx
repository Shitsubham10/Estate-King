import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import Listingitem from '../components/Listingitem';

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  
  SwiperCore.use([Navigation]);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch('/api/listing/get?offer=true&limit=4');
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchRentListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=rent&limit=4');
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=sale&limit=4');
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOfferListings();
  }, []);

  return (
    <div className="bg-gradient-to-b from-blue-50 to-gray-100 min-h-screen">
      {/* Top Section */}
      <div className="flex flex-col gap-8 p-16 sm:p-28 max-w-7xl mx-auto">
        <h1 className="text-slate-700 font-extrabold text-3xl lg:text-5xl tracking-tight">
          Find your next <span className="text-indigo-500">perfect</span> place
          with ease
        </h1>
        <p className="text-gray-500 text-base sm:text-lg leading-relaxed max-w-2xl">
          Estate- King is the best place to find your next perfect place to
          live. We have a wide range of properties for you to choose from.
        </p>
        <Link
          to="/search"
          className="inline-block bg-indigo-600 text-white font-semibold text-sm sm:text-base py-3 px-6 rounded-lg shadow-md hover:bg-indigo-700 hover:shadow-lg transition"
        >
          Let's get started...
        </Link>
      </div>

      {/* Swiper Section (Slider for Offer Listings) */}
      <div className="relative bg-white rounded-lg shadow-lg overflow-hidden">
        <Swiper navigation slidesPerView={1} spaceBetween={10}>
          {offerListings.length > 0 && offerListings.map((listing) => (
            <SwiperSlide key={listing._id}>
              <div
                style={{
                  backgroundImage: `url(${listing.imageUrls[0]})`,
                  backgroundPosition: 'center',
                  backgroundSize: 'cover',
                  height: '500px',
                }}
                className="w-full transition-transform transform hover:scale-105"
              ></div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Listings Section: Offer, Rent, and Sale */}
      <div className="max-w-7xl mx-auto px-4 py-10 space-y-12">
        {offerListings.length > 0 && (
          <div>
            <h2 className="text-3xl font-semibold text-slate-700">Recent Offers</h2>
            <Link
              to="/search?offer=true"
              className="text-indigo-600 hover:underline text-sm font-medium"
            >
              Show more offers
            </Link>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
              {offerListings.map((listing) => (
                <Listingitem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}

        {rentListings.length > 0 && (
          <div>
            <h2 className="text-3xl font-semibold text-slate-700">Recent Places for Rent</h2>
            <Link
              to="/search?type=rent"
              className="text-indigo-600 hover:underline text-sm font-medium"
            >
              Show more places for rent
            </Link>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
              {rentListings.map((listing) => (
                <Listingitem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}

        {saleListings.length > 0 && (
          <div>
            <h2 className="text-3xl font-semibold text-slate-700">Recent Places for Sale</h2>
            <Link
              to="/search?type=sale"
              className="text-indigo-600 hover:underline text-sm font-medium"
            >
              Show more places for sale
            </Link>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
              {saleListings.map((listing) => (
                <Listingitem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
