/** Sabit senaryolu arayüz canlandırmalarını gerçek bir müşteri demosundan ayırır. */
export function DemoFigure({ children }: { children: React.ReactNode }) {
  return (
    <figure className="w-full">
      {children}
      <figcaption className="mt-3 text-center text-[13px] opacity-75">
        Örnek akış — temsili senaryo, gerçek müşteri verisi değildir.
      </figcaption>
    </figure>
  );
}
