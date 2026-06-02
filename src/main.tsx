import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./RandomizerGame.css";
import { Box, Button, Typography, styled } from "@mui/material";

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
  const [yaml, setYaml] = useState<File | null>(null);
  const [puz64, setPuz64] = useState<string | null>(null);

  function getBase64(file) {
   var reader = new FileReader();
   reader.readAsDataURL(file);
   reader.onload = function () {
     setPuz64(reader.result as string);
   };
   reader.onerror = function (error) {
     console.log('Error: ', error);
   };
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
    accept=".yaml"
    onChange={(event: { target: { files: any; }; }) => setYaml(event.target.files[0])}
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
    onChange={(event: { target: { files: any; }; }) => getBase64(event.target.files[0])}
  />
</Button>
<Button
  component="label"
  role={undefined}
  variant="contained"
  disabled={!yaml || !puz64}
  tabIndex={-1}
>Download Result Yaml</Button>
</Box>
</>)
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Page/>
  </React.StrictMode>
);
