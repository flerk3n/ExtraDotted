# Accessibility Features

## Overview

Extra Dotted is designed with accessibility in mind, making visual content available to people with visual impairments through multiple export formats and customizable rendering options.

## Key Accessibility Features

### 1. Braille Compatibility

The ASCII/Unicode export creates dot-based patterns that can be converted to braille:

- **Dot Patterns**: Uses Unicode block characters (░ ▒ ▓ █) that represent different brightness levels
- **Adjustable Density**: Control dot spacing to match braille embosser specifications
- **High Contrast**: Increase contrast for clearer tactile differentiation

### 2. Tactile Graphics

Export high-resolution images for tactile printing:

- **PNG Export**: Generate high-resolution dot patterns (up to 8000×8000px)
- **Customizable Dot Size**: Adjust dot size for optimal tactile feedback
- **Spacing Control**: Set dot gap from 4px to 18px to match printer specifications

### 3. Screen Reader Support

- **ASCII Output**: Text-based representation works with all screen readers
- **Semantic HTML**: Proper ARIA labels and semantic structure
- **Keyboard Navigation**: Full keyboard accessibility for all controls

### 4. Visual Accessibility

- **High Contrast Modes**: Light and dark themes with high contrast ratios
- **Adjustable Contrast**: Control slider for visual clarity
- **Color Modes**: Monochrome option for better visibility

## How to Use for Accessibility

### For Braille Conversion

1. Upload your image (text screenshots work best)
2. Set **Color Mode** to "Monochrome"
3. Adjust **Dot Gap** to match your braille embosser (typically 6-8px)
4. Increase **Contrast** to 1.5-1.8 for clearer patterns
5. Click **ASCII / Unicode** export
6. Copy the output to your braille conversion software

### For Tactile Printing

1. Upload a high-contrast image
2. Set **Export Width/Height** to your printer's resolution
3. Adjust **Dot Gap** to match your tactile printer specifications
4. Set **Dot Size** to create appropriate relief height
5. Click **PNG** export
6. Use the exported file with your tactile graphics printer

### For Screen Reader Users

1. Upload your image
2. Click **ASCII / Unicode** export
3. The text-based representation can be read by screen readers
4. Copy and paste into documents for accessible sharing

## Supported Assistive Technologies

- **Screen Readers**: JAWS, NVDA, VoiceOver, TalkBack
- **Braille Displays**: Refreshable braille displays via screen readers
- **Braille Embossers**: Any embosser that accepts image input
- **Tactile Printers**: Swell-form machines, thermoform printers

## Best Practices

### For Text Content

- Use high-contrast text on solid backgrounds
- Increase font size before uploading
- Use sans-serif fonts for better dot conversion
- Set contrast to maximum (1.8)

### For Images

- Use simple, high-contrast images
- Avoid complex gradients
- Increase contrast slider for clearer patterns
- Test with smaller dot gaps for more detail

### For Tactile Output

- Start with dot gap of 6-8px
- Test print at different scales
- Adjust dot size based on material thickness
- Use monochrome mode for consistency

## Technical Specifications

### ASCII/Unicode Export

- **Character Set**: Space, ·, ⠂, ░, ▒, ▓, █
- **Resolution**: 100 columns (adjustable aspect ratio)
- **Brightness Levels**: 7 levels from white to black
- **Format**: Plain text, UTF-8 encoded

### PNG Export for Tactile

- **Resolution**: 100px to 8000px (customizable)
- **Format**: PNG with transparency
- **Dot Spacing**: 4px to 18px
- **Dot Size**: 0.4× to 1.8× multiplier

## Resources

### Braille Conversion Software

- **Duxbury Braille Translator**: Industry standard for braille conversion
- **Liblouis**: Open-source braille translation library
- **SWIFT**: Braille graphics software

### Tactile Graphics Tools

- **Tiger Software Suite**: For tactile graphics production
- **ViewPlus**: Tactile graphics and braille embossing
- **Swell-Form Graphics**: Heat-based tactile graphics

## Feedback

We're committed to improving accessibility. If you have suggestions or encounter issues, please provide feedback to help us make Extra Dotted more accessible for everyone.

## Standards Compliance

- **WCAG 2.1**: Follows Web Content Accessibility Guidelines
- **ARIA**: Uses appropriate ARIA labels and roles
- **Keyboard Navigation**: Full keyboard support
- **Color Contrast**: Meets AA standards for text and UI elements
