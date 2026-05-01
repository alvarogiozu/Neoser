"use client";

type GoogleMapEmbedProps = {
  className?: string;
  query: string;
};

export function GoogleMapEmbed({ className, query }: GoogleMapEmbedProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className={`map-fallback ${className ?? ""}`}>
        <p className="px-6 text-center text-sm">
          Mapa no configurado. Agrega NEXT_PUBLIC_GOOGLE_MAPS_API_KEY para activar Google Maps.
        </p>
      </div>
    );
  }

  const src = `https://www.google.com/maps/embed/v1/place?key=${encodeURIComponent(apiKey)}&q=${encodeURIComponent(query)}`;

  return (
    <iframe
      title="Mapa NeoSer"
      src={src}
      className={className}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      allowFullScreen
      style={{ border: 0, borderRadius: "1rem", width: "100%", minHeight: "18rem" }}
    />
  );
}
