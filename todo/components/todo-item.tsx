import React, { useState } from 'react';
import { Todo } from '@/types/todo';
import useTodoStore from '@/store/to-do-store';
import TodoForm from './todo-form';


interface TodoItemProps {
  todo: Todo;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const { updateTodo, deleteTodo } = useTodoStore();
  const [isEditing, setIsEditing] = useState(false);

  const handleStatusChange = (newStatus: Todo['status']) => {
    updateTodo(todo.id, { status: newStatus });
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      deleteTodo(todo.id);
    }
  };

  const getPriorityColor = () => {
    switch (todo.priority) {
      case 'high': return 'bg-red-100 border-red-500';
      case 'medium': return 'bg-yellow-100 border-yellow-500';
      case 'low': return 'bg-green-100 border-green-500';
      default: return 'bg-gray-100 border-gray-500';
    }
  };

  const getStatusColor = () => {
    switch (todo.status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      {isEditing ? (
        <TodoForm 
          initialData={todo} 
          onClose={() => setIsEditing(false)} 
          userId={todo.userId}
        />
      ) : (
        <div className={`border rounded-lg p-4 ${getPriorityColor()}`}>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">{todo.title}</h3>
            <span 
              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}
            >
              {todo.status.replace('-', ' ')}
            </span>
          </div>

          {todo.description && (
            <p className="text-gray-600 mb-2">{todo.description}</p>
          )}

          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Created: {new Date(todo.createdAt).toLocaleDateString()}
            </div>
            <div className="flex space-x-2">
              <select
                value={todo.status}
                onChange={(e) => handleStatusChange(e.target.value as Todo['status'])}
                className="px-2 py-1 border rounded text-sm"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TodoItem;