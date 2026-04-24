import { signIn, auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Masuk" };

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect("/");

  const hasGoogle =
    !!process.env.GOOGLE_CLIENT_ID && !!process.env.GOOGLE_CLIENT_SECRET;

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4 py-10 text-center">
      <div className="w-full space-y-5 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8">
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold tracking-tight">
            Selamat datang di OtakuHub
          </h1>
          <p className="text-sm text-[var(--muted-foreground)]">
            Masuk untuk menyimpan watchlist dan riwayat menonton di semua
            perangkat.
          </p>
        </div>

        {hasGoogle ? (
          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/" });
            }}
          >
            <Button type="submit" size="lg" className="w-full">
              Masuk dengan Google
            </Button>
          </form>
        ) : (
          <div className="rounded-lg border border-dashed border-[var(--border)] p-4 text-sm text-[var(--muted-foreground)]">
            Login belum dikonfigurasi. Tambahkan <code>GOOGLE_CLIENT_ID</code>{" "}
            dan <code>GOOGLE_CLIENT_SECRET</code> di environment variables untuk
            mengaktifkan login, dan <code>DATABASE_URL</code> untuk menyimpan
            data.
          </div>
        )}

        <p className="text-xs text-[var(--muted-foreground)]">
          Dengan masuk kamu menyetujui layanan diberikan apa adanya. Data
          streaming disediakan pihak ketiga.
        </p>
      </div>
    </div>
  );
}
