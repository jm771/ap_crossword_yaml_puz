import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./RandomizerGame.css";
import { Box, Button, Typography, styled } from "@mui/material";
import { deflate } from "pako";
import { load, dump } from "js-yaml";

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

function Page() {
  const [yamlFile, setYamlFile] = useState<File | null>(null);
  const [puzFile, setPuzFile] = useState<File | null>(null);

  async function downloadModifiedYaml() {
    if (!yamlFile || !puzFile) return;

    try {
      const yamlText = await yamlFile.text();
      const yamlData = load(yamlText) as any;

      if (!yamlData || !yamlData.Crossword) {
        alert('Invalid YAML file: No Crossword section found');
        return;
      }

      const puzArrayBuffer = await puzFile.arrayBuffer();
      const puzUint8Array = new Uint8Array(puzArrayBuffer);

      const compressed = deflate(puzUint8Array);
      const base64 = btoa(String.fromCharCode(...compressed));


      delete yamlData.Crossword.puz_file_path;
      yamlData.Crossword.puz_file_contents = base64;

      const modifiedYaml = dump(yamlData, {
        noRefs: true, 
      });

      const blob = new Blob([modifiedYaml], { type: 'text/yaml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = yamlFile.name;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error processing files:', error);
      alert(`Error processing files: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  return (<>
 <Box className="randomizer-header" p={2}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h4">Archipelago Crossword Randomizer</Typography>
            </Box>
            </Box>
            <Box className="clues-container" p={2}>
<Button
  component="label"
  role={undefined}
  variant="contained"
  tabIndex={-1}
>
  Upload Yaml
  <VisuallyHiddenInput
    type="file"
    accept=".yaml,.yml"
    onChange={(event: { target: { files: any; }; }) => event.target.files?.[0] && setYamlFile(event.target.files[0])}
  />
</Button>
<Button
  component="label"
  role={undefined}
  variant="contained"
  tabIndex={-1}
>
  Upload Puz
  <VisuallyHiddenInput
    type="file"
    accept=".puz"
    onChange={(event: { target: { files: any; }; }) => event.target.files?.[0] && setPuzFile(event.target.files[0])}
  />
</Button>
<Button
  variant="contained"
  disabled={!yamlFile || !puzFile}
  tabIndex={-1}
  onClick={downloadModifiedYaml}
>Download Result Yaml</Button>
</Box>
</>)
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Page/>
  </React.StrictMode>
);
