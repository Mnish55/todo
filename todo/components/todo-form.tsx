// src/components/TodoForm.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Todo, TodoFormData } from '@/types/todo';
import useTodoStore from '@/store/to-do-store';


const todoSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    status: z.enum(['pending', 'in-progress', 'completed']).optional().default('pending'),
    priority: z.enum(['low', 'medium', 'high']).optional().default('medium')
  });
  
type TodoFormDataa = z.infer<typeof todoSchema>;
  

// Validation schema
// const todoSchema = z.object({
//   title: z.string().min(1, 'Title is required'),
//   description: z.string().optional(),
//   status: z.enum(['pending', 'in-progress', 'completed']).optional().default('pending'),
//   priority: z.enum(['low', 'medium', 'high']).optional().default('medium')
// });

interface TodoFormProps {
  initialData?: Todo;
  onClose: () => void;
  userId: string;
}

const TodoForm: React.FC<TodoFormProps> = ({ 
  initialData, 
  onClose, 
  userId 
}) => {
  const { addTodo, updateTodo } = useTodoStore();
  const isEditing = !!initialData;

  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<TodoFormDataa>({
    resolver: zodResolver(todoSchema),
    defaultValues: initialData ? {
      title: initialData.title,
      description: initialData.description,
      status: initialData.status,
      priority: initialData.priority
    } : undefined
  });

  const onSubmit = async (data: TodoFormData) => {
    try {
      if (isEditing && initialData) {
        await updateTodo(initialData.id, data);
      } else {
        await addTodo(data, userId);
      }
      onClose();
    } catch (error) {
      console.error('Error saving todo:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">
          {isEditing ? 'Edit Todo' : 'Add New Todo'}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              {...register('title')}
              id="title"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description (Optional)
            </label>
            <textarea
              {...register('description')}
              id="description"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                {...register('status')}
                id="status"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                Priority
              </label>
              <select
                {...register('priority')}
                id="priority"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
            >
              {isEditing ? 'Update Todo' : 'Add Todo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TodoForm;