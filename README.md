# Document Intelligence Frontend (Luxury UI)

Premium light-themed React UI for AI-based structured extraction from financial documents.

## What it does

1. Upload a PDF (`/documents/upload`)
2. Build an extraction schema dynamically (field name + description + type)
3. Trigger extraction (`/documents/{docId}/extract`)
4. Display extracted values, confidence and provenance

## Run locally

### 1) Install
```bash
npm install
```

### 2) Configure backend URL
```bash
cp .env.example .env
```

### 3) Start
```bash
npm run dev
```

Open: http://localhost:5173

## Backend endpoints expected

- `GET /health`
- `POST /documents/upload` (multipart form-data: `file`)
- `POST /documents/{docId}/extract`
