export default function EmptyState({
  title,
  description,
  icon,
  action,
  variant = "no-data",
  className = "",
}) {
  const defaults = {
    "no-data": { title: "No Data", description: "Nothing to show here." },
    "no-results": { title: "No Results", description: "No results found." },
    "no-notifications": { title: "No Notifications", description: "You're all caught up!" },
    "no-tasks": { title: "No Tasks", description: "No tasks assigned." },
  };

  const content = {
    title: title || defaults[variant].title,
    description: description || defaults[variant].description,
  };

  return (
    <div className={`flex flex-col items-center justify-center py-10 ${className}`}>
      {icon && <div className="mb-4 text-gray-400 text-4xl">{icon}</div>}
      <h3 className="text-lg font-semibold text-gray-300 mb-2">{content.title}</h3>
      <p className="text-sm text-gray-500 text-center">{content.description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}