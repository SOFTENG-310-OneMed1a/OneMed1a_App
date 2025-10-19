import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white">
      <LoadingSpinner />
      <p className="mt-4 text-lg font-medium">Fetching recommendations...</p>
    </div>
  );
}