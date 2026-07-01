import { C } from "@/components/organisms/dashboard/tokens";
import { RemoveButton } from "@/components/atoms/RemoveButton";

type Props = {
  src: string;
  alt?: string;
  onRemove: () => void;
};

/** Square media preview with a remove button (blob preview or remote URL). */
export function MediaThumbnail({ src, alt = "Post image", onRemove }: Props) {
  return (
    <div style={{ position: "relative", width: 96, height: 96, marginBottom: 20 }}>
      {/* eslint-disable-next-line @next/next/no-img-element -- blob preview or Active Storage URL, not optimizable by next/image */}
      <img src={src} alt={alt} style={{ width: 96, height: 96, objectFit: "cover", borderRadius: 12, border: `1px solid ${C.line}` }} />
      <RemoveButton onClick={onRemove} label="Remove image" />
    </div>
  );
}
