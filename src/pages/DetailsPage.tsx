import { useRef, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const DetailsPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  if (!state) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">No details available.</p>
          <Button onClick={() => navigate("/list")}>Back to List</Button>
        </div>
      </div>
    );
  }

  const employee = state as { name: string; position: string; office: string; extn: string; startDate: string; salary: string; photo: string };
  const entries: [string, string][] = [
    ["Name", employee.name],
    ["Position", employee.position],
    ["Office", employee.office],
    ["Extension", employee.extn],
    ["Start Date", employee.startDate],
    ["Salary", employee.salary],
  ];

  const openCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      setCameraOpen(true);
      setTimeout(() => {
        if (videoRef.current) videoRef.current.srcObject = mediaStream;
      }, 100);
    } catch {
      alert("Could not access camera. Please allow camera permissions.");
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);
    const imageData = canvas.toDataURL("image/png");

    stream?.getTracks().forEach((t) => t.stop());
    setStream(null);
    setCameraOpen(false);
    navigate("/photo", { state: { image: imageData } });
  };

  const closeCamera = () => {
    stream?.getTracks().forEach((t) => t.stop());
    setStream(null);
    setCameraOpen(false);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-lg space-y-4">
        <Button variant="ghost" onClick={() => navigate("/list")}>← Back to List</Button>

        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <img
              src={employee.photo}
              alt={employee.name}
              className="h-16 w-16 rounded-full border object-cover"
            />
            <CardTitle>{employee.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {entries.map(([key, value]) => (
              <div key={key} className="flex justify-between border-b py-2 last:border-0">
                <span className="font-medium capitalize text-muted-foreground">{key.replace(/_/g, " ")}</span>
                <span>{value}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {!cameraOpen ? (
          <Button className="w-full" onClick={openCamera}>Capture Photo</Button>
        ) : (
          <div className="space-y-3">
            <video ref={videoRef} autoPlay playsInline className="w-full rounded-md border" />
            <canvas ref={canvasRef} className="hidden" />
            <div className="flex gap-2">
              <Button className="flex-1" onClick={capturePhoto}>Take Photo</Button>
              <Button variant="outline" className="flex-1" onClick={closeCamera}>Cancel</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailsPage;
