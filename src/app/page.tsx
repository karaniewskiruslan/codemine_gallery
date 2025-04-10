import { supabaseInit } from "codemine_task/lib/supabase";
import ImageGallery from "./ImageGallery";

export default function Home() {
  const setNewView = async () => {
    const { data, error } = await supabaseInit.storage.from("gallery").list("photos", {
      limit: 100,
      sortBy: { column: "created_at", order: "desc" },
    });

    if (data) console.log("Passed");
    if (error) console.log("Error:", error);
  };

  setNewView();

  return (
    <>
      <ImageGallery />
    </>
  );
}
