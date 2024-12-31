
// import User from "../models/user.model.js";
// import { errorHandler } from "../utils/error.js";
// import bcryptjs from 'bcryptjs';
// import Listing from "../models/listing.model.js";

// export const test=(req,res)=>{
//    res.json({
//     message:'Hello world',
//    });
// };

// export const updateUser = async (req, res, next) => {
//    if (req.user.id !== req.params.id)
//      return next(errorHandler(401, 'You can only update your own account!'));
//    try {
//      if (req.body.password) {
//        req.body.password = bcryptjs.hashSync(req.body.password, 10);
//      }
 
//      const updatedUser = await User.findByIdAndUpdate(
//        req.params.id,
//        {
//          $set: {
//            username: req.body.username,
//            email: req.body.email,
//            password: req.body.password,
//            avatar: req.body.avatar,
//          },
//        },
//        { new: true }
//      );
 
//      const { password, ...rest } = updatedUser._doc;
 
//      res.status(200).json(rest);
//    } catch (error) {
//      next(error);
//    }
//  };

//  export const deleteUser = async (req, res, next) => {
//    if (req.user.id !== req.params.id)
//      return next(errorHandler(401, 'You can only delete your own account!'));
//    try {
//      await User.findByIdAndDelete(req.params.id);
//      res.clearCookie('access_token');
//      res.status(200).json('User has been deleted!');
//    } catch (error) {
//      next(error);
//    }
//  }; 

//  export const getUserListings = async (req, res, next) => {
//     // first check user is authenticated or not
//     if (req.user.id === req.params.id) {
//       try {
//         const listings = await Listing.find({userRef: req.params.id});
//         res.status(200).json(listings);
//       } catch (error) {
//         next(error);
//       }
//     }
//     else{
//       return next(errorHandler(401, 'you can view only your own listing'));
//     }
//  }

import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from 'bcryptjs';
import Listing from "../models/listing.model.js";

// Simple test endpoint
export const test = (req, res) => {
  res.json({
    message: 'Hello world',
  });
};

// Update User Information
export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, 'You can only update your own account!'));

  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

// Delete User
export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, 'You can only delete your own account!'));

  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie('access_token');
    res.status(200).json('User has been deleted!');
  } catch (error) {
    next(error);
  }
};


// Get User Listings
export const getUserListings = async (req, res, next) => {
  // Check if the user is authenticated
  if (!req.user) {
    return next(errorHandler(401, 'You must be logged in to view your listings.'));
  }

  // Check if the user is trying to access their own listings
  if (req.user.id === req.params.id) {
    try {
      // Fetch listings for the authenticated user
      const listings = await Listing.find({ userRef: req.params.id });

      // Return the listings if found
      if (!listings) {
        return next(errorHandler(404, 'No listings found for this user.'));
      }

      res.status(200).json(listings);
    } catch (error) {
      next(error); // Pass the error to the error handler middleware
    }
  } else {
    return next(errorHandler(401, 'You can only view your own listings.'));
  }
};

export const getUser = async (req, res, next)=>{
  try {
    const user = await User.findById(req.params.id);
    if (!user){
      return next(errorHandler(404, 'User not found!'));
    }
    const { password: pass, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
}
