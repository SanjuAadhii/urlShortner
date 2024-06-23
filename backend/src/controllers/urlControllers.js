import express from "express";
import Url from "../models/Url.js";
import { nanoid } from "nanoid";

const router = express.Router();

export const shorten = async (req, res) => {
  const { longUrl, userId } = req.body;
  const shortUrl = nanoid(8);
  try {
    const newUrl = new Url({ longUrl, shortUrl, user: userId });
    await newUrl.save();
    res.json(newUrl);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const redirect = async (req, res) => {
  const url = await Url.findOne({ shortUrl: req.params.shortUrl });
  if (url) {
    url.clicks++;
    await url.save();
    return res.redirect(url.longUrl);
  } else {
    return res.status(404).send("URL not found");
  }
};
export const userUrls = async (req, res) => {
  try {
    const urls = await Url.find({ user: req.user.id });
    res.json(urls);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

export const deleteUrl = async (req, res) => {
  const { urlId } = req.params;
  try {
    const url = await Url.findOne({ _id: urlId, user: req.user.id });
    if (!url) {
      return res
        .status(404)
        .send("URL not found or you do not have permission to delete it.");
    }
    await Url.deleteOne({ _id: urlId });
    res.send("URL deleted successfully.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};
