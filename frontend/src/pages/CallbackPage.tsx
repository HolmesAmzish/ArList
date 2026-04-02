import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';

export const CallbackPage = () => {
    const auth = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        console.log('CallbackPage - auth state:', {
            isLoading: auth.isLoading,
            isAuthenticated: auth.isAuthenticated,
            error: auth.error,
            user: auth.user,
            activeNavigator: auth.activeNavigator
        });

        // Redirect to home when authentication is complete and not loading
        if (!auth.isLoading && auth.isAuthenticated) {
            console.log('CallbackPage - Authentication successful, redirecting to home');
            navigate('/');
        }
    }, [auth.isLoading, auth.isAuthenticated, auth.error, auth.user, auth.activeNavigator, navigate]);

    // Display error message
    if (auth.error) {
        console.error('CallbackPage - Authentication error:', auth.error);
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md max-w-md w-full">
                    <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Login Failed</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                        {auth.error.message}
                    </p>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-4 p-2 bg-gray-100 dark:bg-gray-700 rounded">
                        <p>Error Type: {auth.error.name}</p>
                        {auth.error.stack && (
                            <pre className="mt-2 text-xs overflow-auto max-h-32">{auth.error.stack}</pre>
                        )}
                    </div>
                    <button
                        onClick={() => navigate('/login')}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors"
                    >
                        Return to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-300 text-lg">Logging in, please wait...</p>
                {auth.isLoading && (
                    <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Processing authentication...</p>
                )}
            </div>
        </div>
    );
};
