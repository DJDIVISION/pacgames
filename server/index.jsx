const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const PORT = 8000; // Or any port you like

app.use(cors());

app.use("/", (req, res) => {
  res.send("Server is running");
})

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});