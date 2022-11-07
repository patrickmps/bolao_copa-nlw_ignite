import { useState, useEffect } from 'react';
import { Box, FlatList, useToast } from 'native-base';
import { api } from '../services/api';
import { Game, GameProps } from '../components/Game'
import { Loading } from './Loading';
import { EmptyMyPollList } from './EmptyMyPollList';

interface Props {
  pollId: string;
  code: string;
}

export function Guesses({ pollId, code }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [games, setGames] = useState<GameProps[]>([]);
  const [firstTeamPoints, setFirstTeamPoints] = useState('');
  const [secoundTeamPoints, setSecoundTeamPoints] = useState('');

  const toast = useToast();

  async function fetchGames() {
    try {
      setIsLoading(true);
      const response = await api.get(`/polls/${pollId}/games`);
      setGames(response.data.games)

    } catch (error) {
      console.log(error);
      toast.show({
        title: "Não foi possível carregar os jogos.",
        placement: "top",
        bgColor: "red.500",
      });

    } finally {
      setIsLoading(false);
    }
    
  }

  async function handleGuessConfirm(gameId: string) {
    try {
      if(!firstTeamPoints.trim() ||!secoundTeamPoints.trim()) {
        return toast.show({
          title: "Informe o placar do palpite.",
          placement: "top",
          bgColor: "red.500",
        });
      }

      await api.post(`/polls/${pollId}/games/${gameId}/guesses`, {
        firstTeamPoints: Number(firstTeamPoints),
        secoundTeamPoints: Number(secoundTeamPoints),
      });

      toast.show({
        title: "Palpite enviado com sucesso.",
        placement: "top",
        bgColor: "green.500",
      });

      fetchGames(); 
      

    } catch (error) {
      console.log(error);
      toast.show({
        title: "Não foi possível enviar o palpite.",
        placement: "top",
        bgColor: "red.500",
      });

    }
  }

  useEffect(() => {
    fetchGames();
  }, [pollId]);

  if(isLoading) {
    return (
      <Loading />
    )
  }

  return (
    <FlatList 
      data={games}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <Game
          data={item}
          setFirstTeamPoints={setFirstTeamPoints}
          setSecoundTeamPoints={setSecoundTeamPoints}
          onGuessConfirm={() => {handleGuessConfirm(item.id)}}
        />
      )}
      ListEmptyComponent={() => <EmptyMyPollList code={code}  />}
    />
  );
}
