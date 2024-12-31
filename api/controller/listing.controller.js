// import Listing from "../models/listing.model.js";

// export const createListing = async (req, res, next) => {
//   try {
//     const listing = await Listing.create(req.body);
//     return res.status(201).json(listing);
//   } catch (error) {
//     next(error);
//   }
// };

// import Listing from "../models/listing.model.js";

// export const createListing = async (req, res, next) => {
//   try {
//     // Add the user reference to the body of the listing before creating it
//     const newListingData = {
//       ...req.body,
//       userRef: req.user._id, // Assuming req.user is populated by the verifyToken middleware
//     };

//     const listing = await Listing.create(newListingData);

//     // Return the newly created listing
//     return res.status(201).json(listing);
//   } catch (error) {
//     next(error); // Pass the error to the next middleware (error handler)
//   }
// };
import { errorHandler } from "../utils/error.js";
import Listing from '../models/listing.model.js';
import User from "../models/user.model.js";


export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};
export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(errorHandler(404, 'Listing not found!'));
  }

  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, 'You can only delete your own listings!'));
  }

  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json('Listing has been deleted!');
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(errorHandler(404, 'Listing not found!'));
  }
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, 'You can only update your own listings!'));
  }

  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};
export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing){
      return next(errorHandler(404, 'Listing not found!'));
    }
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};
export const getListings = async (req, res, next) => {
   try {
      //limit the listing to 9
      const limit = parseInt(req.query.limit) || 9;
      //get the starting index of the page
      const startIndex = (parseInt(req.query.page) || 0);
      //see the offer status
      let offer = req.query.offer;
      if(offer === undefined || offer === 'false'){
        offer = { $in: [true, false] };
      }
      //for furnished status
      let furnished = req.query.furnished;
      if(furnished === undefined || furnished === 'false'){
        furnished = { $in: [true, false] };
      }
      //for parking status
      let parking = req.query.parking;
      if(parking === undefined || parking === 'false'){
        parking = { $in: [true, false] };
      }
      //for type of listing
      let type = req.query.type;
      if(type === undefined || type === 'all'){
        type = { $in: ['rent', 'sale'] };
      }

      //get the search term
      const serchTerm = req.query.serchTerm || '';
      //sort the listing
      const sort = req.query.sort || 'createdAt';
      //sort the order
      const order = req.query.order || 'desc';

      //get the listings
      const listings = await Listing.find({
        name: { $regex: serchTerm, $options: 'i' },
        offer,
        furnished,
        parking,
        type,
      }).sort(
        { [sort]: order }
      )
      .limit(limit).skip(startIndex );

      //return the listings
      res.status(200).json(listings);
   } catch (error) {
     next(error);
   }

};