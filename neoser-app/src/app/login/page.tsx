import { login, signup } from "./actions";

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 py-16">
      <h1 className="mb-6 text-2xl font-bold text-[var(--navy)]">
        Iniciar sesion
      </h1>

      <form className="flex w-full flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm font-medium">
          Email
          <input
            name="email"
            type="email"
            required
            className="rounded-md border px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium">
          Contrasena
          <input
            name="password"
            type="password"
            required
            minLength={6}
            className="rounded-md border px-3 py-2"
          />
        </label>

        <div className="flex gap-3">
          <button
            formAction={login}
            className="flex-1 rounded-md bg-[var(--navy)] px-4 py-2 text-white hover:opacity-90"
          >
            Entrar
          </button>
          <button
            formAction={signup}
            className="flex-1 rounded-md border border-[var(--navy)] px-4 py-2 text-[var(--navy)] hover:bg-gray-50"
          >
            Registrarse
          </button>
        </div>
      </form>
    </main>
  );
}
