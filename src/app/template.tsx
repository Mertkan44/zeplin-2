/* Rota değişimi — her sayfa aynı jestle geliyor. Ana sayfada özenli bir giriş
   koreografisi varken linke tıklamanın sert kesme olması ahengi bozuyordu.
   Bilinçli olarak yalnızca opaklık: transform/filter bir containing block
   yaratır ve hero'nun sticky kurgusuyla fixed navbar'ı bozar. */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="route-enter">{children}</div>;
}
