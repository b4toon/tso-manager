'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface Explorer {
  id: string;
  player_id: number;
  explorer_type_id: number;
  explorer_name: string;
  explorer_id: string;
  created_at: string;
  player?: {
    name: string;
    realm: string;
  };
  explorer_info?: {
    default_name: string;
    explorer_type: number;
    explorer_icon: string;
  };
}

export default function ExplorersPage() {
  const [explorers, setExplorers] = useState<Explorer[]>([]);
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

    loadExplorers();
  };

  const loadExplorers = async () => {
    try {
      const { data, error } = await supabase
        .from('explorer_players')
        .select(`
          *,
          players:player_id (name, realm),
          explorers_info:explorer_type_id (default_name, explorer_type, explorer_icon)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Błąd ładowania explorerów:', error);
      } else {
        setExplorers(data || []);
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
        <div className="text-xl">Ładowanie explorerów...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Moje Explorery</h1>

      {explorers.length === 0 ? (
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-8 text-center">
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Brak explorerów. Wyślij pierwszego explorera z gry!
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
              <thead className="bg-gray-50 dark:bg-neutral-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Nazwa Explorera
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Typ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Ikona
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Gracz
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Realm
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Data dodania
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-neutral-800 divide-y divide-gray-200 dark:divide-neutral-700">
                {explorers.map((explorer) => (
                  <tr key={explorer.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {explorer.explorer_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {(explorer.explorers_info as any)?.explorer_type || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {(explorer.explorers_info as any)?.explorer_icon || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {(explorer.players as any)?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {(explorer.players as any)?.realm || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(explorer.created_at).toLocaleDateString('pl-PL')}
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

