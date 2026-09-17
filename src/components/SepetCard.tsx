"use client";

type SepetCardProps = {
  className?: string;
  topLine?: string;
  bottomLine?: string;
  ctaLeft?: string;
  ctaRight?: string;
  iconOffsetX?: number;
  iconOffsetY?: number;
};

export default function SepetCard({
  className = "",
  topLine = "sosyal medya",
  bottomLine = "tasarımı",
  ctaLeft = "hemen sürükle",
  ctaRight = "3000.00 TL",
  iconOffsetX = -60,
  iconOffsetY = -10,
}: SepetCardProps) {
  const topFontSize = topLine.length > 12 ? 66 : 72;
  const topTracking = topLine.length > 12 ? -3.8 : -5;
  const bottomFontSize = bottomLine.length > 10 ? 98 : 110;
  const bottomTracking = bottomLine.length > 10 ? -3.8 : -5;

  return (
    <div className={`w-full ${className}`.trim()}>
      <svg
        viewBox="94 354 889 341"
        className="h-auto w-full"
        aria-label={`${topLine} ${bottomLine} kartı`}
      >
        <image href="/sepet/bg.png" x="0" y="0" width="1080" height="1080" />
        <image href="/sepet/yeni-buton.png" x={iconOffsetX} y={iconOffsetY} width="1080" height="1080" />

        <g>
          <text
            x="380"
            y="460"
            fill="#c797ac"
            fontFamily="var(--font-jost), sans-serif"
            fontWeight="300"
            fontSize={topFontSize}
            letterSpacing={topTracking}
          >
            {topLine}
          </text>
          <text
            x="380"
            y="540"
            fill="#c59aae"
            fontFamily="var(--font-jost), sans-serif"
            fontWeight="800"
            fontSize={bottomFontSize}
            letterSpacing={bottomTracking}
          >
            {bottomLine}
          </text>

          <image href="/sepet/btn-right.png" x="0" y="0" width="1080" height="1080" />
          <image href="/sepet/btn-left.png" x="0" y="0" width="1080" height="1080" />

          <text
            x="322"
            y="610"
            fill="#f8e9f0"
            fontFamily="var(--font-jost), sans-serif"
            fontWeight="450"
            fontSize="22"
            letterSpacing="0.2"
          >
            {ctaLeft}
          </text>
          <text
            x="768"
            y="610"
            textAnchor="end"
            fill="#fff7fb"
            fontFamily="var(--font-jost), sans-serif"
            fontWeight="500"
            fontSize="22"
            letterSpacing="0.2"
          >
            {ctaRight}
          </text>
        </g>
      </svg>
    </div>
  );
}
