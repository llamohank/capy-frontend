export default function filesizeTransform(size) {
  const MB = (size / 1024 / 1024).toFixed(2);
  const KB = (size / 1024).toFixed(2);
  if (MB > 1) {
    return `${MB} MB`;
  } else {
    return `${KB} KB`;
  }
}
