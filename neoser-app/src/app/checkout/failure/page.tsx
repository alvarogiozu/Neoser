import Link from "next/link";

export default function CheckoutFailurePage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16 text-center">
      <p className="section-tag">Pago no completado</p>
      <h1 className="section-title">No se pudo procesar el pago</h1>
      <p className="mt-4 text-gray-600">
        Revisa tus datos o intenta con otro metodo. Si el problema continua, escribenos por el
        formulario de contacto.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link href="/checkout" className="btn-primary">
          Reintentar pago
        </Link>
        <Link href="/#contacto" className="rounded-full border border-[var(--navy)] px-6 py-3 text-[var(--navy)]">
          Ir a contacto
        </Link>
      </div>
    </main>
  );
}
