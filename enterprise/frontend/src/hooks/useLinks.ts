import { useQuery } from '@apollo/client'
import { GET_LINKS } from '../graphql/queries'

export const useLinks = () => {
  const { data, loading, error, refetch } = useQuery(GET_LINKS, {
    errorPolicy: 'all'
  })

  return {
    links: data?.links || [],
    loading,
    error,
    refetch
  }
}

