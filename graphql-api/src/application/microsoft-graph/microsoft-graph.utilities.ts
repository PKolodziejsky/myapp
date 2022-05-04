export const addProfileImageToPerson = (person: any) => {
  person.profileImage = `/microsoft/profile/${person.id}/image`

  return person
}

export const addProfileImageToPeople = (people: any[]) => {
  people.forEach((person) => {
    addProfileImageToPerson(person)
  })

  return people
}
