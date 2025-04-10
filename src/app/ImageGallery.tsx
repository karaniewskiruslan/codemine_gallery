"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@mui/material";
import { Card, CardMedia, TextField, CircularProgress } from "@mui/material";
import { supabaseInit } from "codemine_task/lib/supabase";
import Header from "codemine_task/components/Header";
import Footer from "codemine_task/components/Footer";
import { Image } from "codemine_task/types/Image";
import ImageZoomed from "codemine_task/components/ImageZoomed";
import Gallery from "codemine_task/components/Gallery/Gallery";

const ImageGallery = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [selected, setSelected] = useState<Image | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loader = useRef<HTMLDivElement>(null);

  const fetchImages = async (pageNumber = 1, append = false) => {
    setLoading(true);
    const pageSize = 20;
    const from = (pageNumber - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data } = await supabaseInit.storage.from("gallery").list("", {
      limit: pageSize,
      offset: from,
    });

    if (data) {
      const urls = await Promise.all(
        data.map(async (file) => {
          const { data: url } = await supabaseInit.storage.from("gallery").getPublicUrl(file.name);
          return { name: file.name, url: url?.publicUrl };
        })
      );
      if (append) {
        setImages((prev) => [...prev, ...urls]);
      } else {
        setImages(urls);
      }
      setHasMore(data.length === pageSize);
    } else {
      setHasMore(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchImages(nextPage, true);
        }
      },
      { threshold: 1 }
    );
    if (loader.current) observer.observe(loader.current);
    return () => {
      if (loader.current) observer.unobserve(loader.current);
    };
  }, [loader.current, hasMore, loading]);

  const handleSelect = (img: Image | null) => {
    setSelected(img);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (const file of files) {
      const uniqueName = `${file.name.replace(/\s+/g, "_")}`;
      const filePath = `${uniqueName}`;

      try {
        console.log("Uploading file:", file.name, file);

        const blob = new Blob([file], { type: file.type });

        const { data, error } = await supabaseInit.storage.from("gallery").upload(filePath, blob, {
          cacheControl: "3600",
          upsert: true,
        });

        if (error) {
          console.error(`Upload error for file ${file.name}:`, error?.message || error || "Unknown error");
        } else {
          console.log(`Successfully uploaded ${file.name}`, data);
        }
      } catch (err) {
        console.error(`Unexpected error for file ${file.name}:`, err);
      }
    }

    setPage(1);
    await fetchImages(1);
  };

  const handleDelete = async (name: string) => {
    console.log(name);
    const { error } = await supabaseInit.storage.from("gallery").remove([name]);
    if (error) {
      console.error("Delete error:", error.message);
    } else {
      setImages((prev) => prev.filter((img) => img.name !== name));
      handleSelect(null);
      setPage(1);
      fetchImages(1);
    }
  };

  const handleChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const filtered = images.filter((img) => img.name.toLowerCase().includes(search.toLowerCase()));

  if (loading)
    return (
      <div className="flex justify-center my-4">
        <CircularProgress />
      </div>
    );

  return (
    <div id="root">
      <Header />
      <main className="flex flex-col md:px-12 md:py-6 px-4 py-2 gap-6">
        <Gallery
          filtered={filtered}
          loader={loader}
          onClickUpload={handleUpload}
          onChangeSearch={handleChangeSearch}
          onClickSelect={handleSelect}
        />
      </main>
      <Footer />
      <ImageZoomed selected={selected} onClickDelete={handleDelete} onClickUnselect={handleSelect} />
    </div>
  );
};

export default ImageGallery;
