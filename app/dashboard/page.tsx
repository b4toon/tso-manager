'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface Stats {
  totalExplorers: number;
  totalTasks: number;
  explorerTypes: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({ totalExplorers: 0, totalTasks: 0, explorerTypes: 0 });
  const [loading, setLoading] = useState(true);
  const [playerInfo, setPlayerInfo] = useState<any>(null);
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

    loadStats();
  };

  const loadStats = async () => {
    try {
      // Get total explorers
      const { count: explorersCount } = await supabase
        .from('explorer_players')
        .select('*', { count: 'exact', head: true });

      // Get total actions
      const { count: tasksCount } = await supabase
        .from('explorers_actions')
        .select('*', { count: 'exact', head: true });

      // Get explorer types
      const { count: typesCount } = await supabase
        .from('explorers_info')
        .select('*', { count: 'exact', head: true });

      setStats({
        totalExplorers: explorersCount || 0,
        totalTasks: tasksCount || 0,
        explorerTypes: typesCount || 0,
      });
    } catch (error) {
      console.error('Błąd ładowania statystyk:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-xl">Ładowanie...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
            Łączna liczba Explorerów
          </h3>
          <p className="text-4xl font-bold text-blue-600">{stats.totalExplorers}</p>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
            Wykonanych Tasków
          </h3>
          <p className="text-4xl font-bold text-green-600">{stats.totalTasks}</p>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
            Typów Explorerów
          </h3>
          <p className="text-4xl font-bold text-purple-600">{stats.explorerTypes}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Informacje</h2>
        <p className="mb-2">
          Witaj w TSO Manager! To twój centralny panel zarządzania statystykami explorerów.
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
          <li>Zobacz swoich explorerów w zakładce &quot;Moje Explorery&quot;</li>
          <li>Przeglądaj wszystkie typy explorerów w zakładce &quot;Typy Explorerów&quot;</li>
          <li>Sprawdź historię wykonanych tasków w zakładce &quot;Historia Tasków&quot;</li>
        </ul>
      </div>
    </div>
  );
}

