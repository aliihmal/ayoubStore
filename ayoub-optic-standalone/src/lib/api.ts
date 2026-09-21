// src/lib/api.ts
//
// Talks to the Spring Boot backend: fetching the owner-added products and
// submitting the "add a new frame" form (image + fields, as multipart data).
//
// Set VITE_API_BASE_URL in a .env file if the backend isn't on localhost:8080
// (e.g. once it's deployed somewhere).

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export type Category = 'Optical' | 'Sun' | 'Blue light';

export type NewProductInput = {
  name: string;
  category: Category;
  price: string;
  tone: string;
  description: string;
  details: string; // comma-separated text as typed in the form; the backend splits it
  colors: string; // comma-separated text as typed in the form
  badge?: string;
  image: File;
};

// The backend returns image paths like "/images/xyz.jpg" (relative to itself).
// Prefix those with the API base URL so <img src> resolves correctly; leave
// any already-absolute URL (like the curated Pexels defaults) untouched.
function resolveImageUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
}

export async function fetchOwnerProducts<T extends { image: string }>(): Promise<T[]> {
  const response = await fetch(`${API_BASE_URL}/api/products`);
  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`Backend returned ${response.status}: ${body}`);
  }
  const data: T[] = await response.json();
  return data.map((product) => ({ ...product, image: resolveImageUrl(product.image) }));
}

export async function addProduct(input: NewProductInput, ownerPassword: string): Promise<void> {
  const formData = new FormData();
  formData.append('image', input.image);
  formData.append('name', input.name);
  formData.append('category', input.category);
  formData.append('price', input.price);
  formData.append('tone', input.tone);
  formData.append('description', input.description);
  formData.append('details', input.details);
  formData.append('colors', input.colors);
  if (input.badge) formData.append('badge', input.badge);

  const response = await fetch(`${API_BASE_URL}/api/products`, {
    method: 'POST',
    headers: { 'X-Owner-Password': ownerPassword },
    body: formData,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || 'Could not save the product.');
  }
}