// src/components/TodoList.tsx
import React, { useState } from 'react';
import { Todo } from '@/types/todo';
import TodoItem from './todo-item';

interface TodoListProps {
  todos: Todo[];
}

const TodoList: React.FC<TodoListProps> = ({ todos }) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'in-progress' | 'completed'>('all');

  const filteredTodos = todos.filter(todo => {
    if (filter === 'all') return true;
    return todo.status === filter;
  });

  return (
    <div>
      <div className="mb-4 flex space-x-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-md ${
            filter === 'all' 
              ? 'bg-indigo-600 text-white' 
              : 'bg-gray-200 text-gray-800'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 rounded-md ${
            filter === 'pending' 
              ? 'bg-indigo-600 text-white' 
              : 'bg-gray-200 text-gray-800'
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => setFilter('in-progress')}
          className={`px-4 py-2 rounded-md ${
            filter === 'in-progress' 
              ? 'bg-indigo-600 text-white' 
              : 'bg-gray-200 text-gray-800'
          }`}
        >
          In Progress
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 rounded-md ${
            filter === 'completed' 
              ? 'bg-indigo-600 text-white' 
              : 'bg-gray-200 text-gray-800'
          }`}
        >
          Completed
        </button>
      </div>

      {filteredTodos.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No todos found. Start by adding a new todo!
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTodos.map(todo => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TodoList;
