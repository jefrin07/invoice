import cloudinary from "../configs/cloudinary.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

export const getAllPosters = asyncHandler(async (req, res) => {
  try {
    const result =
      await cloudinary.api.resources_by_asset_folder(
        "10thmaybakers",
        {
          max_results: 100,
        }
      );

    const posters = result.resources.map((resource) => ({
      id: resource.asset_id,
      public_id: resource.public_id,
      image: resource.secure_url,
      width: resource.width,
      height: resource.height,
      created_at: resource.created_at,
      asset_folder: resource.asset_folder,
    }));

    res.status(200).json({
      posters,
    });
  } catch (error) {
    console.error("Error fetching posters:", error);

    res.status(500).json({
      message:
        error.message || "Failed to fetch posters",
    });
  }
});