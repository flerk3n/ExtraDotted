# Extra Dotted — Dot Portrait Renderer

🌐 **Live Demo:** [https://extra-dotted.vercel.app](https://extra-dotted.vercel.app)

A responsive dot portrait renderer that converts images into geometric art on HTML canvas.
Export as PNG, SVG, ASCII, or CSS, with built-in support for braille conversion and tactile printing.


## Accessibility & Braille Support

Extra Dotted can generate dot-based representations of images and text, making visual content more accessible. The ASCII/Unicode export feature creates tactile-friendly patterns that can be:

- **Converted to Braille**: The dot patterns can be adapted for braille displays and embossers
- **Printed for Tactile Graphics**: Export high-resolution dot patterns for tactile printing
- **Screen Reader Compatible**: ASCII output works with assistive technologies
- **Customizable Density**: Adjust dot spacing and size for optimal tactile feedback

This makes Extra Dotted a valuable tool for creating accessible visual content for people with visual impairments.

## Features

- **Universal Input**: Transform any image or text into dot portraits
- **Real-time Canvas Rendering**: Images are converted to dot patterns directly on canvas
- **Responsive Design**: Automatically adjusts to viewport changes
- **Multiple Export Formats**:
  - PNG (raster image for printing and sharing)
  - SVG (scalable vector for infinite resolution)
  - ASCII/Unicode art (text-based, braille-compatible)
  - CSS snippet (radial-gradient background)
- **Accessibility Features**:
  - Braille-compatible dot patterns
  - Tactile graphics export
  - Screen reader friendly ASCII output
  - High-contrast modes
- **Customizable Controls**:
  - Dot gap spacing (adjustable for tactile printing)
  - Dot size scaling
  - Contrast adjustment
  - Color modes (monochrome or source colors)
  - Custom dot color picker
- **Light/Dark Theme**: Automatic theme detection with manual toggle

## Project Structure

```
ExtraDotted/
├── index.html              # Main HTML file
├── css/
│   ├── variables.css       # CSS custom properties and theme tokens
│   ├── base.css           # Base styles and resets
│   ├── components.css     # Component-specific styles
│   └── layout.css         # Layout and responsive styles
├── js/
│   ├── app.js             # Main application entry point
│   ├── canvas.js          # Canvas rendering logic
│   ├── controls.js        # User input controls
│   ├── export.js          # Export functionality
│   ├── modals.js          # Modal dialogs
│   ├── theme.js           # Theme management
│   └── utils.js           # Utility functions
└── README.md              # This file
```

## Usage

1. **Upload an Image**: Click "Source image" and select any image file (photos, logos, text screenshots, etc.)
2. **Adjust Controls**: Use the sliders and inputs to customize the dot portrait
3. **Export**: Choose your preferred export format:
   - **PNG**: For general use and printing
   - **SVG**: For scalable graphics and web use
   - **ASCII/Unicode**: For braille conversion and tactile graphics
   - **CSS**: For web backgrounds

### For Braille and Tactile Graphics

1. Upload an image with clear contrast (text, simple graphics work best)
2. Adjust **Dot Gap** to match your braille embosser or tactile printer specifications
3. Increase **Contrast** for clearer tactile differentiation
4. Export as **ASCII/Unicode** for braille conversion or **PNG** for tactile printing
5. Use the exported file with your braille embosser or tactile graphics software

## Code Architecture

### Modular JavaScript

The application uses ES6 modules for clean separation of concerns:

- **app.js**: Initializes all modules
- **canvas.js**: Handles image processing and rendering
- **controls.js**: Manages user inputs
- **export.js**: Handles all export formats
- **modals.js**: Controls modal dialogs
- **theme.js**: Manages light/dark theme switching
- **utils.js**: Shared utility functions

### CSS Organization

Styles are organized into logical layers:

- **variables.css**: Design tokens and CSS custom properties
- **base.css**: Reset and base element styles
- **components.css**: Reusable component styles
- **layout.css**: Page layout and responsive breakpoints

## Browser Support

- Chrome/Edge 89+
- Firefox 88+
- Safari 15+

## License

This project is open source and available for personal and commercial use.