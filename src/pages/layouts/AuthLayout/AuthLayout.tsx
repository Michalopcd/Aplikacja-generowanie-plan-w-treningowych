import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  hero: ReactNode;
  heroImage: string;
  heroPosition?: "left" | "right";
};

export function AuthLayout({
  children,
  hero,
  heroImage,
  heroPosition = "right",
}: Props) {
  const formDesktopOrder =
    heroPosition === "left" ? "md:order-2" : "md:order-1";

  const heroDesktopOrder =
    heroPosition === "left" ? "md:order-1" : "md:order-2";

  return (
    <main className="min-h-screen bg-card text-white md:h-screen">
      <div className="grid h-full grid-cols-1 md:grid-cols-2">
        <section
          className={`order-2 flex flex-col items-center justify-center bg-card px-6 py-16 md:px-20 md:py-0 ${formDesktopOrder}`}
        >
          <div className="w-full max-w-md">{children}</div>
        </section>

        <section
          style={{
            backgroundImage: `
              linear-gradient(
                rgba(0,0,0,0.65),
                rgba(0,0,0,0.85)
              ),
              url(${heroImage})
            `,
          }}
          className={`order-1 flex flex-col justify-center bg-cover bg-center px-6 py-10 md:h-full md:px-20 md:py-0 ${heroDesktopOrder}`}
        >
          <div className="max-w-lg">{hero}</div>
        </section>
      </div>
    </main>
  );
}