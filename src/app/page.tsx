import { fetchImages } from "codemine_task/lib/server-actions";
import ImageGallery from "./ImageGallery";

export default async function Home() {
  // Fetch initial data on the server
  const initialData = await fetchImages(1);

  return <ImageGallery initialData={initialData} />;
}
