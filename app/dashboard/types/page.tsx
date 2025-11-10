'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface ExplorerType {
  id: number;
  default_name: string;
  explorer_type: number;
  explorer_icon: string;
  created_at: string;
}

export default function ExplorerTypesPage() {
  const [types, setTypes] = useState<ExplorerType[]>([]);
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

    loadTypes();
  };

  const loadTypes = async () => {
    try {
      const { data, error } = await supabase
        .from('explorers_info')
        .select('*')
        .order('explorer_type', { ascending: true });

      if (error) {
        console.error('Błąd ładowania typów:', error);
      } else {
        setTypes(data || []);
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
        <div className="text-xl">Ładowanie typów explorerów...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Typy Explorerów</h1>

      {types.length === 0 ? (
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-8 text-center">
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Brak typów explorerów w bazie danych.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {types.map((type) => (
            <div
              key={type.id}
              className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">{type.default_name}</h3>
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-semibold px-2.5 py-0.5 rounded">
                  Typ {type.explorer_type}
                </span>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Ikona:</span> {type.explorer_icon}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Dodano:</span>{' '}
                  {new Date(type.created_at).toLocaleDateString('pl-PL')}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

