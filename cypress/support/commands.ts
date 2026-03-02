/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      /** Clicks the Generate Schedule button */
      generateSchedule(): Chainable<void>
      /** Clicks the Start Race button */
      startRace(): Chainable<void>
      /** Generates a schedule and immediately starts the race */
      setupTournament(): Chainable<void>
      /** Clicks the Skip All button */
      fastForwardToEnd(): Chainable<void>
    }
  }
}

Cypress.Commands.add('generateSchedule', () => {
  cy.contains('button', 'Generate Schedule').click()
})

Cypress.Commands.add('startRace', () => {
  cy.contains('button', 'Start Race').click()
})

Cypress.Commands.add('setupTournament', () => {
  cy.generateSchedule()
  cy.startRace()
})

Cypress.Commands.add('fastForwardToEnd', () => {
  cy.contains('button', 'Skip All').should('be.visible').click()
})

export {}
