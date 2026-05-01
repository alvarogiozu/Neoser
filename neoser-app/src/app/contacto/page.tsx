import { GoogleMapEmbed } from "@/components/google-map-embed";

export default function ContactPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-4xl font-bold text-[var(--navy)]">Ubicacion NeoSer</h1>
      <p className="mb-8 text-gray-500">Integracion Google Maps con fallback seguro.</p>
      <GoogleMapEmbed query="Calle Los Sauces 542, Urbanizacion Santa Victoria, Chiclayo, Lambayeque, Peru" />
    </main>
  );
}
