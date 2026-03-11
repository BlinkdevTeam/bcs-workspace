export default function SignInBtn({
  children,
  onClick,
  disabled,
  variant = "primary",
  type = "button",
}) {
  const base = "w-full py-3 rounded-lg text-sm font-medium transition-all";
  const hover = "hover:opacity-80";

  let variantClasses = "";
  if (variant === "primary") {
    variantClasses = disabled
      ? "bg-gray-800 text-gray-500 cursor-not-allowed"
      : "bg-white text-black";
  } else if (variant === "secondary") {
    variantClasses = "bg-gray-900 text-gray-400 border border-gray-800";
  } else if (variant === "danger") {
    variantClasses = "bg-red-900 text-red-500 border border-red-800";
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${hover} ${variantClasses}`}
    >
      {children}
    </button>
  );
}
