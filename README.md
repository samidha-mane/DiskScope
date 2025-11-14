# DiskScope
A fully interactive visual tool for simulating popular Disk Scheduling Algorithms in Operating Systems.
The project supports FCFS, SSTF, SCAN, C-SCAN, LOOK, and C-LOOK, and provides:
1. Clean head-movement graphs
2. Total seek-time calculations
3. A step-by-step animation module for learning how each algorithm works

This project demonstrates my solid understanding of core OS concepts and my ability to build interactive web applications using HTML, CSS, and JavaScript.

Features:
  1. Supports 6 major disk scheduling algorithms
  2. Head movement graph visualization
  3. Real-time seek-time calculation
  4. Smooth animation showing disk-head movement
  5. Clean, responsive, modern UI
  6. Fully client-side — no backend needed

**Project Structure :**
  📁 disk-scheduling-visualizer
     ├── index.html
     ├── style.css
     ├── script.js
     └── README.md
      
**How to Run :**

  - Clone the repository:
        git clone https://github.com/samidha-mane/DiskScope.git

  - Open the folder:
        cd disk-scheduler-visualizer

  - Open index.html in any browser

**How the Algorithms Work:**
Each algorithm decides how the disk arm moves:
  1.FCFS – Serves requests in arrival order
  2.SSTF – Picks the request with the shortest distance from current head
  3.SCAN – Moves in one direction until the end, then reverses
  4.C-SCAN – Moves in one direction, then jumps to start
  5.LOOK / C-LOOK – Like SCAN but stops at the last request instead of the end

**Seek-Time Calculation:**
  Total seek time = sum of all absolute head movements
  Example:
  Current head = 50
  Requests = 40, 60 → movement = |50−40| + |40−60| = 30 tracks
