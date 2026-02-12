import { toPng } from "html-to-image";

export async function downloadPNG() {
  const node = document.getElementById("slide");
  const dataUrl = await toPng(node);

  const link = document.createElement("a");
  link.download = "slide.png";
  link.href = dataUrl;
  link.click();
}
