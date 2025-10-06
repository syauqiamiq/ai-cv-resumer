# 🤖 AI CV Resumer

Backend API yang terintegrasi dengan AI untuk mengotomatisasi proses screening resume dan penilaian proyek terhadap kecocokan dari Job Description.

## 📋 Summary

API ini merupakan prototype fitur evaluasi talenta modern yang dikembangkan untuk perekrutan, mencakup:

- **AI-Powered Analysis** - Analisis CV dan proyek menggunakan Google Gemini AI
- **Vector Search** - Pencarian semantik menggunakan ChromaDB untuk matching kandidat
- **Queue Processing** - Sistem antrian dengan Redis untuk processing background
- **Job Fitment** - Analisis kecocokan CV dan Laporan Proyek terhadap job description

## 🛠 Tech Stack

### Backend

- **NestJS** - Node.js Framework
- **TypeScript** - Programming Language
- **PostgreSQL** - Database
- **TypeORM** - ORM

### AI & Processing

- **Google Gemini AI** - Text Generation & Embeddings
- **ChromaDB** - Vector Database
- **pdf-parse** - PDF Processing

### Storage & Infrastructure

- **MinIO S3** - Object Storage
- **Redis + BullMQ** - Caching & Job Queue
- **Docker** - Containerization

### Development Tools

- **Swagger/OpenAPI** - API Documentation
- **Jest** - Testing Framework
- **ESLint** - Code Linting
- **Prettier** - Code Formatting

## 📋 Live Preview

- **API Documentation**:

- https://ai-cv-resumer-api.okispace.my.id/api-documentation

## 📋 Prerequisites

### System Requirements

- **Node.js** >= 18.0
- **Yarn** >= 1.22
- **Docker** >= 20.0
- **PostgreSQL** >= 12.0

## 🚀 Cara Menjalankan

### 1. Clone Repository

```bash
git clone https://github.com/syauqiamiq/ai-cv-resumer.git
cd ai-cv-resumer
```

### 2. Install Dependencies

```bash
# Install all dependencies
yarn install
```

### 3. Main Service Environment Setup

```bash
# Copy environment file pada directory /apps/ai-cv-resumer
cp .env.example .env

# Edit .env dengan konfigurasi yang sesuai
```

### 3. Worker Service Environment Setup

```bash
# Copy environment file pada directory /apps/worker
cp .env.example .env

# Edit .env dengan konfigurasi yang sesuai
```

### 3. Shared Library Environment Setup

```bash
# Copy environment file pada directory /libs
cp .env.example .env

# Edit .env dengan konfigurasi yang sesuai
```

### 4. Run Development Server

```bash
# Start main application
yarn start:dev ai-cv-resumer

# Start worker services (in separate terminals)
yarn start:dev worker
```

### 5. Access Application

- **Main Application**: http://localhost:9898
- **API Documentation**: http://localhost:9898/api-documentation
- **CV Worker**: http://localhost:9797

## System Architecture

![System Architecture](/system-architecture.png)

## Database Design

![Services Design](/ERD.png)
