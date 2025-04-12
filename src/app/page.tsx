import { fetchImages } from "codemine_task/lib/server-actions";
import ImageGallery from "./ImageGallery";

export default async function Home() {
  const initialData = await fetchImages(1);

  return <ImageGallery initialData={initialData} />;
}
