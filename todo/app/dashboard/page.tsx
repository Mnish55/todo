'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/provider/auth-context'; 
import { useRouter } from 'next/navigation';
import useTodoStore from '@/store/to-do-store';
import TodoList from '@/components/todo-list';
import TodoForm from '@/components/todo-form';

export default function DashboardPage() {
  const { currentUser, logout } = useAuth();
  const router = useRouter();
  const { todos, fetchTodos, loading, error } = useTodoStore();
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      router.push('/auth/login');
      return;
    }

    // Fetch todos for the current user
    if (currentUser) {
      fetchTodos(currentUser.uid);
    }
  }, [currentUser, fetchTodos, router]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/auth/login');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome, {currentUser.displayName || currentUser.email}
          </h1>
          <div className="flex space-x-4">
            <button
              onClick={() => setIsFormOpen(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
            >
              Add New Todo
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Todo Form Modal */}
        {isFormOpen && (
          <TodoForm 
            onClose={() => setIsFormOpen(false)}
            userId={currentUser.uid}
          />
        )}

        {/* Error Handling */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-500"></div>
          </div>
        ) : (
          <TodoList todos={todos} />
        )}
      </div>
    </div>
  );
}


