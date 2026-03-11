export default function Btn({
  children,
  onClick,
  disabled,
  variant = "primary",
  type = "button",
}) {
  const styles = {
    primary: {
      bg: disabled ? "#1a1a1a" : "#fff",
      color: disabled ? "#444" : "#000",
    },
    secondary: { bg: "#111", color: "#aaa", border: "1px solid #2a2a2a" },
    danger: { bg: "#1f0f0f", color: "#f05a5a", border: "1px solid #3a1515" },
  }[variant];
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="w-full py-3 rounded-lg text-sm font-medium transition-all hover:opacity-80"
      style={{
        fontFamily: "system-ui,sans-serif",
        cursor: disabled ? "not-allowed" : "pointer",
        ...styles,
      }}
    >
      {children}
    </button>
  );
}
