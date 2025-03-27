// src/store/todoStore.ts
import { create } from 'zustand';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  getDocs, 
  orderBy 
} from 'firebase/firestore';
import { Todo, TodoFormData } from '@/types/todo';
import { firestore } from '@/firebase/config';

interface TodoStore {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  fetchTodos: (userId: string) => Promise<void>;
  addTodo: (todo: TodoFormData, userId: string) => Promise<void>;
  updateTodo: (id: string, updates: Partial<Todo>) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
}

const useTodoStore = create<TodoStore>((set, get) => ({
  todos: [],
  loading: false,
  error: null,

  fetchTodos: async (userId) => {
    set({ loading: true, error: null });
    try {
      const todosRef = collection(firestore, 'todos');
      const q = query(
        todosRef, 
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const fetchedTodos = querySnapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      } as Todo));

      set({ todos: fetchedTodos, loading: false });
    } catch (error) {
      console.error('Error fetching todos:', error);
      set({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred', 
        loading: false 
      });
    }
  },

  addTodo: async (todoData, userId) => {
    set({ loading: true, error: null });
    try {
      const newTodo = {
        ...todoData,
        userId,
        status: todoData.status || 'pending',
        priority: todoData.priority || 'medium',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const docRef = await addDoc(collection(firestore, 'todos'), newTodo);
      
      const todoWithId = { ...newTodo, id: docRef.id };
      set(state => ({ 
        todos: [todoWithId, ...state.todos], 
        loading: false 
      }));
    } catch (error) {
      console.error('Error adding todo:', error);
      set({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred', 
        loading: false 
      });
    }
  },

  updateTodo: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      const todoRef = doc(firestore, 'todos', id);
      await updateDoc(todoRef, {
        ...updates,
        updatedAt: new Date()
      });

      set(state => ({
        todos: state.todos.map(todo => 
          todo.id === id ? { ...todo, ...updates, updatedAt: new Date() } : todo
        ),
        loading: false
      }));
    } catch (error) {
      console.error('Error updating todo:', error);
      set({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred', 
        loading: false 
      });
    }
  },

  deleteTodo: async (id) => {
    set({ loading: true, error: null });
    try {
      const todoRef = doc(firestore, 'todos', id);
      await deleteDoc(todoRef);

      set(state => ({
        todos: state.todos.filter(todo => todo.id !== id),
        loading: false
      }));
    } catch (error) {
      console.error('Error deleting todo:', error);
      set({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred', 
        loading: false 
      });
    }
  }
}));

export default useTodoStore;