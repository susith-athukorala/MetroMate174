# MetroMate174
Customized Adelaide Metro Dashboard by Susith

MetroMate174 is a lightweight web application that provides live Route 174 bus information for Adelaide Metro. It combines scheduled timetable data with GTFS Realtime trip updates to display predicted arrival times and service delays in a clean, mobile-friendly dashboard.

## Features

- 🚍 Displays upcoming Route 174 services
- ⏱ Live countdown to bus arrival
- 🕒 Predicted arrival times using GTFS Realtime
- 🟢 On-time indicator
- 🟠 Minor delay indicator
- 🔴 Major delay indicator
- 🔵 Early running indicator
- 🔄 Automatic refresh every 15 seconds
- 🕐 Live digital clock
- 📱 Mobile-friendly Progressive Web App (PWA)

---

## Technologies

- HTML5
- CSS3
- Vanilla JavaScript
- Adelaide Metro Public API
- GTFS Realtime Trip Updates
- Cloudflare Workers
- GitHub Pages

---

## Data Sources

### Scheduled Timetable

Adelaide Metro Next Scheduled Services API

```
https://api-cloudfront.adelaidemetro.com.au/
```

### GTFS Realtime

Adelaide Metro GTFS Realtime Feed

```
https://gtfs.adelaidemetro.com.au/
```

Realtime trip updates are processed through a Cloudflare Worker to simplify parsing and provide JSON output.

---

## Delay Calculation

MetroMate174 compares:

- Scheduled arrival time
- GTFS predicted arrival time

to determine service status.

Displayed status includes:

| Status | Meaning |
|---------|---------|
| 🟢 On time | Within ±1 minute |
| 🟠 X min late | 2–5 minutes late |
| 🔴 X min late | More than 5 minutes late |
| 🔵 X min early | Running early |
| 🟡 Scheduled | No realtime data available |

---

## Project Structure

```
MetroMate174
│
├── index.html
├── style.css
├── app.js
├── manifest.json
├── service-worker.js
├── icon-192.png
├── icon-512.png
└── README.md
```

---

## Installation

Clone the repository.

```bash
git clone https://github.com/YOUR_USERNAME/MetroMate174.git
```

Open `index.html` in a browser, or deploy the project using GitHub Pages.

---

## Customising Stops

Update the stop IDs in `app.js`.

```javascript
const OUTBOUND_STOP = "12501";
const INBOUND_STOP = "13278";
```

Replace these with any Adelaide Metro stop IDs.

---

## Future Improvements

- Favourite stop selector
- Configurable home and destination stops
- Automatic stop detection
- Bus location map
- Service alerts
- Vehicle occupancy (if available)
- Dark mode
- Route selection
- ETA notifications
- Offline support

---

## Disclaimer

MetroMate174 is a **personal, non-commercial demonstration project** developed for learning, experimentation, and showcasing the use of publicly available Adelaide Metro timetable and GTFS Realtime data.

This application is provided **for testing and educational purposes only** and should not be relied upon for critical travel decisions. Although every effort has been made to display accurate information, the developer makes no guarantees regarding the accuracy, completeness, timeliness, or availability of the displayed data.

MetroMate174 is **not an official Adelaide Metro application** and is **not affiliated with, endorsed by, or sponsored by Adelaide Metro or the Government of South Australia**.

Users should always refer to the official Adelaide Metro website or mobile application for the most up-to-date service information.

---

## Author

**Dr. Susith Athukorala**

Digital Health | Health Informatics | Software Development

GitHub: https://github.com/susith-athukorala

---

## License

MIT License

Copyright (c) 2026 Susith Athukorala

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software.
