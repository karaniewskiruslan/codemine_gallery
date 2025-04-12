"use server";

import { PAGE_SIZE } from "codemine_task/constant/constants";
import { supabaseInit } from "./supabase";
import { Data } from "codemine_task/types/data";
import { ImageType } from "codemine_task/types/Image";

export const getPublicImageUrls = async (files: { name: string }[]): Promise<ImageType[]> => {
  if (!files || files.length === 0) return [];

  try {
    const urls = await Promise.all(
      files.map(async (file) => {
        const { data: url } = await supabaseInit.storage.from("gallery").getPublicUrl(file.name);

        return {
          name: file.name,
          url: url?.publicUrl || "",
        };
      })
    );
    return urls;
  } catch (error) {
    console.error("Error getting public URLs:", error);
    return [];
  }
};

export const fetchImages = async (page: number): Promise<Data> => {
  try {
    const from = (page - 1) * PAGE_SIZE;

    const { data, error } = await supabaseInit.storage.from("gallery").list("", {
      limit: PAGE_SIZE,
      offset: from,
      sortBy: { column: "created_at", order: "desc" },
    });

    if (error) {
      console.error("Error fetching images:", error);
      return { data: [], total: [] };
    }

    console.log("Fetched data:", data);

    const { data: all, error: allError } = await supabaseInit.storage.from("gallery").list("", {
      limit: 10000,
      sortBy: { column: "created_at", order: "desc" },
    });

    if (allError) {
      console.error("Error fetching all images:", allError);
      return { data: data ? await getPublicImageUrls(data) : [], total: [] };
    }

    if (!data || !all) return { data: [], total: [] };

    const publicUrls = await getPublicImageUrls(data);
    const publicUrlsAll = await getPublicImageUrls(all);

    return { data: publicUrls, total: publicUrlsAll };
  } catch (error) {
    console.error("Unexpected error in fetchImages:", error);
    return { data: [], total: [] };
  }
};

export async function uploadImage(formData: FormData) {
  try {
    const file = formData.get("file") as File;

    if (!file) {
      return { error: "No file provided" };
    }

    const filePath = file.name.replace(/\s+/g, "_");
    const arrayBuffer = await file.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: file.type });

    const { error } = await supabaseInit.storage.from("gallery").upload(filePath, blob, {
      cacheControl: "3600",
      upsert: true,
    });

    if (error) {
      console.error("Error uploading image:", error);
      return { error: error.message };
    }

    const { data: urlData } = await supabaseInit.storage.from("gallery").getPublicUrl(filePath);

    return {
      success: true,
      image: {
        name: filePath,
        url: urlData?.publicUrl || "",
      },
    };
  } catch (error) {
    console.error("Unexpected error in uploadImage:", error);
    return { error: "Failed to upload image" };
  }
}

export async function deleteImage(name: string) {
  if (!name) {
    return { error: "No image name provided" };
  }

  try {
    const { error } = await supabaseInit.storage.from("gallery").remove([name]);

    if (error) {
      console.error("Error deleting image:", error);
      return { error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Unexpected error in deleteImage:", error);
    return { error: "Failed to delete image" };
  }
}
