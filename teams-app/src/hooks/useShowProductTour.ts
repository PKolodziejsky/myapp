import { useMutation, useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'

import { getCustomUserSettingsRequest, setCustomUserSettingRequest } from '../api'

export const useShowProductTour = () => {
  const navigate = useNavigate()
  const { mutateAsync } = useMutation((value: boolean) => setCustomUserSettingRequest({ key: 'productTourShown', value }))

  useQuery(['productTour'], getCustomUserSettingsRequest, {
    select: ({ user }) => user?.settings?.custom?.productTourShown ?? false,
    onSuccess: (productTourShown: boolean) => {
      if (!productTourShown) {
        mutateAsync(true).then(() => navigate('/tour'))
      }
    },
    staleTime: Infinity,
    cacheTime: Infinity,
  })
}
