import Link from "next/link";

export default function CheckoutFailurePage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16 text-center">
      <p className="section-tag">Pago no completado</p>
      <h1 className="section-title">No se pudo procesar el pago</h1>
      <p className="mt-4 text-gray-600">
        Revisa tus datos o intenta con otro método. Si el problema continúa, escríbenos por
        WhatsApp.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link href="/checkout" className="btn-primary">
          Reintentar pago
        </Link>
        <a
          href="https://wa.me/51932713071?text=Hola%2C%20necesito%20ayuda%20con%20mi%20pago%20en%20NeoSer"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-[var(--navy)] px-6 py-3 text-[var(--navy)]"
        >
          Soporte por WhatsApp
        </a>
      </div>
    </main>
  );
}
