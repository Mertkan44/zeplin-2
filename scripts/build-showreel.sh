#!/usr/bin/env bash
# Hakkımızda showreel'i (sessiz) mevcut web videolarından yeniden üretir.
#   Dikey: 720x1280, 12 kesit × 2.2 sn  → public/videos/showreel-tall-web.mp4
#   Yatay: 1920x1080, dikey kurgunun 8.8 sn aralıklı üç kopyası yan yana → showreel-wide-web.mp4
# Kesit listesini değiştirmek için aşağıdaki CUTS bloğunu düzenleyin (video adı + başlangıç saniyesi).
# Müzik eklenecekse: son adımdaki `-an` yerine ses girdisi eklenir; sayfada `muted` kalır, ayrı ses düğmesi gerekir.
set -euo pipefail
cd "$(dirname "$0")/../public/videos"

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
CLIP=2.2

CUTS="milo-smash 4
milo-smash 10
milo-smash 14
milo-kokteyl 4
ritim-bitti 3
ritim-bitti 8
ritim-anneler-gunu 8
ritim-bitti 20
ritim-kisa1 8
milo-kokteyl 16
milo-smash 22
ritim-bitti 26"

i=0
while read -r name start; do
  i=$((i + 1))
  out="$TMP/c$(printf %02d $i).mp4"
  ffmpeg -y -loglevel error -ss "$start" -i "$name-web.mp4" -t "$CLIP" -an \
    -vf "scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280,setsar=1,fps=30" \
    -c:v libx264 -preset veryfast -crf 18 "$out"
  echo "file '$out'" >> "$TMP/list.txt"
done <<< "$CUTS"

ffmpeg -y -loglevel error -f concat -safe 0 -i "$TMP/list.txt" \
  -c:v libx264 -preset slow -crf 26 -pix_fmt yuv420p -movflags +faststart -an showreel-tall-web.mp4

LEN=$(ffprobe -v error -show_entries format=duration -of csv=p=0 showreel-tall-web.mp4)
THIRD=$(python3 -c "print(round($LEN / 3, 2))")
ffmpeg -y -loglevel error -stream_loop 1 -i showreel-tall-web.mp4 -filter_complex \
  "[0:v]scale=608:1080,split=3[a][b][c];\
[a]trim=0:$LEN,setpts=PTS-STARTPTS[a1];\
[b]trim=$THIRD:$(python3 -c "print($THIRD + $LEN)"),setpts=PTS-STARTPTS[b1];\
[c]trim=$(python3 -c "print(2 * $THIRD)"):$(python3 -c "print(2 * $THIRD + $LEN)"),setpts=PTS-STARTPTS[c1];\
[a1][b1][c1]hstack=3[h];[h]pad=1920:1080:(ow-iw)/2:0:color=0x111111,setsar=1[v]" \
  -map "[v]" -an -c:v libx264 -preset slow -crf 27 -pix_fmt yuv420p -movflags +faststart showreel-wide-web.mp4

# Açılış başlığındaki hap biçimli döngü: 9:16 kareden yatay şerit (video, saniye, şeridin dikey merkezi).
HERO_CUTS="milo-kokteyl 4 0.45
ritim-bitti 23 0.45
milo-smash 16 0.5
ritim-anneler-gunu 3 0.4
milo-smash 22 0.55
ritim-bitti 8 0.5"
: > "$TMP/hero.txt"
i=0
while read -r name start center; do
  i=$((i + 1))
  out="$TMP/h$(printf %02d $i).mp4"
  ffmpeg -y -loglevel error -ss "$start" -i "$name-web.mp4" -t 1.6 -an \
    -vf "crop=1080:480:0:ih*$center-240,scale=720:320,setsar=1,fps=30" \
    -c:v libx264 -preset veryfast -crf 18 "$out"
  echo "file '$out'" >> "$TMP/hero.txt"
done <<< "$HERO_CUTS"
ffmpeg -y -loglevel error -f concat -safe 0 -i "$TMP/hero.txt" \
  -c:v libx264 -preset slow -crf 27 -pix_fmt yuv420p -movflags +faststart -an hero-loop-web.mp4
ffmpeg -y -loglevel error -ss 0.5 -i hero-loop-web.mp4 -frames:v 1 -q:v 4 posters/hero-loop-poster.jpg

ffmpeg -y -loglevel error -ss 3 -i showreel-wide-web.mp4 -frames:v 1 -q:v 4 posters/showreel-wide-poster.jpg
ffmpeg -y -loglevel error -ss 7.5 -i showreel-tall-web.mp4 -frames:v 1 -q:v 4 posters/showreel-tall-poster.jpg
echo "Showreel hazır: $(du -h showreel-tall-web.mp4 showreel-wide-web.mp4 | tr '\n' ' ')"
