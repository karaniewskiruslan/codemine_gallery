"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CircularProgress } from "@mui/material";
import Header from "codemine_task/components/Header";
import Footer from "codemine_task/components/Footer";
import { ImageType } from "codemine_task/types/Image";
import ImageZoomed from "codemine_task/components/ImageZoomed";
import Gallery from "codemine_task/components/Gallery/Gallery";
import Loading from "codemine_task/components/Loading";
import { Data } from "codemine_task/types/data";
import PaginationContainer from "codemine_task/components/Pagination";
import { deleteImage, fetchImages, uploadImage } from "codemine_task/lib/server-actions";
import { PAGE_SIZE } from "codemine_task/constant/constants";

type Props = {
  initialData: Data;
};

const ImageGallery = ({ initialData }: Props) => {
  const [selected, setSelected] = useState<ImageType | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [data, setData] = useState<ImageType[]>(initialData.data || []);
  const [total, setTotal] = useState<ImageType[]>(initialData.total || []);
  const loader = useRef<HTMLDivElement>(null);

  const refreshData = useCallback(async () => {
    setIsFetching(true);
    try {
      const result = await fetchImages(page);
      setData(result.data);
      setTotal(result.total);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsFetching(false);
    }
  }, [page]);

  const handleUpload = useCallback(
    async (files: FileList) => {
      setIsLoading(true);
      try {
        for (const file of Array.from(files)) {
          const formData = new FormData();
          formData.append("file", file);
          await uploadImage(formData);
        }
        setPage(1);
        await refreshData();
      } catch (error) {
        console.error("Error uploading file:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [refreshData, setPage]
  );

  const handleDelete = useCallback(
    async (name: string) => {
      setIsLoading(true);
      try {
        await deleteImage(name);
        setSelected(null);
        setPage(1);
        await refreshData();
      } catch (error) {
        console.error("Error deleting image:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [refreshData, setPage, setSelected]
  );

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  useEffect(() => {
    const el = loader.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const filtered = data.filter((img: ImageType) => img.name.toLowerCase().includes(search.toLowerCase()));
  const totalCount = total.length || 0;
  const pages = Math.ceil(totalCount / PAGE_SIZE);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div id="root">
      <Header />

      <main className="flex flex-col xl:px-12 xl:py-6 px-4 py-2 gap-6 relative">
        <Gallery
          filtered={filtered}
          loader={loader}
          onClickUpload={async (e) => {
            if (e.target.files) handleUpload(e.target.files);
          }}
          onChangeSearch={(e) => setSearch(e.target.value)}
          onClickSelect={setSelected}
        />

        {isFetching && (
          <div className="flex justify-center mt-4">
            <CircularProgress size={24} />
          </div>
        )}

        {!isFetching && pages !== 1 && <PaginationContainer page={page} pages={pages} setPage={setPage} />}
      </main>

      <Footer />

      <ImageZoomed
        selected={selected}
        onClickDelete={(name) => handleDelete(name)}
        onClickUnselect={() => setSelected(null)}
      />
    </div>
  );
};

export default ImageGallery;
