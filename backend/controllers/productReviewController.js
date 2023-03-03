const Product = require("../models/productModel");

//CREATE REVIEW BY USER
const createProductReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    if (!productId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "ProductId rating and comment are required",
      });
    }

    const review = {
      user: req.user._id,
      name: req.user.name,
      comment,
      rating,
    };

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(400).json({
        success: false,
        message: "Product is not found with this ProductId",
      });
    }

    const Reviewed = await product.Reviews.find(
      (rev) => rev.user.toString() === req.user._id.toString()
    );

    if (Reviewed) {
      product.Reviews.forEach((rev) => {
        if (rev.user.toString() === req.user._id.toString()) {
          rev.comment = comment;
          rev.rating = rating;
        }
      });
    } else {
      product.Reviews.push(review);
      product.numOfReviews = product.Reviews.length;
    }

    //Ratings
    let totalRating = 0;
    product.Reviews.forEach((rev) => {
      totalRating += rev.rating;
    });

    //putting the values for average rating
    product.ratings = totalRating / product.Reviews.length;

    await product.save({ validateBeforeSave: false });

    res.status(201).json({
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

//GET PRODUCT REVIEWS
const getProductReview = async (req, res) => {
  try {
    const product = await Product.findById(req.query.ProductId);
    if (!product) {
      return res.status(400).json({
        success: false,
        message: "Product is not found with this ProductId",
      });
    }
    res.status(200).json({
      success: true,
      Reviews: product.Reviews,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

//DELETE PRODUCT REVIEW
const deleteReview = async (req, res) => {
  try {
    const product = await Product.findById(req.query.ProductId);
    if (!product) {
      return res.status(400).json({
        success: false,
        message: "Product is not found with this ProductId",
      });
    }

    //new reviews array
    const filteredReveiws = product.Reviews.filter(
      (rev) => rev._id.toString() !== req.query.reviewId.toString()
    );

    product.Reviews = filteredReveiws

    let filteredReveiwsLength = filteredReveiws.length;

    product.numOfReviews = filteredReveiwsLength;

    //total rating
    let totalRating = 0;
    filteredReveiws.forEach((rev) => {
      totalRating += rev.rating;
    });

    if (filteredReveiwsLength === 0) {
        product.ratings =0
        
    } else {
        product.ratings = totalRating / filteredReveiwsLength;
        
    }

    await product.save({ validateBeforeSave: false });

    res.status(201).json({
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = { createProductReview, getProductReview, deleteReview };
