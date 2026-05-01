import Link from "next/link";

export default function CheckoutPendingPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16 text-center">
      <p className="section-tag">Pago en revisión</p>
      <h1 className="section-title">Tu pago está pendiente</h1>
      <p className="mt-4 text-gray-600">
        Mercado Pago está validando la operación. Te confirmaremos cuando se apruebe.
      </p>
      <div className="mt-8">
        <Link href="/checkout" className="btn-primary">
          Intentar otro pago
        </Link>
      </div>
    </main>
  );
}
