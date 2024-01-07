import productModel from "../models/productModel.js";
import slugify from "slugify";
import fs from "fs";

export const createProductController = async (req, res) => {
  try {
    const { name, description, price, quantity, shipping } = req.fields;
    const { photo } = req.files;

    //validation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is required" });
      case !description:
        return res.status(500).send({ error: "Description is required" });
      case !price:
        return res.status(500).send({ error: "Price is required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is required" });
      case !shipping:
        return res.status(500).send({ error: "Shipping is required" });
      case !photo && photo.size > 1000000:
        return res.status(500).send({
          error: "Photo is required and should be less than 1Mb",
        });
    }

    const products = new productModel({ ...req.fields, slug: slugify(name) });
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product created successful",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in creating product",
    });
  }
};

export const getProductController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate("category")
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      totalcount: products.length,
      message: "AllProducts",
      products,
    });
  } catch (error) {
    console.log(error);
    res.staus(500).send({
      success: false,
      message: "Error in getting the products",
      error,
    });
  }
};

//get single product
export const getSingleProductController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .populate("category")
      .select("-photo");
    res.status(200).send({
      success: true,
      message: "Single product fetched",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error get single product",
      error,
    });
  }
};

//get photo
export const getPhotoController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).select("photo");
    if (product.photo.data) {
      res.set("Content-type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting Photo",
      error,
    });
  }
};

//delete product
export const deletePoductController = async (req, res) => {
  try {
    await productModel.findOneAndDelete(res.params.pid).select("-photo");
    res.status(200).send({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: true,
      message: "Error in deleting the product",
      error,
    });
  }
};

//update product
export const updateProductController = async (req, res) => {
  try {
    const { name, description, price, quantity, shipping } = req.fields;
    const { photo } = req.files;

    //validation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is required" });
      case !description:
        return res.status(500).send({ error: "Description is required" });
      case !price:
        return res.status(500).send({ error: "Price is required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is required" });
      case !shipping:
        return res.status(500).send({ error: "Shipping is required" });
      case !photo && photo.size > 1000000:
        return res.status(500).send({
          error: "Photo is required and should be less than 1Mb",
        });
    }

    const products = await productModel.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product updated successful",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in updating the product",
      error,
    });
  }
};
