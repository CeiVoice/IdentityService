import express, { Request, Response } from 'express';
import cors from 'cors';
import app from './src/app';

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Identity Server running on http://localhost:${PORT}`);
});
