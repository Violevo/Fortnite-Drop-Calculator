# Fortnite Drop Calculator

A lightweight, physics-optimisation-based web tool for optimising a Fortnite drop path. Calculates the mathematically optimal jump and glider deploy points to minimise total landing time. Built using vanilla JavaScript, HTML, and CSS.

## Usage

Either run locally (download the repository and open `index.html` in your browser), or refer to the [releases](https://github.com/Violevo/Fortnite-Drop-Calculator/releases) page for a live hosted site.

## Overview

### Features

- **Optimal Pathing**: Computes the fastest route (Jump → Deploy → Target) using an optimised drop model.
- **Interactive Map**: Drag-and-drop markers for Bus Start, Bus End, and Target.
- **Real-Time Updates**: Paths update instantly as markers are moved.
- **Auto-Updates**: Map automatically updates with new game versions

### The Calculation

The calculation samples possible jump points along the defined bus route to identify the optimal jump point **J**.

First, the segment from the **Bus Start (S)** to the **Bus End (E)** is divided into multiple candidate points. For each candidate jump point **J**, the app estimates the total time it would take to reach the target **T** by splitting the journey into the following phases:

1. **Time on the bus** (from **S** to **J**)
2. **Time falling** (from **J** to **G**, the point where gliding begins)
3. **Time gliding** (from **G** to **T**)

The application uses fixed values for bus speed, fall speed, and glide speed (these values could probably be refined for more accuracy). For each candidate jump point **J**, the app then computes the total time and finally selects the point with the smallest total time as the optimal jump point.

Once the best jump point **J** is found, the app calculates the **glider start point (G)** and displays both the **jump point (J)** and the **glider start point (G)** on the map.

### Map Rendering

The map rendering is powered by **Leaflet.js** using a simple coordinate system. The Fortnite map is loaded as an image overlay, with each point represented as a pixel coordinate on a 2D plane. This simplifies the mathematics and geometry, though changes in the map scale could break the calculations in future updates.

The map image is fetched from **Fortnite-API.com**. If the request fails, the app falls back to default map image URLs to ensure the tool still functions.

When dragging markers, multiple updates are triggered. To minimize lag and maintain smooth performance, **requestAnimationFrame** is used to throttle the recalculations. This allows the updates to feel real-time without overwhelming the browser.

## Contributing & Licensing

Contributions, suggestions, and bug reports are always welcome. If you'd like to contribute to this project, please fork the repository, create a feature branch, and submit a pull request.

### Credits

- **Developer**: Violevo - [github.com/violevo](https://github.com/violevo/)
- **Map data**: Fortnite API - [fortnite-api.com](https://fortnite-api.com/)
- **Map UI**: Leaflet - [leafletjs.com](https://leafletjs.com/)

### License

This project is licensed under the GNU GPL v3 License - see the [LICENSE](LICENSE) file for details.

## Gallery

![Info Preview](./images/info_preview.png)
![Map Preview](./images/map_preview.png)

You can read more about the project [here](https://violevo.github.io/projects/assets/fortnite-drop-calculator.pdf)
