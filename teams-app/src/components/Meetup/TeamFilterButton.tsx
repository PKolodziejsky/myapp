import { Team } from '@microsoft/microsoft-graph-types'
import { Button, ContextMenuController, Input, RoundIconButton, SearchIcon, TeamsIcon } from '@seatti-tech/lithium'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'

import { getJoinedTeamsRequest } from '../../api/msgraph'
import { useTeamFilterState } from '../../hooks'
import { teamMatchesQuery } from '../../screens/Meetup/utilities'
import { FilterListEntry } from './FilterListEntry'

export const TeamFilterButton = () => {
  const { t } = useTranslation()

  const { teamFilter, setTeamFilter } = useTeamFilterState()
  const addTeamToFilter = (team: Team) => setTeamFilter([...teamFilter, team.id as string])
  const removeTeamFromFilter = (team: Team) => setTeamFilter(teamFilter.filter(teamId => teamId !== team.id))
  const resetTeamFilter = () => setTeamFilter([])

  const [teamSearchQuery, setTeamSearchQuery] = useState<string>()

  const { data: { joinedTeams: teams = [] } = {} } = useQuery(['joinedTeams'], getJoinedTeamsRequest)

  const reset = () => {
    setTeamSearchQuery('')
    resetTeamFilter()
  }

  let searchTeams = teams
  if (teamSearchQuery) searchTeams = teams.filter(team => teamMatchesQuery(team, teamSearchQuery))

  return (
    <ContextMenuController
      alignment='right'
      selector={toggle => (
        <RoundIconButton variant='ghost' onClick={toggle}>
          <div className='flex items-center space-x-1'>
            <TeamsIcon />
            <span className='text-sm italic text-grey-600'>{`(${teamFilter?.length ?? 0})`}</span>
          </div>
        </RoundIconButton>
      )}
    >
      {toggle => (
        <ul className='flex flex-col max-h-[420px] w-full md:min-w-[375px] md:w-max px-0 py-4 space-y-4'>
          <li className='px-6'>
            <div className='flex space-x-4 items-center'>
              <div className='font-bold text-h6 text-brand-grey-600 dark:text-white'>{t('application.planning.teams')}</div>
              <div className='w-full md:w-[260px]'>
                <Input
                  value={teamSearchQuery}
                  placeholder={t('application.planning.type-team-name')}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => setTeamSearchQuery(event.target.value)}
                  iconEnd={<SearchIcon color='#C4C4C4' />}
                />
              </div>
            </div>
          </li>
          {searchTeams && (
            <li className='px-6 overflow-y-scroll'>
              <ul className='flex flex-col w-full divide-y divide-grey-200 dark:divide-grey-700'>
                {searchTeams
                  .filter(team => team.id)
                  .map(team => {
                    const teamId = team.id as string
                    const isSelected = teamFilter?.includes(teamId)

                    return (
                      <FilterListEntry
                        id={teamId}
                        selected={isSelected}
                        text={team.displayName ?? ''}
                        onClick={() => {
                          if (isSelected) removeTeamFromFilter(team)
                          else addTeamToFilter(team)
                        }}
                      />
                    )
                  })}
              </ul>
            </li>
          )}
          <li className='px-6 h-fit w-full'>
            <ul className='w-full flex justify-center items-center space-x-2'>
              <li>
                <Button variant='secondary' onClick={reset}>
                  {t('application.planning.clear-all')}
                </Button>
              </li>
              <li>
                <Button onClick={toggle}>{t('application.planning.done')}</Button>
              </li>
            </ul>
          </li>
        </ul>
      )}
    </ContextMenuController>
  )
}
