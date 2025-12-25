export default function Unauthorized() {
  return (
    <div className="text-center mt-20 p-4 transition-colors duration-300">
      <h1 className="text-2xl font-bold text-red-600 dark:text-red-500">Access Denied</h1>
      <p className="text-gray-700 dark:text-gray-300 mt-2">You do not have permission to view this page.</p>
    </div>
  );
}
