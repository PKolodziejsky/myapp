/// <reference types="cypress" />

describe('Planning Tests', () => {
  it('Lands on Planning', () => {
    cy.visit('http://localhost:3000')
    cy.get('[data-cy="planning-root"]')
  })

  it('Renders 5 days on weekdays', () => {
    cy.get('[data-cy="week-root"]').children().should('have.length', 5)
  })

  it('Renders correct dates', () => {
    [1, 2, 3, 4, 5].forEach(day =>
      cy.get('[data-cy="week-root"]').children(`[data-cy="2021-02-0${day}"]`).should('exist')
    )
    cy.get('[data-cy="week-root"]').children('[data-cy="2021-02-06"]').should('not.exist')
    cy.get('[data-cy="date-title"]').should('contain', 'February 2021')
  })

  it('Opens and closes weekend', () => {
    cy.get('[data-cy="week-root"]').children().should('have.length', 5)
    cy.get('[data-cy="toggle-weekend-button"]').should('contain', 'Show Weekend').click()
    cy.get('[data-cy="week-root"]').children().should('have.length', 7)
    cy.get('[data-cy="toggle-weekend-button"]').should('contain', 'Hide Weekend').click()
    cy.get('[data-cy="week-root"]').children().should('have.length', 5)
    cy.get('[data-cy="toggle-weekend-button"]').should('contain', 'Show Weekend')
  })

  it('Navigates two weeks into the future and jumps back to today', () => {
    cy.get('[data-cy="next-week-button"]').click()
    cy.get('[data-cy="week-root"]').children('[data-cy="2021-02-08"]').should('exist')
    cy.get('[data-cy="week-root"]').children().should('have.length', 5)

    cy.get('[data-cy="next-week-button"]').click()
    cy.get('[data-cy="week-root"]').children('[data-cy="2021-02-15"]').should('exist')
    cy.get('[data-cy="week-root"]').children().should('have.length', 5)

    cy.get('[data-cy="today-button"]').click()
    cy.get('[data-cy="week-root"]').children('[data-cy="2021-02-01"]').should('exist')
  })

  it('Navigates two weeks into the past and jumps back to today', () => {
    cy.get('[data-cy="previous-week-button"]').click()
    cy.get('[data-cy="2021-01-25"]').should('exist')
    cy.get('[data-cy="week-root"]').children().should('have.length', 5)

    cy.get('[data-cy="previous-week-button"]').click()
    cy.get('[data-cy="2021-01-18"]').should('exist')

    cy.get('[data-cy="today-button"]').click()
    cy.get('[data-cy="2021-02-01"]').should('exist')
  })

  it('Has past dates disabled', () => {
    cy.get('[data-cy="2021-02-03"]').find('.ui-dropdown__container').find('button').should('be.disabled')
    cy.get('[data-cy="2021-02-04"]').find('.ui-dropdown__container').find('button').should('not.be.disabled')
  })

  it('Navigates by date picker', () => {
    cy.get('.ui-popup__content__content').should('not.exist')
    cy.get('.ui-datepicker').find('button').click()
    cy.get('.ui-popup__content__content').find('[title="Next month"]').click()
    cy.get('.ui-popup__content__content').find('[role="grid"]')
    cy.get('.ui-popup__content__content').find('[aria-label="March 15, 2021"]').click()

    cy.get('.ui-popup__content__content').should('not.exist')
    cy.get('[data-cy="date-title"]').should('contain', 'March 2021')
    cy.get('[data-cy="2021-03-15"]').should('exist')
    cy.get('[data-cy="week-root"]').children().should('have.length', 5)

    cy.get('[data-cy="today-button"]').click()
    cy.get('[data-cy="2021-02-01"]').should('exist')
  })
})
