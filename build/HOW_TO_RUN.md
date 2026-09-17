# How to Run

This project has two parts that run **at the same time**, in two terminals:
a Flask backend (vehicle detection) and a React frontend (the UI).

## 1. Backend (Flask + YOLOv8)

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

The API starts at `http://127.0.0.1:5000`. First run will take a little
longer as `ultralytics` verifies the model.

Health check: open `http://127.0.0.1:5000/` in a browser — you should see
`{"status": "ok", ...}`.

## 2. Frontend (React + Vite)

In a **second terminal**, from the project root (not the `backend/` folder):

```bash
npm install
npm run dev
```

Vite will print a local URL, typically `http://localhost:5173`. Open it in
your browser.

## 3. Using the app

1. On the home page, click **Get Started**.
2. Upload one image for each of the four lanes (left, right, top, bottom).
3. Click **Analyze & Generate Signal** — this POSTs the images to the Flask
   `/upload` endpoint, which runs YOLOv8 on each and returns vehicle counts.
4. The signal view shows all four lanes with a countdown ring; the lane with
   the most vehicles gets priority and the longest green time.
5. Click **View Comparison** to see adaptive timing vs. a traditional fixed
   30s-per-lane signal.

## Notes

- `yolov8n.pt` is already included at the project root; `backend/app.py`
  loads it from there.
- If uploads fail with a network error, check that the Flask server is
  actually running on port 5000 and that nothing else is using that port.
- To point the frontend at a different backend URL (e.g. if deployed), set
  `VITE_API_URL` in a `.env` file at the project root.
