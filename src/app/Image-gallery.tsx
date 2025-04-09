"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@mui/material";
import {
  Card,
  CardMedia,
  Dialog,
  AppBar,
  Toolbar,
  Typography,
  TextField,
  IconButton,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function Gallery() {
  const [images, setImages] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loader = useRef(null);

  const fetchImages = async (pageNumber = 1, append = false) => {
    setLoading(true);
    const pageSize = 20;
    const from = (pageNumber - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data } = await supabase.storage.from("gallery").list("uploads", {
      limit: pageSize,
      offset: from,
    });

    if (data) {
      const urls = await Promise.all(
        data.map(async (file) => {
          const { data: url } = await supabase.storage.from("gallery").getPublicUrl(file.name);
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

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (const file of files) {
      const uniqueName = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
      const filePath = `uploads/${uniqueName}`; // ✅ include folder if needed

      try {
        console.log("Uploading file:", file.name, file);

        const blob = new Blob([file], { type: file.type });

        const { data, error } = await supabase.storage.from("gallery").upload(filePath, blob, {
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
    await supabase.storage.from("gallery").remove([name]);
    setSelected(null);
    setPage(1);
    fetchImages(1);
  };

  const filtered = images.filter((img) => img.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Image Gallery</Typography>
        </Toolbar>
      </AppBar>

      <div className="my-4 flex gap-2 items-center">
        <Button variant="contained" component="label">
          Upload
          <input hidden multiple type="file" onChange={handleUpload} />
        </Button>
        <TextField label="Search" variant="outlined" size="small" onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {filtered.map((img) => (
          <Card key={img.name} onClick={() => setSelected(img)}>
            <CardMedia component="img" image={img.url} alt={img.name} height="140" />
          </Card>
        ))}
      </div>

      {loading && (
        <div className="flex justify-center my-4">
          <CircularProgress />
        </div>
      )}
      <div ref={loader} className="h-10" />

      <Dialog open={!!selected} onClose={() => setSelected(null)} maxWidth="md">
        {selected && (
          <div className="p-4">
            <img src={selected.url} alt={selected.name} className="max-w-full max-h-[80vh]" />
            <div className="flex justify-end mt-2">
              <IconButton color="error" onClick={() => handleDelete(selected.name)}>
                <DeleteIcon />
              </IconButton>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}
