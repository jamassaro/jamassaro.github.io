import { useQuery } from '@tanstack/react-query'

export const useGetNbaTeamsByConference = (conference) => {


    const getNbaTeamsByConference = async () => {
      const response = await fetch(`https://api-nba-v1.p.rapidapi.com/teams?conference=${conference}`, {
         method: 'GET',
         headers: {
           'X-RapidAPI-Key': '71400e8552mshc3d2aae4f43eca9p194244jsnbf96393b64ab',
           'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com'
         },
       })
       const data = await response.json()
        return data
    }

    const { data, isLoading } = useQuery({
        queryKey: ['teams', conference],
        queryFn: getNbaTeamsByConference
    })
  
    const filterTeams = data && data.response.filter((team) => team.nbaFranchise === true)
   
  return {
    data: filterTeams,
    isLoading,
    
   
  }
}
