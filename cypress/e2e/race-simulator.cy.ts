describe('Horse Racing Simulator E2E', () => {
  beforeEach(() => {
    // Vite defaults to port 5173
    cy.visit('/')
  })

  it('completes a full racing tournament lifecycle', () => {
    // 1. Check Initial State
    cy.contains('h1', 'Horse Racing Simulator').should('be.visible')
    cy.contains('Horse Roster (20)').should('be.visible')
    cy.get('button').contains('Start Race').should('be.disabled')
    cy.contains('No schedule generated yet.').should('be.visible')

    // 2. Generate Schedule
    cy.get('button').contains('Generate Schedule').click()

    // Check that schedule populated 6 rounds
    cy.contains('Round 1').should('be.visible')
    cy.contains('Round 6').should('be.visible')

    // Start race button should now be enabled
    cy.get('button').contains('Start Race').should('not.be.disabled')

    // 3. Start the Race
    cy.get('button').contains('Start Race').click()

    // 4. Verify race progression
    // The buttons should disable while running
    cy.get('button').contains('Generate Schedule').should('be.disabled')
    cy.get('button').contains('Reroll Horses').should('be.disabled')

    // We wait for the 6th round results to appear in the Results card.
    // Each round takes ~3.8 seconds (3s base + 0.8s pause).
    // Total race time is roughly 23-25 seconds, so we extend the Cypress timeout for this specific assertion.
    cy.contains('Round 6 Results', { timeout: 30000 }).should('be.visible')

    // 5. Verify finished state
    // Buttons should re-enable
    cy.get('button').contains('Generate Schedule').should('not.be.disabled')
    cy.get('button').contains('Reroll Horses').should('not.be.disabled')
  })
})
