import Image from "next/image";

export default function PosterImage({ src, alt = "Poster", width = 220, height = 320 }) {
    return (
        <div
            className="relative mx-auto overflow-hidden rounded-2xl shadow-2xl shadow-black/50 ring-1 ring-black/30 md:mx-0"
            style={{ width, height }}
        >
            {src ? (
                <Image
                    src={src}
                    alt={alt}
                    fill
                    className="object-cover"
                    sizes={`${width}px`}
                />
            ) : (
                <div className="flex h-full w-full items-center justify-center bg-neutral-800 text-neutral-400">
                    No Poster
                </div>
            )}
        </div>
    );
}
