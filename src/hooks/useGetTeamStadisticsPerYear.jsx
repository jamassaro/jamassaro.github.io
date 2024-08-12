import { useQuery } from '@tanstack/react-query'


export const useGetTeamStadisticsPerYear = (id, year) => {

    const getTeamStadisticsPerYear = async () => {
        const response = await fetch(`https://api-nba-v1.p.rapidapi.com/teams/statistics?id=${id}&season=${year}`, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': '71400e8552mshc3d2aae4f43eca9p194244jsnbf96393b64ab',
                'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com'
            },
        })
        const data = response.json()
        return data
    }

    const { data, isLoading } = useQuery({
        queryKey: ['teams/statistics', id, year],
        queryFn: getTeamStadisticsPerYear
    })

  return {
    data,
    isLoading
  }
}




