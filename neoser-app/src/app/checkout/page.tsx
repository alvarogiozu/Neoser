"use client";

import { useEffect, useMemo, useState } from "react";

type Course = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  currency: string;
  mode: string;
};

function formatMoney(amount: number, currency: string) {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: currency || "PEN",
  }).format(amount);
}

export default function CheckoutPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseId, setCourseId] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const response = await fetch("/api/courses");
        if (!response.ok) throw new Error();
        const data = await response.json();
        setCourses(data.items ?? []);
      } catch {
        setError("No se pudieron cargar los cursos.");
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, []);

  const selectedCourse = useMemo(
    () => courses.find((course) => course.id === courseId) ?? null,
    [courses, courseId],
  );

  async function startPayment() {
    if (!courseId) {
      setError("Selecciona un curso para continuar.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const response = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });
      const data = await response.json();
      if (!response.ok) {
        if (response.status === 401) {
          window.location.href = "/login?message=Inicia+sesion+para+pagar";
          return;
        }
        throw new Error(data.error || "No se pudo iniciar el pago.");
      }
      if (!data.checkoutUrl) {
        throw new Error("No se recibio URL de checkout.");
      }
      window.location.href = data.checkoutUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al iniciar pago.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-8 text-center">
        <p className="section-tag">Pago Seguro</p>
        <h1 className="section-title">Checkout de Cursos</h1>
        <p className="mt-3 text-sm text-gray-500">
          Selecciona tu curso y completa el pago con Mercado Pago.
        </p>
      </header>

      <section className="surface-card p-6 md:p-8">
        {loading ? (
          <p className="text-sm text-gray-500">Cargando cursos...</p>
        ) : courses.length === 0 ? (
          <p className="text-sm text-gray-500">No hay cursos publicados por ahora.</p>
        ) : (
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-[var(--navy)]">
              Curso
              <select
                value={courseId}
                onChange={(event) => setCourseId(event.target.value)}
                className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="">Selecciona un curso</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title} - {formatMoney(Number(course.price), course.currency)}
                  </option>
                ))}
              </select>
            </label>

            {selectedCourse && (
              <div className="rounded-lg bg-[var(--cream)] p-4 text-sm text-gray-700">
                <p className="font-semibold text-[var(--navy)]">{selectedCourse.title}</p>
                <p className="mt-1">{selectedCourse.description || "Curso NeoSer"}</p>
                <p className="mt-2">
                  Modalidad: <strong>{selectedCourse.mode}</strong>
                </p>
                <p>
                  Monto:{" "}
                  <strong>
                    {formatMoney(Number(selectedCourse.price), selectedCourse.currency)}
                  </strong>
                </p>
              </div>
            )}

            {error && (
              <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            )}

            <button
              onClick={startPayment}
              disabled={submitting || !courseId}
              className="btn-primary w-full disabled:opacity-50"
            >
              {submitting ? "Redirigiendo a pago..." : "Pagar ahora"}
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
