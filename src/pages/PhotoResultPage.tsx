import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const PhotoResultPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const image = (state as { image?: string })?.image;

  if (!image) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">No photo captured.</p>
          <Button onClick={() => navigate("/list")}>Back to List</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-lg space-y-4">
        <h1 className="text-2xl font-bold">Captured Photo</h1>
        <img src={image} alt="Captured" className="w-full rounded-md border" />
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={() => navigate(-1)}>Back to Details</Button>
          <Button className="flex-1" onClick={() => navigate("/list")}>Back to List</Button>
        </div>
      </div>
    </div>
  );
};

export default PhotoResultPage;
