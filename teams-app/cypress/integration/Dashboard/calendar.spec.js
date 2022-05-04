/// <reference types="cypress" />

describe('Dashboard Tests', () => {
  it('Lands on Planning', () => {
    cy.visit('http://localhost:3000')
    cy.get('[data-cy="planning-root"]')
  })

  it('Navigates to Dashboard', () => {
    cy.get('[data-cy="home-menu-dashboard-button"]').click()
    cy.get('[data-cy="dashboard-root"]')
  })

  it('Renders the correct date', () => {
    cy.get('[data-cy="date-title"]').should('contain', 'Thu, 4th February 2021')
  })

  it('Navigates two days into the future and jumps back to today', () => {
    cy.get('[data-cy="next-date-button"]').click()
    cy.get('[data-cy="date-title"]').should('contain', 'Fri, 5th February 2021')

    cy.get('[data-cy="next-date-button"]').click()
    cy.get('[data-cy="date-title"]').should('contain', 'Sat, 6th February 2021')

    cy.get('[data-cy="today-button"]').click()
    cy.get('[data-cy="date-title"]').should('contain', 'Thu, 4th February 2021')
  })

  it('Navigates two days into the past and jumps back to today', () => {
    cy.get('[data-cy="revious-date-button"]').click()
    cy.get('[data-cy="date-title"]').should('contain', 'Wed, 3rd February 2021')

    cy.get('[data-cy="revious-date-button"]').click()
    cy.get('[data-cy="date-title"]').should('contain', 'Tue, 2nd February 2021')

    cy.get('[data-cy="today-button"]').click()
    cy.get('[data-cy="date-title"]').should('contain', 'Thu, 4th February 2021')
  })

  it('Navigates by date picker', () => {
    cy.get('.ui-popup__content__content').should('not.exist')
    cy.get('.ui-datepicker').find('button').click()
    cy.get('.ui-popup__content__content').find('[title="Next month"]').click()
    cy.get('.ui-popup__content__content').find('[role="grid"]')
    cy.get('.ui-popup__content__content').find('[aria-label="March 15, 2021"]').click()

    cy.get('.ui-popup__content__content').should('not.exist')
    cy.get('[data-cy="date-title"]').should('contain', 'Mon, 15th March 2021')

    cy.get('[data-cy="today-button"]').click()
    cy.get('[data-cy="date-title"]').should('contain', 'Thu, 4th February 2021')
  })
})
