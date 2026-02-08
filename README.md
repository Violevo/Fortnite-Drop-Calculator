# Fortnite Drop Calculator

A lightweight, physics-optimisation-based web tool for optimising a Fortnite drop path.  
Calculates the mathematically optimal jump and glider deploy points to minimise total landing time. Built using vanilla JavaScript, HTML, and CSS.

### Usage
Either run locally (open ```index.html``` in your browser), or refer to the [releases](https://github.com/Violevo/Fortnite-Drop-Calculator/releases) page for a hosted site.

## Features

- **Optimal Pathing**: Computes the fastest route (Jump → Deploy → Target) using an optimised drop model.
- **Interactive Map**: Drag-and-drop markers for Bus Start, Bus End, and Target.
- **Real-Time Updates**: Paths update instantly as markers are moved.
- **Auto-Updates**: Map automatically updates with new game versions

## Project Structure

```text
├── app.js         # Core logic
├── index.html     # UI structure
├── styles.css     # Styling and theme
├── assets/        # Icons & other assets
└── README.md      # Project documentation
```

## License & Credits
- **Developer**: Violevo - [github.com/violevo](https://github.com/violevo/)
- **Map data**: Fortnite API - [fortnite-api.com](https://fortnite-api.com/)
- **Map UI**: Leaflet - [leafletjs.com](https://leafletjs.com/)

You can read more about the project [here](https://violevo.github.io/projects/assets/fortnite-drop-calculator.pdf)

## Images

![Info Preview](./images/info_preview.png)
![Map Preview](./images/map_preview.png)

Not affiliated with or endorsed by Epic Games.
