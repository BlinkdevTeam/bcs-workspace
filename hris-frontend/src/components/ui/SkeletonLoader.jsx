export default function SkeletonLoader({
  count = 1,
  variant = "block",
  width = "w-full",
  height = "h-4",
  className = "",
}) {
  const getClasses = () => {
    switch (variant) {
      case "text":
        return `${width} ${height} rounded-sm`;
      case "avatar":
        return "w-10 h-10 rounded-full";
      case "table":
        return `${width} ${height} mb-2 rounded`;
      default:
        return `${width} ${height} rounded-lg`;
    }
  };

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`animate-pulse bg-gray-800 ${getClasses()} ${className}`} />
      ))}
    </>
  );
}