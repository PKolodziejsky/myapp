import { useMutation, useQuery } from 'react-query'

import { getCustomUserSettingsRequest, setCustomUserSettingRequest } from '../api'
import { queryClient } from '../request'
import { CustomUserSetting, CustomUserSettings } from '../types/User'

type UseCustomUserSettingProps<K, V> = {
  key: K
  initialData: V
  enabled?: boolean
  onMutationSuccess?: () => void
}

export const useCustomUserSetting = <K extends CustomUserSetting, V extends CustomUserSettings[K]>({
  key,
  initialData,
  enabled = true,
  onMutationSuccess,
}: UseCustomUserSettingProps<K, V>) => {
  const { data: customSettings = {}, isLoading } = useQuery(['settings', 'custom'], getCustomUserSettingsRequest, {
    keepPreviousData: true,
    select: ({ user }) => user?.settings?.custom ?? {},
    enabled,
  })

  const { mutate } = useMutation((value: JSONObject) => setCustomUserSettingRequest({ key, value }), {
    onSuccess: () => {
      queryClient.invalidateQueries(['settings', 'custom'])
      if (onMutationSuccess) onMutationSuccess()
    },
  })

  return {
    isLoading,
    data: customSettings[key] ?? initialData,
    mutate,
  }
}
