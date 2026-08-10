import { useState } from "react";

const LANGUAGES = [
  {
    id: "c",
    label: "C",
    compiler: "gcc-12.3.0-c",
    template: `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`,
  },
  {
    id: "cpp",
    label: "C++",
    compiler: "gcc-12.3.0",
    template: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`,
  },
  {
    id: "java",
    label: "Java",
    compiler: "openjdk-jdk-21+35",
    template: `class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
  },
  {
    id: "python",
    label: "Python",
    compiler: "cpython-3.11.10",
    template: `print("Hello, World!")`,
  },
  {
    id: "javascript",
    label: "JavaScript",
    compiler: "nodejs-20.17.0",
    template: `console.log("Hello, World!");`,
  },
  {
    id: "html",
    label: "HTML / CSS / JS",
    compiler: null,
    template: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My Page</title>
  <style>
    body { font-family: Arial, sans-serif; text-align: center; margin-top: 60px; }
    h1 { color: #14b8a6; }
  </style>
</head>
<body>
  <h1>Hello, World!</h1>
  <script>
    document.write("<p>Rendered in your browser</p>");
  </script>
</body>
</html>`,
  },
];

function CodeCompiler() {
  const [langId, setLangId] = useState("python");
  const [code, setCode] = useState(() => LANGUAGES[3].template);
  const [stdin, setStdin] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [running, setRunning] = useState(false);
  const [previewHtml, setPreviewHtml] = useState(null);

  const lang = LANGUAGES.find((l) => l.id === langId);

  const selectLanguage = (id) => {
    setLangId(id);
    setCode(LANGUAGES.find((l) => l.id === id).template);
    setOutput("");
    setError("");
    setPreviewHtml(null);
  };

  const run = async () => {
    setOutput("");
    setError("");
    setPreviewHtml(null);
    setRunning(true);
    try {
      if (!lang.compiler) {
        setPreviewHtml(code);
      } else {
        const res = await fetch("https://wandbox.org/api/compile.json", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code, compiler: lang.compiler, stdin }),
        });
        if (!res.ok) throw new Error(`Compiler service returned ${res.status}`);
        const data = await res.json();

        let out = data.program_output || "";
        if (data.compiler_error) {
          setError(data.compiler_error);
        } else if (data.program_error) {
          setError(data.program_error);
        } else if (!out) {
          out = "(no output)";
        }
        setOutput(out);
      }
    } catch (e) {
      setError(`Failed to run code: ${e.message}`);
    } finally {
      setRunning(false);
    }
  };

  return (
    <section className="compiler-panel">
      <div className="compiler-head">
        <div className="compiler-title">
          <span className="compiler-icon">⚡</span>
          <div>
            <h2>Online Code Compiler</h2>
            <p>Write, compile and run code right inside the browser</p>
          </div>
        </div>
      </div>

      <div className="compiler-toolbar">
        <div className="compiler-langs">
          {LANGUAGES.map((l) => (
            <button
              key={l.id}
              className={`lang-tab${l.id === langId ? " active" : ""}`}
              onClick={() => selectLanguage(l.id)}
              type="button"
            >
              {l.label}
            </button>
          ))}
        </div>
        <button
          className="run-btn"
          onClick={run}
          disabled={running}
          type="button"
        >
          {running ? "Running…" : "▶ Run Code"}
        </button>
      </div>

      <div className="compiler-body">
        <div className="editor-col">
          <div className="editor-label">Code Editor</div>
          <textarea
            className="code-area"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck="false"
          />
          {lang.compiler && (
            <div className="stdin-row">
              <span className="stdin-label">Input (stdin)</span>
              <textarea
                className="stdin-area"
                value={stdin}
                onChange={(e) => setStdin(e.target.value)}
                placeholder="Enter program input here…"
                rows={2}
              />
            </div>
          )}
        </div>

        <div className="output-col">
          <div className="editor-label">Output</div>
          {lang.id === "html" ? (
            <iframe
              className="html-preview"
              title="HTML preview"
              sandbox="allow-scripts"
              srcDoc={previewHtml}
            />
          ) : (
            <pre className={`output-area${error ? " has-error" : ""}`}>
              {error ? error : output}
            </pre>
          )}
        </div>
      </div>
    </section>
  );
}

export default CodeCompiler;
