import React from 'react';
import { Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const RegisterPage: React.FC = () => {
  const { login } = useAuth();

  const handleRegister = () => {
    // Redirect to OAuth server for registration
    login();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl dark:shadow-slate-900/50 p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-full mb-4">
              <UserPlus className="text-indigo-600 dark:text-indigo-400" size={32} />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Create Account</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Join us and start organizing your tasks</p>
          </div>

          <div className="space-y-6">
            <button
              onClick={handleRegister}
              className="w-full bg-indigo-600 dark:bg-indigo-500 text-white py-3 px-4 rounded-xl font-medium hover:bg-indigo-700 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30"
            >
              Sign Up with SSO
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
            <p className="text-center text-slate-500 dark:text-slate-400">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
