import Link from "next/link";

export default function CheckoutSuccessPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16 text-center">
      <p className="section-tag">Pago confirmado</p>
      <h1 className="section-title">Tu pago fue aprobado</h1>
      <p className="mt-4 text-gray-600">
        Gracias por confiar en NeoSer. En breve te contactaremos con los siguientes pasos de tu
        curso.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link href="/" className="btn-primary">
          Volver al inicio
        </Link>
        <Link
          href="/admin"
          className="rounded-full border border-[var(--navy)] px-6 py-3 text-[var(--navy)]"
        >
          Ver CRM
        </Link>
      </div>
    </main>
  );
}
