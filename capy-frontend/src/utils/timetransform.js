export default function timetransform(seconds, text = false) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  const pad = (n) => String(n).padStart(2, "0");

  if (h > 0) {
    return text ? `${pad(h)}小時${pad(m)}分鐘` : `${pad(h)}:${pad(m)}:${pad(s)}`;
  } else {
    return text ? `${pad(m)}分鐘` : `${pad(m)}:${pad(s)}`;
  }
}
