const productImages = {
  "Wireless Headphones": "https://cdn.jsdelivr.net/npm/@tabler/icons/icons/headphones.svg",
  "Smart Watch": "https://cdn.jsdelivr.net/npm/@tabler/icons/icons/device-watch.svg",
  "USB-C Cable": "https://cdn.jsdelivr.net/npm/@tabler/icons/icons/plug-connected.svg",
  "Portable Charger": "https://cdn.jsdelivr.net/npm/@tabler/icons/icons/battery-charging.svg",
  "Phone Stand": "https://cdn.jsdelivr.net/npm/@tabler/icons/icons/device-mobile.svg",
  "Screen Protector": "https://cdn.jsdelivr.net/npm/@tabler/icons/icons/device-mobile-search.svg",
  "Bluetooth Speaker": "https://cdn.jsdelivr.net/npm/@tabler/icons/icons/speakerphone.svg",
  "Phone Case": "https://cdn.jsdelivr.net/npm/@tabler/icons/icons/device-mobile-message.svg",
};

export function getProductImage(product) {
  return (
    productImages[product?.name] ||
    "https://cdn.jsdelivr.net/npm/@tabler/icons/icons/shopping-bag.svg"
  );
}
