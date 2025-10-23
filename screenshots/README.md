# Screenshots Guide

This directory should contain screenshots of the app for the README.

## Required Screenshots

### Light Mode

1. `product-list-light.png` - Product list screen in light mode
2. `product-details-light.png` - Product details screen with carousel
3. `cart-light.png` - Cart screen with items and promo code
4. `favorites-light.png` - Favorites screen

### Dark Mode

1. `product-list-dark.png` - Product list in dark mode
2. `cart-dark.png` - Cart screen in dark mode
3. `settings-dark.png` - Settings screen showing theme toggle

### RTL (Arabic)

1. `rtl-product-list.png` - Product list in Arabic (RTL layout)
2. `rtl-product-details.png` - Product details in Arabic
3. `rtl-cart.png` - Cart screen in Arabic with AED pricing

### Additional States

1. `empty-cart.png` - Empty cart state
2. `error-state.png` - Error state with retry button
3. `loading.png` - Skeleton loading state
4. `filters.png` - Search and filter interface

## How to Capture Screenshots

### Android

```bash
# Take screenshot
adb shell screencap -p /sdcard/screenshot.png

# Pull to computer
adb pull /sdcard/screenshot.png ./screenshots/product-list-light.png

# Clean up
adb shell rm /sdcard/screenshot.png
```

### iOS Simulator

1. Run the app in iOS Simulator
2. Press `CMD + S` to save screenshot to Desktop
3. Move and rename to appropriate location in this directory

### Physical Device

- **Android:** Press Power + Volume Down
- **iOS:** Press Side Button + Volume Up

## Screenshot Specifications

- **Format:** PNG (preferred) or JPG
- **Orientation:** Portrait
- **Resolution:** Original device resolution (don't resize)
- **Quality:** High quality, no compression artifacts
- **Device Frame:** Optional but looks professional

## Tools for Adding Device Frames

- [Mockuphone](https://mockuphone.com/)
- [Smartmockups](https://smartmockups.com/)
- [Screely](https://www.screely.com/)
- [Device Frames by Facebook](https://facebook.design/devices)

## After Adding Screenshots

Once you've added all screenshots, they will automatically appear in the main README.md file.
