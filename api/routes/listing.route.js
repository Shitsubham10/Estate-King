import express from "express";
import { createListing , deleteListing, updateListing, getListing , getListings} from "../controller/listing.controller.js";
import { verifyToken } from "../utils/verifyuser.js";

const router = express.Router();
// route to create listing
 router.post('/create',verifyToken, createListing);
 // to delete the listing
 router.delete('/delete/:id',verifyToken,deleteListing);
 // to update the listing
 router.post('/update/:id',verifyToken, updateListing);
 //to get all the listing
 router.get('/get/:id',getListing);
 //to search the listing
 router.get('/get',getListings)

 export default router;