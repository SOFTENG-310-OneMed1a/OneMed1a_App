import Image from "next/image";

export default function BackgroundImage({ src, alt = "" }) {
    return (
        <div className="relative h-64 w-full overflow-hidden md:h-80">
            {src ? (
                <Image
                    src={src}
                    alt={alt}
                    fill
                    priority
                    className="object-cover opacity-70"
                    sizes="100vw"
                />
            ) : (
                <div className="h-full w-full bg-neutral-800" />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/10 to-neutral-950" />
        </div>
    );
}
