import { readFile } from "node:fs/promises";
import path from "node:path";

// Renders one of the standalone HTML screens at the project root full-screen.
export default async function HtmlFrame({ file, title }) {
  const documentHtml = await readFile(path.join(process.cwd(), file), "utf8");

  return (
    <main style={{ height: "100dvh" }}>
      <iframe
        title={title}
        srcDoc={documentHtml}
        style={{ border: 0, display: "block", height: "100%", width: "100%" }}
      />
    </main>
  );
}
