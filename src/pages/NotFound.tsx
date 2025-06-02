
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center app-bg">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 app-text-primary">404</h1>
        <p className="text-xl app-text-secondary mb-4">Oops! Page not found</p>
        <a href="/" className="app-accent hover:app-accent-hover underline">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
