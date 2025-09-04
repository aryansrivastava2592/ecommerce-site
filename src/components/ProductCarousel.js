"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react"; // Import new hooks

export default function ProductCarousel({ products }) {
  // Get the API object from the hook to control the carousel
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay()]);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  // Handlers to scroll left and right
  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi]
  );
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi]
  );

  // Effect to update the button disabled states
  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi]);

  const featuredProducts = products.slice(0, 5);

  return (
    <div className="embla mb-8" ref={emblaRef}>
      <div className="embla__container">
        {featuredProducts.map((product) => (
          <div className="embla__slide relative" key={product.slug}>
            <Link href={`/product/${product.slug}`}>
              <div className="flex items-center justify-center w-full h-96 bg-gray-900">
                <img
                  src={product.image}
                  className="max-h-full max-w-full object-contain"
                  alt={product.name}
                />
              </div>
              <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white p-4 w-full">
                <h3 className="text-xl font-bold">{product.name}</h3>
                <p>Shop Now</p>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* --- NEW ARROW BUTTONS --- */}
      <button
        className="embla__button embla__button--prev"
        onClick={scrollPrev}
        disabled={!canScrollPrev}
      >
        <svg className="embla__button__svg" viewBox="0 0 24 24">
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
        </svg>
      </button>
      <button
        className="embla__button embla__button--next"
        onClick={scrollNext}
        disabled={!canScrollNext}
      >
        <svg className="embla__button__svg" viewBox="0 0 24 24">
          <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
        </svg>
      </button>
      {/* --- END OF NEW BUTTONS --- */}
    </div>
  );
}
