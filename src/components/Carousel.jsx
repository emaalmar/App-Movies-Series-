// Carousale.jsx
import React, { useRef } from 'react';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
export const Carousel = ({ name, images }) => {
    const scrollRef = useRef(null);

    const scrollLeft = () => {
        scrollRef.current.scrollBy({ left: -500, behavior: 'smooth' });
    };

    const scrollRight = () => {
        scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    };

    return (
        <div>
            <h2 className="text-lg font-bold pl-6 pt-6">
                    {name}
            </h2>
            <div className="relative">
                <button
                    onClick={scrollLeft}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gray-700 bg-opacity-10 text-white rounded-full p-2"
                >
                    <ArrowLeftIcon className="h-fit w-5 hover:text-red-200" />
                </button>
                <div
                    ref={scrollRef}
                    className="flex overflow-x-auto snap-x snap-mandatory gap-2 p-4 scroll-pl-4 scroll-smooth scrollbar-hide"
                >
                    {images.map((src, idx) => (
                        <div key={idx} className="snap-start shrink-0 w-70 h-80">
                            <img src={src} className="w-full h-full object-fill rounded-2xl" alt={`Movie ${idx + 1}`} />
                        </div>
                    ))}
                </div>
                <button
                    onClick={scrollRight}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gray-700 bg-opacity-80 text-white rounded-full p-2"
                >
                    <ArrowRightIcon className="h-fit w-5 hover:text-red-200 " />
                </button>
            </div>
        </div>
    );
};