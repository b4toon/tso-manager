import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { GameTaskPayload } from '@/types/game';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const payload: GameTaskPayload = await request.json();
    const supabase = createServerClient();

    // Walidacja danych
    if (!payload.player_id || !payload.player_nick || !payload.realm) {
      return NextResponse.json(
        { error: 'Brak wymaganych danych gracza' },
        { status: 400 }
      );
    }

    // 1. Sprawdź czy gracz istnieje, jeśli nie - utwórz
    const { data: existingPlayer, error: playerCheckError } = await supabase
      .from('players')
      .select('*')
      .eq('id', payload.player_id)
      .single();

    if (playerCheckError && playerCheckError.code !== 'PGRST116') {
      console.error('Błąd sprawdzania gracza:', playerCheckError);
      return NextResponse.json(
        { error: 'Błąd sprawdzania gracza' },
        { status: 500 }
      );
    }

    if (!existingPlayer) {
      const { error: playerInsertError } = await supabase
        .from('players')
        .insert({
          id: payload.player_id,
          name: payload.player_nick,
          realm: payload.realm,
        });

      if (playerInsertError) {
        console.error('Błąd tworzenia gracza:', playerInsertError);
        return NextResponse.json(
          { error: 'Błąd tworzenia gracza' },
          { status: 500 }
        );
      }
    }

    // 2. Sprawdź czy typ explorera istnieje, jeśli nie - utwórz
    const { data: existingExplorerType, error: explorerTypeCheckError } = await supabase
      .from('explorers_info')
      .select('*')
      .eq('explorer_type', payload.explorer_type)
      .single();

    if (explorerTypeCheckError && explorerTypeCheckError.code !== 'PGRST116') {
      console.error('Błąd sprawdzania typu explorera:', explorerTypeCheckError);
      return NextResponse.json(
        { error: 'Błąd sprawdzania typu explorera' },
        { status: 500 }
      );
    }

    let explorerTypeId: number;

    if (!existingExplorerType) {
      const { data: newExplorerType, error: explorerTypeInsertError } = await supabase
        .from('explorers_info')
        .insert({
          default_name: payload.explorer_name,
          explorer_type: payload.explorer_type,
          explorer_icon: payload.explorer_icon,
        })
        .select()
        .single();

      if (explorerTypeInsertError || !newExplorerType) {
        console.error('Błąd tworzenia typu explorera:', explorerTypeInsertError);
        return NextResponse.json(
          { error: 'Błąd tworzenia typu explorera' },
          { status: 500 }
        );
      }

      explorerTypeId = newExplorerType.id;
    } else {
      explorerTypeId = existingExplorerType.id;
    }

    // 3. Sprawdź czy połączenie gracz-explorer istnieje, jeśli nie - utwórz
    const { data: existingExplorerPlayer, error: explorerPlayerCheckError } = await supabase
      .from('explorer_players')
      .select('*')
      .eq('player_id', payload.player_id)
      .eq('explorer_id', payload.explorer_id)
      .single();

    if (explorerPlayerCheckError && explorerPlayerCheckError.code !== 'PGRST116') {
      console.error('Błąd sprawdzania explorer_player:', explorerPlayerCheckError);
      return NextResponse.json(
        { error: 'Błąd sprawdzania explorer_player' },
        { status: 500 }
      );
    }

    if (!existingExplorerPlayer) {
      const uniqueId = `${payload.player_id}_${payload.explorer_id}`;
      
      const { error: explorerPlayerInsertError } = await supabase
        .from('explorer_players')
        .insert({
          id: uniqueId,
          player_id: payload.player_id,
          explorer_type_id: explorerTypeId,
          explorer_name: payload.explorer_name,
          explorer_id: payload.explorer_id,
        });

      if (explorerPlayerInsertError) {
        console.error('Błąd tworzenia explorer_player:', explorerPlayerInsertError);
        return NextResponse.json(
          { error: 'Błąd tworzenia explorer_player' },
          { status: 500 }
        );
      }
    }

    // 4. Dodaj akcję do tabeli explorers_actions
    const actionId = uuidv4();
    const timestamp = new Date().toISOString();

    const { error: actionInsertError } = await supabase
      .from('explorers_actions')
      .insert({
        action_id: actionId,
        player_id: payload.player_id,
        explorer_id: payload.explorer_id,
        task_id: payload.task_id,
        subtask_id: payload.sub_task_id,
        task_name: payload.task_name,
        timestamp: timestamp,
        return_time: payload.return_time,
      });

    if (actionInsertError) {
      console.error('Błąd dodawania akcji:', actionInsertError);
      return NextResponse.json(
        { error: 'Błąd dodawania akcji' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      action_id: actionId,
      message: 'Task został zapisany pomyślnie',
    });

  } catch (error) {
    console.error('Nieoczekiwany błąd:', error);
    return NextResponse.json(
      { error: 'Nieoczekiwany błąd serwera' },
      { status: 500 }
    );
  }
}

