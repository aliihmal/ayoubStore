// src/components/AddProductForm.tsx
//
// The owner-only form for adding a new frame to the collection.
// Submits the image + product fields together to the Spring Boot backend.

import { useState, type FormEvent } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { addProduct, type Category } from '../../lib/api';

type Status = 'idle' | 'submitting' | 'success' | 'error';

const inputClass =
  'rounded-md border border-[#111]/15 bg-white px-4 py-3 text-[14px] outline-none focus:border-[#2b82a4]';

export function AddProductForm({ onAdded }: { onAdded?: () => void }) {
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category>('Optical');
  const [price, setPrice] = useState('');
  const [tone, setTone] = useState('');
  const [description, setDescription] = useState('');
  const [details, setDetails] = useState('');
  const [colors, setColors] = useState('');
  const [badge, setBadge] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  function resetForm() {
    setName('');
    setPrice('');
    setTone('');
    setDescription('');
    setDetails('');
    setColors('');
    setBadge('');
    setFile(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!file) {
      setStatus('error');
      setErrorMessage('Choose an image to upload.');
      return;
    }
    if (!name.trim() || !price.trim()) {
      setStatus('error');
      setErrorMessage('Name and price are required.');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    try {
      await addProduct(
        { name, category, price, tone, description, details, colors, badge, image: file },
        password,
      );
      setStatus('success');
      resetForm();
      onAdded?.();
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong.');
    }
  }

  return (
    <section
      className="border-t border-[#111]/10 bg-[#f6fbfd] px-5 py-20 md:px-10 md:py-28"
      aria-label="Owner: add to collection"
    >
      <div className="mx-auto max-w-[720px]">
        <p className="font-mono-ui text-[10px] uppercase tracking-[0.24em] text-[#2b82a4]">Owner only</p>
        <h2 className="mt-4 font-display text-[clamp(2rem,4vw,3rem)] leading-[.95] tracking-[-.04em]">
          Add a new frame
        </h2>
        <p className="mt-4 max-w-[480px] text-[13px] leading-6 text-[#111]/60">
          Upload a photo and the frame's details. It's saved by the backend and appears in the collection right
          away.
        </p>

        <form onSubmit={handleSubmit} className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <input
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Owner password"
            data-testid="input-owner-password"
            className={`sm:col-span-2 ${inputClass}`}
          />
          <input
            type="text"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Name (e.g. Atlas 01)"
            data-testid="input-product-name"
            className={inputClass}
          />
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value as Category)}
            data-testid="select-product-category"
            className={inputClass}
          >
            <option value="Optical">Optical</option>
            <option value="Sun">Sun</option>
            <option value="Blue light">Blue light</option>
          </select>
          <input
            type="text"
            required
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            placeholder="Price (e.g. $210)"
            data-testid="input-product-price"
            className={inputClass}
          />
          <input
            type="text"
            value={tone}
            onChange={(event) => setTone(event.target.value)}
            placeholder="Tone (e.g. Ink acetate)"
            data-testid="input-product-tone"
            className={inputClass}
          />
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Description"
            rows={3}
            data-testid="input-product-description"
            className={`sm:col-span-2 resize-none ${inputClass}`}
          />
          <input
            type="text"
            value={details}
            onChange={(event) => setDetails(event.target.value)}
            placeholder="Details, comma separated"
            data-testid="input-product-details"
            className={inputClass}
          />
          <input
            type="text"
            value={colors}
            onChange={(event) => setColors(event.target.value)}
            placeholder="Colors, comma separated"
            data-testid="input-product-colors"
            className={inputClass}
          />
          <input
            type="text"
            value={badge}
            onChange={(event) => setBadge(event.target.value)}
            placeholder="Badge (optional)"
            data-testid="input-product-badge"
            className={inputClass}
          />
          <label className="sm:col-span-2 flex flex-col gap-2 text-[12px] text-[#111]/60">
            Product image
            <input
              type="file"
              accept="image/*"
              required
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              data-testid="input-product-image"
              className={`${inputClass} py-2`}
            />
          </label>

          <button
            type="submit"
            disabled={status === 'submitting'}
            data-testid="button-add-product"
            className="group flex items-center justify-center gap-3 rounded-full bg-[#111] px-6 py-3.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#eaf8fd] transition-transform duration-300 hover:-translate-y-1 disabled:opacity-50 sm:col-span-2"
          >
            {status === 'submitting' ? 'Adding frame…' : 'Add to collection'}
            <ArrowUpRight
              size={15}
              strokeWidth={1.5}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </button>

          <div aria-live="polite" data-testid="status-add-product" className="sm:col-span-2 text-[12px] leading-5">
            {status === 'success' && <span className="text-[#2b82a4]">Added — it's live in the collection.</span>}
            {status === 'error' && <span className="text-red-600">{errorMessage}</span>}
          </div>
        </form>
      </div>
    </section>
  );
}
