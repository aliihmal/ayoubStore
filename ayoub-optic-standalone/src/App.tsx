import { type FormEvent, type ReactNode, useEffect, useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowDownRight, ArrowUpRight, Bot, Check, Clock3, Eye, Instagram, Mail, MapPin, Menu, MessageCircle, Minus, Phone, Plus, Search, Send, X } from 'lucide-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AddProductForm } from '@/components/ui/AddProductForm';
import { fetchOwnerProducts } from '@/lib/api';
import NotFound from '@/pages/not-found';
import { Link, Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

import optic1 from './images/optic1.jpg';
import optic2 from './images/optic2.jpg';
import optic3 from './images/optic3.jpg';
import optic4 from './images/optic4.jpg';
import optic5 from './images/optic5.jpg';
import optic6 from './images/optic6.jpg';
import optic7 from './images/optic7.jpg';
import optic8 from './images/optic8.jpg';
import optic9 from './images/optic9.jpg';
import optic10 from './images/optic10.jpg';
import optic11 from './images/optic11.jpg';
import optic12 from './images/optic12.jpg';
import optic13 from './images/optic13.jpg';
import optic14 from './images/optic14.jpg';
import optic15 from './images/optic15.jpg';
import optic16 from './images/optic16.jpg';
import optic17 from './images/optic17.jpg';

const queryClient = new QueryClient();

type Product = {
  id: string;
  name: string;
  category: 'Optical' | 'Sun' | 'Blue light';
  price: string;
  image: string;
  tone: string;
  description: string;
  details: string[];
  colors: string[];
  badge?: string;
};

const defaultProducts: Product[] = [
  {
    id: 'Paparazzi',
    name: 'Paparazzi',
    category: 'Optical',
    price: '$80',
    image: optic1,
    tone: 'Matte Black',
    description: 'Timeless Venetian elegance. A classic, bold silhouette with a comfortable keyhole bridge.',
    details: ['Hand-finished acetate', 'Clear premium lenses', 'Standard fit'],
    colors: ['Matte Black', 'Ink', 'Tortoise'],
    badge: 'Timeless Elegance',
  },
  {
    id: 'smudge-b-titanium',
    name: 'Ray-Ban',
    category: 'Optical',
    price: '$90',
    image: optic2,
    tone: 'Blue Metal',
    description: 'Premium B-Titanium craftsmanship. Lightweight, durable, and designed for everyday wear.',
    details: ['B-Titanium frame', 'Model 51216', '47-18-144 mm'],
    colors: ['Blue', 'Silver', 'Gunmetal'],
    badge: 'Lightweight',
  },
  {
    id: 'solstice-uv400',
    name: 'Paparazzi',
    category: 'Optical',
    price: '$80',
    image: optic3,
    tone: 'Gloss Black',
    description: 'Premium polarized lenses with UV400 protection. Part of the Marcs & Polo Collection.',
    details: ['Polarized lenses', 'UV400 Protection', 'Marcs & Polo Collection'],
    colors: ['Black', 'Tortoise'],
    badge: 'Summer Essential',
  },
  {
    id: 'comogan-tr310',
    name: 'Marcs & Polo',
    category: 'Optical',
    price: '$90',
    image: optic4,
    tone: 'Clear Crystal',
    description: 'Timeless Comogan craftsmanship. Features unique red gemstone accents and a classic car charm.',
    details: ['TR 310', '51-16-142 mm', 'Red gemstone rivets'],
    colors: ['Clear', 'Grey'],
    badge: 'Craftsmanship',
  },
  {
    id: 'dvittorio-52182',
    name: "Solstice",
    category: 'Optical',
    price: '$90',
    image: optic5,
    tone: 'Translucent Lilac',
    description: 'Timeless Venetian elegance. A soft cat-eye shape with delicate detailing and a car charm.',
    details: ['52182', '51-16-140 mm', 'Venetian Elegance'],
    colors: ['Lilac', 'Clear', 'Pink'],
    badge: 'Elegance',
  },
  {
    id: 'starium-alloy',
    name: 'Premium Polarized',
    category: 'Sun',
    price: '$90',
    image: optic6,
    tone: 'Amber Gradient',
    description: 'A striking mix of black and clear acetate with warm amber gradient lenses.',
    details: ['Starium Alloy', 'Category 3 Lens', 'UV Protection'],
    colors: ['Black/Clear', 'Tortoise'],
  },
  {
    id: 'umberto-t',
    name: 'Retro Aviator',
    category: 'Optical',
    price: '$35',
    image: optic7,
    tone: 'Translucent Grey',
    description: 'A refined frame featuring a central red gemstone detail and premium metal accents.',
    details: ['TR 90', '51-18-140 mm', 'Red gemstone detail'],
    colors: ['Grey', 'Brown'],
    badge: 'Luxury Detail',
  },
  {
    id: 'paparazzi-junior',
    name: 'RAY-BAN',
    category: 'Optical',
    price: '$35',
    image: optic8,
    tone: 'Black',
    description: 'Flex for Kids. Durable, flexible frames designed specifically for active children.',
    details: ['Flex for Kids', 'Impact resistant', 'Comfort fit'],
    colors: ['Black', 'Blue', 'Red'],
    badge: 'Kids Collection',
  },
  {
    id: 'vittorio-veneto-clear',
    name: 'Lorsd',
    category: 'Optical',
    price: '$25',
    image: optic9,
    tone: 'Clear Crystal',
    description: 'Timeless Venetian elegance in a translucent finish. Lightweight and versatile.',
    details: ['Clear acetate', 'Car charm', 'Venetian Elegance'],
    colors: ['Clear', 'Pink'],
  },
  {
    id: 'rayban-hexagonal',
    name: 'D-Vittorio',
    category: 'Sun',
    price: '$50',
    image: optic10,
    tone: 'Dark Grey',
    description: 'A modern take on a classic shape. Flat lenses and a distinctive hexagonal silhouette.',
    details: ['Ray-Ban', 'Flat Lenses', 'Hexagonal shape'],
    colors: ['Dark Grey', 'Gold', 'Black'],
    badge: 'Iconic',
  },
  {
    id: 'paparazzi-kids',
    name: 'Vittorio Veneto',
    category: 'Optical',
    price: '$50',
    image: optic11,
    tone: 'Lilac',
    description: 'Flex for Kids. Fun, colorful, and flexible frames that can handle everyday play.',
    details: ['Flex for Kids', 'Paparazzi', 'Durable TR90'],
    colors: ['Lilac', 'Pink', 'Blue'],
    badge: 'Kids Collection',
  },
  {
    id: 'rayban-anti-blue',
    name: 'Comogan Eyewear',
    category: 'Blue light',
    price: '$20',
    image: optic12,
    tone: 'Clear',
    description: 'Elevate your vision. Ray-Ban Clear Anti-Blue Light Collection to protect your eyes from screens.',
    details: ['Anti Blue Light', 'UV 400', 'Ray-Ban Clear'],
    colors: ['Clear'],
    badge: 'Screen Protection',
  },
  {
    id: 'llord-tri005',
    name: 'Smudge B-Titanium',
    category: 'Optical',
    price: '$30',
    image: optic13,
    tone: 'Matte Silver',
    description: 'A sleek, minimalist metal frame from the TRI005 Collection. Lightweight and professional.',
    details: ['TR1005', '52-18-140 mm', 'TRI005 Collection'],
    colors: ['Silver', 'Gunmetal'],
  },
  {
    id: 'luxury-italy',
    name: 'Vittorio Veneto',
    category: 'Optical',
    price: '$50',
    image: optic14,
    tone: 'Black Metal',
    description: 'Italian craftsmanship and titanium perfection. A premium round metal frame.',
    details: ['Titanium', 'VC-77162', '46-17-145 mm'],
    colors: ['Black', 'Gold', 'Silver'],
    badge: 'Titanium Perfection',
  },
  {
    id: 'chanel-anti-blue',
    name: 'Square Magnetic Clip-On',
    category: 'Blue light',
    price: '$30',
    image: optic15,
    tone: 'Matte Black',
    description: 'High-fashion protection. Chanel frames equipped with anti-blue light technology for digital clarity.',
    details: ['Anti Blue Light', 'UV 400', 'Chanel'],
    colors: ['Black', 'Tortoise'],
    badge: 'Designer',
  },
  {
    id: 'solstice-aviator',
    name: 'Luxury Italy',
    category: 'Sun',
    price: '$30',
    image: optic16,
    tone: 'Gold Metal',
    description: 'Summer Ready Aviators. Premium polarized lenses with UV400 protection for bright days.',
    details: ['Polarized', 'UV400 Protection', 'Solstice Optics'],
    colors: ['Gold', 'Silver'],
    badge: 'Summer Ready',
  },
  {
    id: 'solstice-classic-aviator',
    name: 'Chanel Blue Light',
    category: 'Sun',
    price: '$35',
    image: optic17,
    tone: 'Bronze',
    description: 'Classic aviator styling with warm bronze lenses. Perfect for the beach or the city.',
    details: ['Polarized', 'UV400 Protection', 'Aviator shape'],
    colors: ['Bronze', 'Gold'],
  },
];

// Merges your 17 curated frames above with whatever the owner has added
// through the backend. If the backend isn't running (e.g. local dev without
// it started), this quietly falls back to just the 17 defaults.
async function fetchProducts(): Promise<Product[]> {
  try {
    const added = await fetchOwnerProducts<Product>();
    console.log("Succsseddeded");
    return [...defaultProducts, ...added];
  } catch (error) {
    console.error('Could not load owner products:', error);  // ← add this line
    return defaultProducts;
  }
}

function useProductCatalog() {
  const { data } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    initialData: defaultProducts,
    staleTime: 30_000,
  });
  return data;
}

const navItems = [
  { label: 'Collection', target: 'collection' },
  { label: 'Our approach', target: 'approach' },
  { label: 'Visit us', target: 'contact' },
];

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const updateProgress = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(scrollable > 0 ? Math.min(1, window.scrollY / scrollable) : 0);
      });
    };

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, []);

  return (
    <div className="scroll-progress" aria-hidden="true">
      <span style={{ transform: `scaleX(${progress})` }} />
    </div>
  );
}

const chatbotTopics = [
  {
    label: 'Opening hours',
    keywords: ['hour', 'hours', 'open', 'opening', 'time', 'when'],
    answer: 'Our studio is open Monday to Saturday, from 10:00 to 7:00.',
  },
  {
    label: 'Where are you?',
    keywords: ['where', 'location', 'address', 'visit', 'studio', 'find'],
    answer: 'You can visit us at Ghobeiry, Rawdat Al shahidain beside al safa Sweets.',
  },
  {
    label: 'Book a fitting',
    keywords: ['book', 'fitting', 'appointment', 'consultation', 'fit'],
    answer: 'Tell us a little about your style through the contact form and we’ll help arrange a thoughtful fitting.',
  },
  {
    label: 'Frame categories',
    keywords: ['category', 'categories', 'optical', 'sun', 'sunglasses', 'blue light', 'collection'],
    answer: 'We carry optical frames, sun frames, and blue-light frames. Browse the full edit from the collection page.',
  },
];

type ChatMessage = {
  role: 'assistant' | 'user';
  text: string;
};

function LimitedChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      text: 'Hi, I’m the AYOUB guide. Ask me about our hours, location, fittings, or frame categories.',
    },
  ]);

  function answerQuestion(value: string) {
    const trimmed = value.trim();
    if (!trimmed) return;
    const normalized = trimmed.toLowerCase();
    const topic = chatbotTopics.find((item) => item.keywords.some((keyword) => normalized.includes(keyword)));
    const answer = topic?.answer ?? 'I can only help with hours, location, fittings, and frame categories. Choose one of the questions below and I’ll point you in the right direction.';

    setMessages((current) => [
      ...current,
      { role: 'user', text: trimmed },
      { role: 'assistant', text: answer },
    ]);
    setQuestion('');
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    answerQuestion(question);
  }

  return (
    <>
      <div id="ayoub-chatbot-panel" className={`chatbot-panel ${isOpen ? 'chatbot-panel--open' : ''}`} aria-hidden={!isOpen}>
        <div className="flex items-start justify-between gap-4 border-b border-[#111]/10 p-5">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#111] text-[#a9ddf5]"><Bot size={17} strokeWidth={1.5} /></span>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em]">AYOUB guide</p>
              <p className="mt-1 font-mono-ui text-[9px] uppercase tracking-[0.12em] text-[#111]/45">Limited studio assistant</p>
            </div>
          </div>
          <button type="button" onClick={() => setIsOpen(false)} className="flex h-8 w-8 items-center justify-center rounded-full border border-[#111]/15 transition-colors hover:bg-[#111] hover:text-[#eaf8fd]" aria-label="Close chatbot">
            <X size={15} strokeWidth={1.5} />
          </button>
        </div>
        <div className="chatbot-messages flex max-h-64 flex-col gap-3 overflow-y-auto p-5" aria-live="polite">
          {messages.map((message, index) => (
            <div key={`${message.role}-${index}`} className={`chatbot-message ${message.role === 'user' ? 'chatbot-message--user self-end' : 'chatbot-message--assistant self-start'}`}>
              {message.text}
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 px-5 pb-4">
          {chatbotTopics.map((topic) => (
            <button key={topic.label} type="button" onClick={() => answerQuestion(topic.label)} className="rounded-full border border-[#111]/15 px-3 py-2 text-[9px] font-bold uppercase tracking-[0.11em] text-[#111]/65 transition-all hover:-translate-y-0.5 hover:border-[#111] hover:text-[#111]">
              {topic.label}
            </button>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-[#111]/10 p-4">
          <label className="sr-only" htmlFor="chatbot-question">Ask the AYOUB guide</label>
          <input id="chatbot-question" value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask a supported question..." className="min-w-0 flex-1 bg-transparent px-1 py-2 text-[12px] outline-none placeholder:text-[#111]/35" />
          <button type="submit" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#111] text-[#a9ddf5] transition-transform hover:-translate-y-0.5" aria-label="Send chatbot question">
            <Send size={14} strokeWidth={1.5} />
          </button>
        </form>
      </div>
      <button type="button" className={`chatbot-launcher ${isOpen ? 'chatbot-launcher--open' : ''}`} onClick={() => setIsOpen((current) => !current)} aria-expanded={isOpen} aria-controls="ayoub-chatbot-panel" aria-label={isOpen ? 'Close AYOUB guide' : 'Open AYOUB guide'}>
        <span className="chatbot-launcher__ring" />
        {isOpen ? <X size={20} strokeWidth={1.5} /> : <MessageCircle size={20} strokeWidth={1.5} />}
        <span className="sr-only">{isOpen ? 'Close AYOUB guide' : 'Open AYOUB guide'}</span>
      </button>
    </>
  );
}

function useRevealObserver() {
  useEffect(() => {
    const items = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));
    if (!('IntersectionObserver' in window)) {
      items.forEach((item) => item.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);
}

function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <button
      type="button"
      onClick={() => scrollToId('top')}
      data-testid="button-logo-home"
      aria-label="AYOUB Optic home"
      className={`group flex items-center gap-2 ${dark ? 'text-[#eaf8fd]' : 'text-[#111]'}`}
    >
      <span className="relative flex h-8 w-8 items-center justify-center rounded-full border border-current">
        <span className="h-2.5 w-2.5 rounded-full border border-current transition-transform duration-300 group-hover:scale-[1.8]" />
      </span>
      <span className="text-[13px] font-extrabold uppercase tracking-[0.22em]">Ayoub Optic</span>
    </button>
  );
}

function FrameArtwork({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 760 560"
      role="img"
      aria-label="Sculptural baby-blue eyewear frame"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform="rotate(-7 380 280)">
        <path d="M115 243 53 211" stroke="#111111" strokeWidth="8" strokeLinecap="round" />
        <path d="M645 243 707 211" stroke="#111111" strokeWidth="8" strokeLinecap="round" />
        <rect x="100" y="176" width="245" height="178" rx="84" fill="#EAF8FD" fillOpacity=".72" stroke="#111111" strokeWidth="10" />
        <rect x="415" y="176" width="245" height="178" rx="84" fill="#EAF8FD" fillOpacity=".72" stroke="#111111" strokeWidth="10" />
        <path d="M345 229C369 205 391 205 415 229" stroke="#111111" strokeWidth="10" strokeLinecap="round" />
        <path d="M142 221C192 190 251 191 301 218" stroke="#A9DDF5" strokeWidth="18" strokeLinecap="round" opacity=".95" />
        <path d="M457 221C507 190 566 191 616 218" stroke="#A9DDF5" strokeWidth="18" strokeLinecap="round" opacity=".95" />
        <path d="M152 309C199 337 257 337 303 309" stroke="#B9E7F6" strokeWidth="9" strokeLinecap="round" opacity=".8" />
        <path d="M456 309C503 337 561 337 608 309" stroke="#B9E7F6" strokeWidth="9" strokeLinecap="round" opacity=".8" />
        <circle cx="171" cy="264" r="7" fill="#111111" />
        <circle cx="589" cy="264" r="7" fill="#111111" />
      </g>
    </svg>
  );
}

function Header({ onOpenMenu, collectionPage = false }: { onOpenMenu: () => void; collectionPage?: boolean }) {
  const navigateTo = (target: string) => {
    if (collectionPage) {
      window.location.href = `/#${target}`;
      return;
    }
    scrollToId(target);
  };

  return (
    <header className="absolute left-0 right-0 top-0 z-30 px-5 py-5 md:px-10 md:py-7">
      <nav className="mx-auto flex max-w-[1440px] items-center justify-between" aria-label="Primary navigation">
        <Logo />
        <div className="hidden items-center gap-9 md:flex">
          {navItems.map((item) => (
            <button
              key={item.target}
              type="button"
              onClick={() => navigateTo(item.target)}
              data-testid={`button-nav-${item.target}`}
              className="group relative text-[11px] font-bold uppercase tracking-[0.17em] text-[#111]/70 transition-colors hover:text-[#111]"
            >
              {item.label}
              <span className="absolute -bottom-2 left-0 h-px w-0 bg-[#111] transition-all duration-300 group-hover:w-full" />
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={onOpenMenu}
          data-testid="button-open-mobile-menu"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-[#111]/20 bg-[#eaf8fd]/70 md:hidden"
          aria-label="Open navigation menu"
        >
          <Menu size={18} strokeWidth={1.6} />
        </button>
        <button
          type="button"
          onClick={() => navigateTo('contact')}
          data-testid="button-book-consultation-header"
          className="hidden items-center gap-2 text-[11px] font-bold uppercase tracking-[0.17em] md:flex"
        >
          Book a consultation <ArrowUpRight size={15} strokeWidth={1.5} />
        </button>
      </nav>
    </header>
  );
}

function MobileMenu({ onClose, collectionPage = false }: { onClose: () => void; collectionPage?: boolean }) {
  const navigateTo = (target: string) => {
    onClose();
    if (collectionPage) {
      window.location.href = `/#${target}`;
      return;
    }
    window.setTimeout(() => scrollToId(target), 100);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#111] p-6 text-[#eaf8fd] md:hidden" role="dialog" aria-modal="true" aria-label="Mobile navigation">
      <div className="flex items-center justify-between">
        <Logo dark />
        <button type="button" onClick={onClose} data-testid="button-close-mobile-menu" className="flex h-11 w-11 items-center justify-center rounded-full border border-[#eaf8fd]/30" aria-label="Close navigation menu">
          <X size={19} strokeWidth={1.5} />
        </button>
      </div>
      <div className="mt-24 flex flex-col items-start gap-7">
        {navItems.map((item, index) => (
          <button
            key={item.target}
            type="button"
            onClick={() => navigateTo(item.target)}
            data-testid={`button-mobile-nav-${item.target}`}
            className="flex items-end gap-3 font-display text-5xl italic leading-none text-[#eaf8fd]"
          >
            <span className="font-mono-ui text-xs not-italic text-[#a9ddf5]">0{index + 1}</span>{item.label}
          </button>
        ))}
      </div>
      <div className="mt-auto flex items-center justify-between border-t border-[#eaf8fd]/20 pt-5 text-[10px] uppercase tracking-[0.18em] text-[#eaf8fd]/65">
        <span>Open studio / Tue—Sat</span>
        <button type="button" onClick={() => navigateTo('contact')} data-testid="button-mobile-contact">Say hello <ArrowUpRight size={13} className="inline" /></button>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section id="top" className="relative min-h-[760px] overflow-hidden px-5 pb-16 pt-32 md:min-h-[860px] md:px-10 md:pt-40">
      <div className="absolute -right-24 top-20 h-[460px] w-[460px] rounded-full border border-[#111]/10 md:right-[8%] md:top-16 md:h-[660px] md:w-[660px]" />
      <div className="absolute -right-10 top-36 h-[330px] w-[330px] rounded-full border border-[#111]/10 md:right-[14%] md:top-32 md:h-[500px] md:w-[500px]" />
      <div className="relative mx-auto grid max-w-[1440px] items-end gap-12 md:grid-cols-[1.05fr_.95fr] md:gap-8">
        <div className="relative z-10 max-w-[760px]">
          <div className="reveal reveal-delay-1 mb-7 flex items-center gap-3">
            <span className="h-px w-9 bg-[#111]" />
            <span className="font-mono-ui text-[10px] uppercase tracking-[0.25em]">Independent optical studio / 2024</span>
          </div>
          <h1 className="reveal reveal-delay-2 text-balance font-display text-[clamp(4.5rem,11vw,10.5rem)] leading-[.79] tracking-[-.075em] text-[#111]">
            See the
            <br />
            <em className="ml-[.28em] text-[#2b82a4]">world</em>
            <br />
            differently.
          </h1>
          <div className="reveal reveal-delay-3 mt-10 flex max-w-[470px] items-end justify-between gap-7 md:ml-[13%]">
            <p className="text-[13px] leading-6 text-[#111]/65 md:text-[14px]">
              Eyewear with a point of view. Thoughtfully sourced, carefully fitted, and made to be lived in.
            </p>
            <button type="button" onClick={() => scrollToId('collection')} data-testid="button-hero-explore" className="group shrink-0 rounded-full bg-[#111] p-4 text-[#eaf8fd] transition-transform duration-300 hover:-translate-y-1" aria-label="Explore collection">
              <ArrowDownRight size={22} strokeWidth={1.3} className="transition-transform duration-300 group-hover:rotate-[-45deg]" />
            </button>
          </div>
        </div>
        <div className="reveal reveal-delay-3 hero-visual relative min-h-[330px] md:min-h-[550px]">
          <div className="hero-visual__wash absolute bottom-0 right-0 h-[290px] w-[83%] overflow-hidden rounded-[52%_48%_0_0/44%_44%_0_0] bg-[#a9ddf5] md:h-[515px]" />
          <div className="hero-visual__grain absolute bottom-0 right-0 h-[290px] w-[83%] overflow-hidden rounded-[52%_48%_0_0/44%_44%_0_0] md:h-[515px]" />
          <div className="hero-visual__frame absolute inset-x-0 bottom-9 z-10 md:bottom-20">
            <FrameArtwork className="h-auto w-full drop-shadow-[0_26px_24px_rgba(17,17,17,0.12)]" />
          </div>
          <div className="hero-visual__index absolute right-5 top-9 z-10 md:right-12 md:top-16">
            <span className="font-mono-ui text-[9px] uppercase tracking-[0.2em] text-[#111]/55">Object / 01</span>
            <span className="mt-2 block h-10 w-px bg-[#111]/25" />
          </div>
          <div className="absolute bottom-5 left-0 flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-[#111]/60 md:bottom-12">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#111]/20"><Eye size={15} strokeWidth={1.4} /></span>
            <span>Frames for<br />your point of view</span>
          </div>
        </div>
      </div>
      <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between border-t border-[#111]/15 pt-4 md:left-10 md:right-10">
        <span className="font-mono-ui text-[9px] uppercase tracking-[0.2em] text-[#111]/55">01 / 05 — Studio notes</span>
        <span className="font-mono-ui text-[9px] uppercase tracking-[0.2em] text-[#111]/55">Scroll to browse</span>
      </div>
    </section>
  );
}

function IntroStrip() {
  return (
    <section className="overflow-hidden bg-[#111] py-5 text-[#eaf8fd]" aria-label="Brand promise">
      <div className="marquee-track flex w-max items-center gap-8 whitespace-nowrap">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex items-center gap-8">
            <span className="font-display text-xl italic md:text-2xl">Vision meets style.</span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#a9ddf5]" />
            <span className="font-mono-ui text-[10px] uppercase tracking-[0.18em] text-[#a9ddf5]">Curated in our studio</span>
            <span className="h-px w-16 bg-[#eaf8fd]/30" />
            <span className="font-display text-xl italic md:text-2xl">Vision meets style.</span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#a9ddf5]" />
          </div>
        ))}
      </div>
    </section>
  );
}

function ProductCard({ product, onSelect }: { product: Product; onSelect: (product: Product) => void }) {
  return (
      <article className="product-card group reveal">
      <button type="button" onClick={() => onSelect(product)} data-testid={`button-view-product-${product.id}`} className="block w-full text-left">
        <div className="relative aspect-[.9] overflow-hidden bg-[#e2f3f8]">
          {product.badge && <span className="absolute left-4 top-4 z-10 rounded-full bg-[#111] px-3 py-1.5 font-mono-ui text-[9px] uppercase tracking-[0.16em] text-[#eaf8fd]">{product.badge}</span>}
          <img src={product.image} alt={`${product.name} ${product.tone} eyewear`} className="eyewear-image h-full w-full object-cover mix-blend-multiply opacity-90" />
          <span className="absolute bottom-4 right-4 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-[#eaf8fd] opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"><ArrowUpRight size={16} strokeWidth={1.5} /></span>
        </div>
        <div className="flex items-start justify-between gap-3 pt-4">
          <div>
            <h3 className="font-display text-[22px] leading-none">{product.name}</h3>
            <p className="mt-2 text-[11px] uppercase tracking-[0.15em] text-[#111]/50">{product.category} / {product.tone}</p>
          </div>
          <span className="font-mono-ui text-[12px]">{product.price}</span>
        </div>
      </button>
    </article>
  );
}

function Collection({ onSelect, preview = false, products }: { onSelect: (product: Product) => void; preview?: boolean; products: Product[] }) {
  const [filter, setFilter] = useState<'All' | Product['category']>('All');
  const filteredProducts = useMemo(() => filter === 'All' ? products : products.filter((product) => product.category === filter), [filter, products]);
  const visibleProducts = preview ? filteredProducts.slice(0, 6) : filteredProducts;
  const filters: Array<'All' | Product['category']> = ['All', 'Optical', 'Sun', 'Blue light'];

  return (
    <section id="collection" className="px-5 py-24 md:px-10 md:py-36">
      <div className="mx-auto max-w-[1440px]">
        <div className="reveal flex flex-col justify-between gap-10 md:flex-row md:items-end">
          <div>
            <p className="font-mono-ui text-[10px] uppercase tracking-[0.24em] text-[#2b82a4]">02 / The collection</p>
            <h2 className="mt-5 max-w-[600px] font-display text-[clamp(3.5rem,7vw,7.5rem)] leading-[.82] tracking-[-.07em]">Good design<br /><em>looks back.</em></h2>
          </div>
          <p className="max-w-[310px] text-[13px] leading-6 text-[#111]/60">A small edit of exceptional frames, selected for the way they move through real life — not a seasonal trend cycle.</p>
        </div>
        <div className="reveal mt-14 flex flex-wrap items-center gap-2 border-b border-[#111]/15 pb-4">
          {filters.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              data-testid={`button-filter-${item.toLowerCase().replace(' ', '-')}`}
              className={`rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-[0.16em] transition-colors ${filter === item ? 'bg-[#111] text-[#eaf8fd]' : 'border border-[#111]/15 text-[#111]/60 hover:border-[#111]/50 hover:text-[#111]'}`}
              aria-pressed={filter === item}
            >
              {item}
            </button>
          ))}
          <span className="ml-auto hidden items-center gap-2 font-mono-ui text-[10px] uppercase tracking-[0.14em] text-[#111]/45 md:flex"><Search size={13} /> {filteredProducts.length} frames</span>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-x-5 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
           {visibleProducts.map((product) => <ProductCard key={product.id} product={product} onSelect={onSelect} />)}
        </div>
         {preview && (
           <div className="reveal mt-14 flex justify-center">
             <Link
               href="/collection"
               data-testid="link-view-all-collection"
               className="collection-link group inline-flex items-center gap-3 rounded-full border border-[#111]/25 px-6 py-3.5 text-[10px] font-bold uppercase tracking-[0.16em] transition-all duration-300 hover:-translate-y-1 hover:border-[#111] hover:bg-[#111] hover:text-[#eaf8fd]"
             >
               View all the collection <ArrowUpRight size={15} strokeWidth={1.5} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
             </Link>
           </div>
         )}
      </div>
    </section>
  );
}

function Approach() {
  return (
    <section id="approach" className="relative overflow-hidden bg-[#a9ddf5] px-5 py-24 md:px-10 md:py-36">
      <div className="eyewear-grid absolute inset-0 opacity-50" />
      <div className="relative mx-auto grid max-w-[1440px] gap-16 md:grid-cols-[.8fr_1.2fr] md:gap-24">
        <div className="reveal">
          <p className="font-mono-ui text-[10px] uppercase tracking-[0.24em] text-[#111]/60">03 / Our approach</p>
          <h2 className="mt-6 font-display text-[clamp(4rem,8vw,8rem)] leading-[.8] tracking-[-.07em]">Vision<br /><em>meets</em><br />style.</h2>
        </div>
        <div className="grid content-end gap-12 md:pb-3">
          <div className="reveal reveal-delay-1 max-w-[560px]">
            <span className="mb-5 block font-mono-ui text-[11px] text-[#111]/55">01 — Curated, never crowded</span>
            <p className="font-display text-[clamp(1.65rem,3vw,3rem)] leading-[1.08] tracking-[-.035em]">The right frame changes the way you hold a room. We make the search feel as good as the find.</p>
          </div>
          <div className="grid gap-9 border-t border-[#111]/20 pt-8 sm:grid-cols-2">
            <div className="reveal reveal-delay-2">
              <h3 className="text-[12px] font-bold uppercase tracking-[0.14em]">Precise fit</h3>
              <p className="mt-3 max-w-[230px] text-[13px] leading-6 text-[#111]/65">A proper fitting, done patiently. We adjust until the frame disappears into your day.</p>
            </div>
            <div className="reveal reveal-delay-3">
              <h3 className="text-[12px] font-bold uppercase tracking-[0.14em]">Long view</h3>
              <p className="mt-3 max-w-[230px] text-[13px] leading-6 text-[#111]/65">Materials with a point of view and craftsmanship that holds up to the everyday.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StudioNote() {
  return (
    <section className="px-5 py-24 md:px-10 md:py-36">
      <div className="mx-auto grid max-w-[1440px] items-center gap-14 md:grid-cols-[1.1fr_.9fr] md:gap-24">
        <div className="reveal relative order-2 md:order-1">
          <div className="studio-still-life aspect-[1.15] overflow-hidden bg-[#d2edf5]">
            <div className="studio-still-life__grid absolute inset-0" />
            <div className="studio-still-life__orb absolute -right-12 -top-16 h-56 w-56 rounded-full border border-[#111]/15" />
            <div className="studio-still-life__orb absolute -right-1 -top-5 h-32 w-32 rounded-full border border-[#111]/15" />
            <FrameArtwork className="studio-still-life__frame absolute left-[-8%] top-[13%] h-auto w-[118%] md:left-[-2%] md:w-[105%]" />
            <div className="absolute bottom-7 left-7 flex items-center gap-3 font-mono-ui text-[9px] uppercase tracking-[0.18em] text-[#111]/55">
              <span className="h-px w-8 bg-[#111]/50" />
              <span>Hand-finished / AYOUB 01</span>
            </div>
          </div>
          <div className="absolute -bottom-6 -right-2 flex h-24 w-24 rotate-6 items-center justify-center rounded-full border border-[#111]/20 bg-[#eaf8fd] text-center md:-right-8">
            <span className="font-mono-ui text-[9px] uppercase leading-4 tracking-[0.12em]">Take<br />your<br />time</span>
          </div>
        </div>
        <div className="reveal order-1 md:order-2">
          <p className="font-mono-ui text-[10px] uppercase tracking-[0.24em] text-[#2b82a4]">A note from the studio</p>
          <blockquote className="mt-7 font-display text-[clamp(2.3rem,4.4vw,4.8rem)] leading-[.95] tracking-[-.06em]">“There is no such thing as a universal face. There is only your face, and the frame that lets it be seen.”</blockquote>
          <div className="mt-9 flex items-center gap-3">
            <span className="h-px w-10 bg-[#111]" />
            <span className="font-mono-ui text-[10px] uppercase tracking-[0.17em] text-[#111]/60">Ayoub / Founder & optician</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    
    // Validate inputs
    if (!email || !email.includes('@') || message.trim().length < 10) {
      setStatus('error');
      return;
    }

    // Construct the WhatsApp message
    // Country code + number, no + or spaces (Lebanon +961)
    const phoneNumber = '96171595276'; 
    const encodedMessage = encodeURIComponent(
      `New Inquiry from Website:\n\nEmail: ${email}\n\nMessage: ${message}`
    );
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    // Open WhatsApp in a new tab
    window.open(whatsappUrl, '_blank');

    // Show success state
    setStatus('success');
    
    // Clear the form
    setEmail('');
    setMessage('');
  }

  return (
    <section id="contact" className="bg-[#111] px-5 py-24 text-[#eaf8fd] md:px-10 md:py-32">
      <div className="mx-auto grid max-w-[1440px] gap-16 md:grid-cols-[.9fr_1.1fr] md:gap-28">
        <div className="reveal">
          <p className="font-mono-ui text-[10px] uppercase tracking-[0.24em] text-[#a9ddf5]">04 / Come say hello</p>
          <h2 className="mt-7 font-display text-[clamp(4rem,8vw,8rem)] leading-[.8] tracking-[-.07em]">Let’s find<br /><em>your</em><br />perfect<br />frame.</h2>
          <div className="mt-12 grid gap-6 text-[12px] text-[#eaf8fd]/65 sm:grid-cols-2">
            <div><MapPin size={16} strokeWidth={1.3} className="mb-3 text-[#a9ddf5]" /><p>Rawdat al shahiden<br />Ghobeiry</p></div>
            <div><Clock3 size={16} strokeWidth={1.3} className="mb-3 text-[#a9ddf5]" /><p>Mon—Sat<br />10:00—19:00</p></div>
          </div>
        </div>
        <div className="reveal reveal-delay-2 md:pt-12">
          <p className="max-w-[430px] text-[14px] leading-6 text-[#eaf8fd]/65">Tell us what you’re looking for, or just tell us a little about your style. We’ll make time for a thoughtful answer.</p>
          <form onSubmit={handleSubmit} className="mt-12" noValidate>
            <label className="block border-b border-[#eaf8fd]/25 py-3">
              <span className="sr-only">Your email address</span>
              <input type="email" value={email} onChange={(event) => { setEmail(event.target.value); setStatus('idle'); }} data-testid="input-contact-email" placeholder="Your email address" className="w-full bg-transparent text-[16px] text-[#eaf8fd] placeholder:text-[#eaf8fd]/40 outline-none" aria-invalid={status === 'error' && !email.includes('@')} />
            </label>
            <label className="mt-7 block border-b border-[#eaf8fd]/25 py-3">
              <span className="sr-only">How can we help?</span>
              <textarea value={message} onChange={(event) => { setMessage(event.target.value); setStatus('idle'); }} data-testid="input-contact-message" placeholder="How can we help?" rows={2} className="w-full resize-none bg-transparent text-[16px] text-[#eaf8fd] placeholder:text-[#eaf8fd]/40 outline-none" aria-invalid={status === 'error' && message.trim().length < 10} />
            </label>
            <div className="mt-7 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <button type="submit" data-testid="button-submit-contact" className="group flex items-center justify-center gap-3 rounded-full bg-[#a9ddf5] px-6 py-3.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#111] transition-transform duration-300 hover:-translate-y-1">Send inquiry <Send size={15} strokeWidth={1.5} className="transition-transform duration-300 group-hover:translate-x-1" /></button>
              <div aria-live="polite" data-testid="status-contact-form" className="text-[11px] leading-5">
                {status === 'success' && <span className="flex items-center gap-2 text-[#a9ddf5]"><Check size={14} /> Opening WhatsApp...</span>}
                {status === 'error' && <span className="text-[#f2b5a8]">Please add a valid email and a little more detail.</span>}
              </div>
            </div>
          </form>
          <div className="mt-16 flex items-center gap-5 border-t border-[#eaf8fd]/15 pt-5 text-[10px] uppercase tracking-[0.16em] text-[#eaf8fd]/50">
            <a href="mailto:hello@ayouboptic.com" data-testid="link-email-contact" className="transition-colors hover:text-[#a9ddf5]"><Mail size={14} className="mr-2 inline" /> Email</a>
            <a href="tel:+96171595276" data-testid="link-phone-contact" className="transition-colors hover:text-[#a9ddf5]"><Phone size={14} className="mr-2 inline" /> Call</a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-[#111] px-5 pb-7 text-[#eaf8fd] md:px-10">
      <div className="mx-auto max-w-[1440px] border-t border-[#eaf8fd]/15 pt-7">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <Logo dark />
            <p className="mt-5 max-w-[230px] text-[11px] leading-5 text-[#eaf8fd]/45">Independent eyewear for clear vision and considered living.</p>
          </div>
          <div className="flex items-center gap-5 text-[10px] uppercase tracking-[0.17em] text-[#eaf8fd]/50">
            <a href="https://www.instagram.com/ayouboptics" target="_blank" rel="noreferrer" data-testid="link-instagram" className="transition-colors hover:text-[#a9ddf5]"><Instagram size={15} className="mr-2 inline" /> Instagram</a>
            <button type="button" onClick={() => scrollToId('top')} data-testid="button-back-to-top" className="transition-colors hover:text-[#a9ddf5]">Back to top <ChevronUpIcon /></button>
          </div>
        </div>
        <div className="mt-12 flex flex-col justify-between gap-3 border-t border-[#eaf8fd]/10 pt-4 font-mono-ui text-[9px] uppercase tracking-[0.15em] text-[#eaf8fd]/35 sm:flex-row">
          <span>© 2024 Ayoub Optic</span><span>Made for seeing more</span>
        </div>
      </div>
    </footer>
  );
}

function ChevronUpIcon() {
  return <ArrowUpRight size={13} className="ml-1 inline rotate-[-45deg]" />;
}

function ProductModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const [color, setColor] = useState(product.colors[0]);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', handleKeyDown); document.body.style.overflow = ''; };
  }, [onClose]);

  return (
    <div className="motion-modal-backdrop fixed inset-0 z-50 overflow-y-auto bg-[#111]/60 px-4 py-5 backdrop-blur-sm md:px-8 md:py-12" role="dialog" aria-modal="true" aria-label={`${product.name} details`}>
      <button type="button" onClick={onClose} data-testid="button-close-product-modal-backdrop" className="absolute inset-0 h-full w-full cursor-default" aria-label="Close product details" />
      <div className="motion-modal relative mx-auto grid max-w-[980px] overflow-hidden rounded-[1.5rem] bg-[#eaf8fd] shadow-2xl md:grid-cols-[.95fr_1.05fr]">
        <div className="relative min-h-[390px] bg-[#d9f1f7] md:min-h-[650px]">
          <img src={product.image} alt={`${product.name} detailed view`} className="h-full w-full object-cover mix-blend-multiply opacity-90" />
          <span className="absolute left-5 top-5 rounded-full bg-[#111] px-3 py-1.5 font-mono-ui text-[9px] uppercase tracking-[0.16em] text-[#eaf8fd]">{product.category}</span>
        </div>
        <div className="relative p-7 md:p-12">
          <button type="button" onClick={onClose} data-testid="button-close-product-modal" className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-[#111]/15 hover:bg-[#111] hover:text-[#eaf8fd]" aria-label="Close product details"><X size={17} strokeWidth={1.4} /></button>
          <p className="font-mono-ui text-[10px] uppercase tracking-[0.2em] text-[#2b82a4]">AYOUB / {product.id}</p>
          <h2 className="mt-5 font-display text-[clamp(3rem,5vw,5rem)] leading-[.85] tracking-[-.06em]">{product.name}</h2>
          <p className="mt-4 font-mono-ui text-[14px]">{product.price}</p>
          <p className="mt-8 max-w-[380px] text-[14px] leading-6 text-[#111]/65">{product.description}</p>
          <div className="mt-9 border-t border-[#111]/15 pt-6">
            <div className="flex items-center justify-between"><span className="text-[10px] font-bold uppercase tracking-[0.16em]">Color / {color}</span><span className="font-mono-ui text-[10px] text-[#111]/50">{product.colors.length} options</span></div>
            <div className="mt-4 flex flex-wrap gap-2">
              {product.colors.map((item) => <button key={item} type="button" onClick={() => setColor(item)} data-testid={`button-color-${product.id}-${item.toLowerCase().replace(' ', '-')}`} aria-label={`Select ${item}`} className={`rounded-full border px-3 py-2 text-[10px] transition-colors ${color === item ? 'border-[#111] bg-[#111] text-[#eaf8fd]' : 'border-[#111]/20 hover:border-[#111]'}`}>{item}</button>)}
            </div>
          </div>
          <div className="mt-7 grid grid-cols-2 gap-x-5 gap-y-3 border-t border-[#111]/15 pt-6">
            {product.details.map((detail) => <div key={detail} className="font-mono-ui text-[10px] leading-5 text-[#111]/60">{detail}</div>)}
          </div>
          <div className="mt-9 flex gap-3">
            <div className="flex items-center rounded-full border border-[#111]/20">
              <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} data-testid="button-decrease-quantity" className="flex h-12 w-10 items-center justify-center" aria-label="Decrease quantity"><Minus size={14} /></button>
              <span className="w-5 text-center font-mono-ui text-[11px]" data-testid="text-product-quantity">{quantity}</span>
              <button type="button" onClick={() => setQuantity(quantity + 1)} data-testid="button-increase-quantity" className="flex h-12 w-10 items-center justify-center" aria-label="Increase quantity"><Plus size={14} /></button>
            </div>
            <button type="button" onClick={() => { onClose(); window.setTimeout(() => scrollToId('contact'), 100); }} data-testid="button-inquire-product" className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#111] px-5 text-[10px] font-bold uppercase tracking-[0.15em] text-[#eaf8fd] transition-transform hover:-translate-y-1">Inquire about {product.name} <ArrowUpRight size={15} strokeWidth={1.4} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CollectionPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const products = useProductCatalog();
  const queryClient = useQueryClient();
  useRevealObserver();

  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'The Collection — AYOUB Optic';
    return () => { document.title = previousTitle; };
  }, []);

  return (
    <main className="optic-shell optic-noise min-h-[100dvh]">
      <ScrollProgress />
      <Header onOpenMenu={() => setIsMenuOpen(true)} collectionPage />
      {isMenuOpen && <MobileMenu onClose={() => setIsMenuOpen(false)} collectionPage />}
      <section className="collection-page-hero px-5 pb-20 pt-36 md:px-10 md:pb-28 md:pt-44">
        <div className="mx-auto grid max-w-[1440px] items-center gap-14 md:grid-cols-[.9fr_1.1fr] md:gap-20">
          <div className="reveal">
            <p className="font-mono-ui text-[10px] uppercase tracking-[0.24em] text-[#2b82a4]">AYOUB / Full collection</p>
            <h1 className="mt-6 max-w-[700px] font-display text-[clamp(4rem,9vw,9rem)] leading-[.78] tracking-[-.08em]">Every frame<br /><em>has a point.</em></h1>
            <p className="mt-9 max-w-[430px] text-[14px] leading-6 text-[#111]/60">Explore the complete edit of optical, sun, and blue-light frames. Find the silhouette that feels like it was waiting for you.</p>
            <Link href="/" className="mt-8 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#111]/65 transition-colors hover:text-[#2b82a4]">
              <ArrowUpRight size={14} className="rotate-[-135deg]" /> Back to the studio
            </Link>
          </div>
          <div className="collection-page-art reveal reveal-delay-2 relative overflow-hidden rounded-[2rem] bg-[#a9ddf5]">
            <div className="eyewear-grid absolute inset-0 opacity-40" />
            <div className="collection-page-art__orb absolute -right-20 -top-24 h-80 w-80 rounded-full border border-[#111]/15" />
            <div className="collection-page-art__orb absolute -bottom-24 -left-20 h-64 w-64 rounded-full border border-[#111]/15" />
            <FrameArtwork className="relative z-10 w-full -rotate-3 scale-[1.08] drop-shadow-[0_32px_28px_rgba(17,17,17,0.13)]" />
            <span className="absolute bottom-6 left-6 z-10 font-mono-ui text-[9px] uppercase tracking-[0.18em] text-[#111]/55">Six silhouettes / one point of view</span>
          </div>
        </div>
      </section>
      <Collection onSelect={setSelectedProduct} products={products} />
      <AddProductForm onAdded={() => queryClient.invalidateQueries({ queryKey: ['products'] })} />
      <Footer />
      {selectedProduct && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
      <LimitedChatbot />
    </main>
  );
}

function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const products = useProductCatalog();
  useRevealObserver();

  return (
    <main className="optic-shell optic-noise min-h-[100dvh]">
      <ScrollProgress />
      <Header onOpenMenu={() => setIsMenuOpen(true)} />
      {isMenuOpen && <MobileMenu onClose={() => setIsMenuOpen(false)} />}
      <Hero />
      <IntroStrip />
      <Collection onSelect={setSelectedProduct} preview products={products} />
      <Approach />
      <StudioNote />
      <Contact />
      <Footer />
      {selectedProduct && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
      <LimitedChatbot />
    </main>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/collection" component={CollectionPage} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;