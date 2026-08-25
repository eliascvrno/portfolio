import { useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function ImageUpload({ value, onChange, label = "Imagen" }: { value: string | null; onChange: (url: string | null) => void; label?: string }) {
  const ref = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const upload = async (file: File) => {
    setUploading(true);
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("portfolio-assets").upload(path, file, { upsert: false });
    if (error) {
      toast.error(error.message);
      setUploading(false);
      return;
    }
    const { data } = await supabase.storage.from("portfolio-assets").createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
    onChange(data?.signedUrl ?? null);
    setUploading(false);
  };

  return (
    <div>
      <div className="text-xs text-muted-foreground mb-1">{label}</div>
      {value ? (
        <div className="relative aspect-video rounded-xl overflow-hidden border border-border">
          <img src={value} alt="" className="w-full h-full object-cover" />
          <button type="button" onClick={() => onChange(null)} className="absolute top-2 right-2 size-7 rounded-full bg-black/60 text-white flex items-center justify-center">
            <X className="size-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => ref.current?.click()}
          disabled={uploading}
          className="w-full aspect-video rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center text-muted-foreground hover:border-white/20 hover:text-foreground transition"
        >
          <Upload className="size-6 mb-2" />
          <span className="text-sm">{uploading ? "Subiendo..." : "Click para subir"}</span>
        </button>
      )}
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
    </div>
  );
}

export function VideoUpload({ value, onChange, label = "Video" }: { value: string | null; onChange: (url: string | null) => void; label?: string }) {
  const ref = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const upload = async (file: File) => {
    if (file.size > 50 * 1024 * 1024) {
      toast.error("El video no puede superar 50MB");
      return;
    }
    setUploading(true);
    const ext = file.name.split(".").pop() ?? "mp4";
    const path = `videos/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("portfolio-assets").upload(path, file, { upsert: false, contentType: file.type || "video/mp4" });
    if (error) {
      toast.error(error.message);
      setUploading(false);
      return;
    }
    const { data } = await supabase.storage.from("portfolio-assets").createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
    onChange(data?.signedUrl ?? null);
    setUploading(false);
  };

  return (
    <div>
      <div className="text-xs text-muted-foreground mb-1">{label}</div>
      {value ? (
        <div className="relative aspect-video rounded-xl overflow-hidden border border-border bg-black">
          <video src={value} autoPlay muted loop playsInline className="w-full h-full object-cover" />
          <button type="button" onClick={() => onChange(null)} className="absolute top-2 right-2 size-7 rounded-full bg-black/60 text-white flex items-center justify-center">
            <X className="size-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => ref.current?.click()}
          disabled={uploading}
          className="w-full aspect-video rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center text-muted-foreground hover:border-white/20 hover:text-foreground transition"
        >
          <Upload className="size-6 mb-2" />
          <span className="text-sm">{uploading ? "Subiendo..." : "Click para subir video (MP4)"}</span>
        </button>
      )}
      <input ref={ref} type="file" accept="video/mp4,video/webm" className="hidden" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
    </div>
  );
}