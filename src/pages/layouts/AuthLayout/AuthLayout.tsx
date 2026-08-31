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
    heroPosition === "left"
      ? "lg:order-2"
      : "lg:order-1";

  const heroDesktopOrder =
    heroPosition === "left"
      ? "lg:order-1"
      : "lg:order-2";

  const desktopColumns =
    heroPosition === "left"
      ? "lg:grid-cols-[58%_42%]"
      : "lg:grid-cols-[42%_58%]";

  return (
    <main className="min-h-screen bg-card text-white">
      <div
        className={`grid min-h-screen grid-cols-1 ${desktopColumns}`}
      >
        <section
          className={`order-2 flex items-center justify-center bg-card px-6 py-16 sm:px-10 lg:min-h-screen lg:px-12 lg:py-8 xl:px-16 ${formDesktopOrder}`}
        >
          <div className="w-full max-w-lg">
            {children}
          </div>
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
          className={`order-1 flex items-center justify-center bg-cover bg-center px-6 py-10 sm:px-10 sm:py-14 lg:min-h-screen lg:px-12 lg:py-8 xl:px-16 ${heroDesktopOrder}`}
        >
          <div className="w-full max-w-xl">
            {hero}
          </div>
        </section>
      </div>
    </main>
  );
}