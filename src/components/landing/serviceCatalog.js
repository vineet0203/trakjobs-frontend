import axios from 'axios';

const serviceCatalog = [
  {
    name: "Home Repair Services",
    services: [
      { name: "Door Repair & Installation", basePrice: 89, duration: "2 hrs" },
      { name: "Window Repair", basePrice: 79, duration: "2 hrs" },
      { name: "Drywall Repair", basePrice: 99, duration: "2-3 hrs" },
      { name: "Wall Patching", basePrice: 69, duration: "1.5 hrs" },
      { name: "Ceiling Repair", basePrice: 109, duration: "2-3 hrs" },
      { name: "Furniture Assembly", basePrice: 59, duration: "1-2 hrs" },
      { name: "Curtain & Blind Installation", basePrice: 75, duration: "2 hrs" },
      { name: "Lock Replacement", basePrice: 85, duration: "1 hr" },
      { name: "Shelf Installation", basePrice: 65, duration: "1.5 hrs" },
      { name: "TV Wall Mounting", basePrice: 79, duration: "1.5 hrs" },
    ],
  },
  {
    name: "Electrical Services",
    services: [
      { name: "Light Installation", basePrice: 89, duration: "2 hrs" },
      { name: "Fan Installation", basePrice: 95, duration: "2 hrs" },
      { name: "Switch & Socket Repair", basePrice: 69, duration: "1.5 hrs" },
      { name: "Wiring Repair", basePrice: 119, duration: "2-3 hrs" },
      { name: "Doorbell Installation", basePrice: 59, duration: "1 hr" },
      { name: "CCTV Installation", basePrice: 129, duration: "3 hrs" },
      { name: "Power Backup Setup", basePrice: 149, duration: "3-4 hrs" },
    ],
  },
  {
    name: "Plumbing Services",
    services: [
      { name: "Tap Repair", basePrice: 65, duration: "1 hr" },
      { name: "Pipe Leakage Repair", basePrice: 89, duration: "2 hrs" },
      { name: "Toilet Repair", basePrice: 99, duration: "2 hrs" },
      { name: "Sink Installation", basePrice: 119, duration: "2-3 hrs" },
      { name: "Water Tank Cleaning", basePrice: 109, duration: "2-3 hrs" },
      { name: "Bathroom Fitting Installation", basePrice: 139, duration: "3 hrs" },
      { name: "Shower Repair", basePrice: 79, duration: "1.5 hrs" },
    ],
  },
  {
    name: "Painting & Wall Services",
    services: [
      { name: "Interior Painting", basePrice: 199, duration: "4-6 hrs" },
      { name: "Exterior Painting", basePrice: 249, duration: "6-8 hrs" },
      { name: "Texture Painting", basePrice: 179, duration: "4 hrs" },
      { name: "Wallpaper Installation", basePrice: 159, duration: "3-4 hrs" },
      { name: "Wall Cleaning", basePrice: 89, duration: "2 hrs" },
      { name: "Waterproofing", basePrice: 219, duration: "4-6 hrs" },
    ],
  },
  {
    name: "Carpentry Services",
    services: [
      { name: "Modular Furniture Work", basePrice: 129, duration: "3 hrs" },
      { name: "Cabinet Repair", basePrice: 89, duration: "2 hrs" },
      { name: "Wooden Door Repair", basePrice: 99, duration: "2 hrs" },
      { name: "Bed Repair", basePrice: 109, duration: "2 hrs" },
      { name: "Custom Shelves", basePrice: 95, duration: "2 hrs" },
      { name: "Kitchen Cabinet Installation", basePrice: 179, duration: "4 hrs" },
    ],
  },
  {
    name: "Cleaning Services",
    services: [
      { name: "Deep Home Cleaning", basePrice: 149, duration: "4 hrs" },
      { name: "Sofa Cleaning", basePrice: 89, duration: "2 hrs" },
      { name: "Carpet Cleaning", basePrice: 99, duration: "2-3 hrs" },
      { name: "Kitchen Cleaning", basePrice: 109, duration: "3 hrs" },
      { name: "Bathroom Cleaning", basePrice: 79, duration: "2 hrs" },
      { name: "Water Tank Cleaning", basePrice: 119, duration: "3 hrs" },
    ],
  },
  {
    name: "Appliance Services",
    services: [
      { name: "AC Service & Repair", basePrice: 129, duration: "2 hrs" },
      { name: "Refrigerator Repair", basePrice: 109, duration: "2 hrs" },
      { name: "Washing Machine Repair", basePrice: 99, duration: "2 hrs" },
      { name: "Microwave Repair", basePrice: 89, duration: "1.5 hrs" },
      { name: "Geyser Installation", basePrice: 119, duration: "2 hrs" },
      { name: "Chimney Cleaning", basePrice: 79, duration: "1.5 hrs" },
    ],
  },
  {
    name: "Outdoor Services",
    services: [
      { name: "Garden Maintenance", basePrice: 99, duration: "2 hrs" },
      { name: "Grass Cutting", basePrice: 69, duration: "1.5 hrs" },
      { name: "Fence Repair", basePrice: 119, duration: "2-3 hrs" },
      { name: "Pressure Washing", basePrice: 89, duration: "2 hrs" },
      { name: "Outdoor Lighting", basePrice: 109, duration: "2 hrs" },
    ],
  },
  {
    name: "Smart Home & Installation",
    services: [
      { name: "WiFi Setup", basePrice: 79, duration: "1.5 hrs" },
      { name: "Smart Lock Installation", basePrice: 129, duration: "2 hrs" },
      { name: "Smart Camera Setup", basePrice: 139, duration: "2 hrs" },
      { name: "Home Automation Setup", basePrice: 179, duration: "3 hrs" },
    ],
  },
  {
    name: "Moving & Support Services",
    services: [
      { name: "Packing & Unpacking", basePrice: 149, duration: "4 hrs" },
      { name: "Local Shifting Help", basePrice: 129, duration: "3-4 hrs" },
      { name: "Heavy Item Moving", basePrice: 159, duration: "4 hrs" },
      { name: "Office Setup Assistance", basePrice: 139, duration: "3 hrs" },
    ],
  },
];

export const fetchServiceCatalog = async () => {
  try {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";
    const response = await axios.get(`${apiBaseUrl}/api/v1/service-categories`);
    
    if (response.data && response.data.data) {
      const categories = response.data.data;
      return categories.map((cat) => {
        // Try to match the dynamic category name with our existing hardcoded catalog
        const existing = serviceCatalog.find(
          (item) =>
            item.name.toLowerCase() === cat.name.toLowerCase() ||
            item.name.toLowerCase().replace(" services", "") === cat.name.toLowerCase().replace(" services", "") ||
            item.name.toLowerCase().includes(cat.name.toLowerCase()) ||
            cat.name.toLowerCase().includes(item.name.toLowerCase())
        );

        return {
          name: cat.name,
          slug: cat.slug,
          services: existing ? existing.services : [],
        };
      });
    }
    return serviceCatalog;
  } catch (error) {
    console.error("Failed to fetch service categories from API, using fallback", error);
    return serviceCatalog;
  }
};

export default serviceCatalog;
