# Smart Rainfall Prediction and Water Resource Management Using Machine Learning

An AI-powered environmental dashboard and machine learning platform for rainfall prediction and sustainable water resource analytics.

---

## 🌟 Academic Project Overview & PPT Alignment

### Project Title
**Smart Rainfall Prediction and Water Resource Management Using Machine Learning**

### Purpose
Build an AI-powered web application for rainfall prediction and sustainable water resource management.

### Academic Modules Overview
1. **Module 1: Rainfall Prediction (Part 1 Active)**
   - Machine Learning model training using `RandomForestRegressor`.
   - Feature engineering: Temperature, Humidity, Wind Speed, Pressure, Cloud Cover, Month/Season, Lag Rainfall.
   - Empirical evaluation metrics: MAE, RMSE, and $R^2$ score.
2. **Module 2: Water Consumption & Demand Analytics (Part 2)**
   - Urban water usage breakdown, per-capita analytics, and demand projections.
3. **Module 3: Water Risk Assessment & Decision Support (Part 2)**
   - Drought Index (SPI), Flood Vulnerability Index, and Water Scarcity scoring matrix.

---

## 🔄 End-To-End Workflow Stepper (7 Steps)

```
1. UPLOAD REPORT  →  2. ANALYZE DATA  →  3. TRAIN MODEL  →  4. PREDICT RAINFALL  →  5. WATER DEMAND (P2)  →  6. RISK (P2)  →  7. REPORT (P2)
```

---

## 🚀 PART 1 Scope & Features

- [x] **Complete Project Structure** (`frontend/`, `backend/`, `docs/`, `datasets/`, `saved_models/`).
- [x] **Frontend:** React + TypeScript + Vite + Tailwind CSS + Lucide Icons + Recharts.
- [x] **Backend API:** Python FastAPI + Pandas + Scikit-learn + Joblib + Uvicorn.
- [x] **Database & Auth:** SQLite + SQLAlchemy + JWT Bearer Token Auth + Bcrypt password hashing.
- [x] **Landing Page:** Hero with project title & subtitle, CTA buttons ("Start Analysis", "View Dashboard"), 3 Academic Modules, Workflow Stepper, Problem, Solution, Technology, Methodology, Future Scope.
- [x] **Dashboard Foundation:** KPI cards (Predicted Rainfall, Water Consumption, Water Demand, Drought Risk, Flood Risk, Water Scarcity, Model $R^2$), DEMO DATA badge, 4 Interactive Recharts visualizations, Recent Analyses, Recent Predictions, Recent Reports panels.
- [x] **Dataset Upload (Step 1):** Drag & drop support for CSV and XLSX files, metadata detection, validations, demo dataset loader.
- [x] **Data Preprocessing & Analysis (Step 2):** Data Quality Score calculation, outlier detection (IQR), missing/duplicate handling, before/after cleaning inspection tabs.
- [x] **Machine Learning Model (Step 3):** `RandomForestRegressor` with 80/20 train/test split, real MAE/RMSE/$R^2$ calculation, Joblib model serialization.
- [x] **Rainfall Prediction (Step 4):** Multi-horizon forecasts (Next Day, Next 7 Days, Next 30 Days), rainfall categorization (Very Low, Low, Moderate, Heavy, Very Heavy), disclaimer notice, daily forecast breakdown table, historical vs predicted chart.
- [x] **Demo Synthetic Dataset:** Built-in generator creating 1200+ multi-region synthetic records clearly labeled `DEMO DATASET`.

---

## 💻 Tech Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, Recharts, Framer Motion, Lucide React.
- **Backend:** Python 3.13, FastAPI, Pandas, NumPy, Scikit-learn, Joblib.
- **Database:** SQLite, SQLAlchemy ORM.
- **Authentication:** JWT, Passlib (Bcrypt).

---

## ⚙️ Quick Start Commands

### 1. Start Backend API Server
```powershell
# Navigate to backend folder
cd backend

# Activate Virtual Environment
.\venv\Scripts\Activate.ps1

# Run FastAPI with Uvicorn
uvicorn app.main:app --reload --port 8000
```
*API Swagger Documentation available at: `http://127.0.0.1:8000/docs`*

### 2. Start Frontend Web Interface
```powershell
# Navigate to frontend folder
cd frontend

# Run Vite dev server
npm run dev
```
*Web Application available at: `http://localhost:5173`*

---

## 📑 Part 1 Verification Summary

1. Dependencies installed for both Python backend virtual environment and Node frontend.
2. SQLite database `water_intelligence.db` initialized with `users`, `datasets`, `analysis_runs`, `trained_models`, `predictions` tables.
3. 1200+ record synthetic demo dataset generated.
4. Full JWT authentication tested and working.
5. CSV and XLSX dataset uploads verified.
6. Random Forest Regressor model training & evaluation ($R^2$, MAE, RMSE) verified.
7. Rainfall prediction endpoint tested across 1-day, 7-day, and 30-day forecast horizons.
"# water" 
