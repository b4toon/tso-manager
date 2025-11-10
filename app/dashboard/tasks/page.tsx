'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface Task {
  action_id: string;
  player_id: number;
  explorer_id: string;
  task_id: number;
  subtask_id: number;
  task_name: string;
  timestamp: string;
  return_time: string;
  created_at: string;
  players?: {
    name: string;
    realm: string;
  };
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createBrowserClient();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      router.push('/login');
      return;
    }

    loadTasks();
  };

  const loadTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('explorers_actions')
        .select(`
          *,
          players:player_id (name, realm)
        `)
        .order('timestamp', { ascending: false })
        .limit(100);

      if (error) {
        console.error('Błąd ładowania tasków:', error);
      } else {
        setTasks(data || []);
      }
    } catch (error) {
      console.error('Nieoczekiwany błąd:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-xl">Ładowanie tasków...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Historia Tasków</h1>

      {tasks.length === 0 ? (
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-8 text-center">
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Brak tasków w historii. Wyślij pierwszego explorera na zadanie!
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
              <thead className="bg-gray-50 dark:bg-neutral-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Nazwa Taska
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Task ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Gracz
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Realm
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Wysłano
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Powrót
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-neutral-800 divide-y divide-gray-200 dark:divide-neutral-700">
                {tasks.map((task) => (
                  <tr key={task.action_id}>
                    <td className="px-6 py-4 text-sm font-medium">
                      {task.task_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {task.task_id}.{task.subtask_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {(task.players as any)?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {(task.players as any)?.realm || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(task.timestamp).toLocaleString('pl-PL')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(task.return_time).toLocaleString('pl-PL')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

