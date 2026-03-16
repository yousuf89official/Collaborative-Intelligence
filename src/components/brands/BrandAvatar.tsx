
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export const BrandAvatar = ({ logo_url, name, brand_color, size = 'md', containerClassName, imageClassName }: {
    logo_url?: string | null,
    name: string,
    brand_color?: string,
    size?: 'sm' | 'md' | 'lg' | 'custom',
    containerClassName?: string,
    imageClassName?: string
}) => {
    const [error, setError] = useState(false);

    // Reset error state if logo_url changes
    useEffect(() => {
        setError(false);
    }, [logo_url]);

    const containerClasses = cn(
        "rounded-xl flex items-center justify-center text-white font-black shadow-sm shrink-0",
        size === 'sm' ? "h-10 w-10 text-lg" : size === 'md' ? "h-14 w-14 text-2xl" : size === 'lg' ? "h-20 w-20 text-4xl" : "",
        containerClassName
    );

    if (logo_url && !error) {
        return (
            <div className={containerClasses} style={{ backgroundColor: brand_color || '#4F46E5' }}>
                <img
                    src={logo_url}
                    alt={name}
                    className={cn(
                        "object-contain filter drop-shadow-sm",
                        size === 'sm' ? "h-6 w-6" : size === 'md' ? "h-10 w-10" : size === 'lg' ? "h-14 w-14" : "",
                        imageClassName
                    )}
                    onError={() => setError(true)}
                />
            </div>
        );
    }

    return (
        <div className={containerClasses} style={{ backgroundColor: brand_color || '#4F46E5' }}>
            <div className="h-full w-full rounded-full bg-white/10 backdrop-blur flex items-center justify-center border border-white/20">
                <span>{name[0]}</span>
            </div>
        </div>
    );
};
