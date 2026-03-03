describe('Horse Racing Simulator (E2E)', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('loads the dashboard and auto-generates the initial horse roster', () => {
    cy.contains('h1', 'Horse Racing Simulator').should('be.visible')
    cy.contains('h2', 'Horse Roster (20)').should('be.visible')

    cy.contains('button', 'Start Race').should('be.disabled')
    cy.contains('No schedule generated yet.').should('be.visible')
    cy.contains('Awaiting race results...').should('be.visible')
  })

  it('generates a schedule and unlocks the race controls', () => {
    // Custom command
    cy.generateSchedule()

    // Verify UI updates
    cy.contains('No schedule generated yet.').should('not.exist')
    cy.contains('h2', 'Schedule').parent().contains('Round 1').should('be.visible')
    cy.contains('h2', 'Schedule').parent().contains('Round 6').scrollIntoView().should('be.visible')
    cy.contains('button', 'Start Race').should('not.be.disabled')
  })

  it('runs the tournament, skips to the end, and displays results', () => {
    // Setup and start the race in one command
    cy.setupTournament()

    // Verify the "Running" state locks controls
    cy.contains('button', 'Reroll Horses').should('be.disabled')
    cy.contains('button', 'Generate Schedule').should('be.disabled')
    cy.contains('Round 1').should('be.visible')

    // Fast-forward using our custom command
    cy.fastForwardToEnd()

    // Verify the "Finished" state
    cy.contains('button', 'Replay Race').should('be.visible')
    cy.contains('Awaiting race results...').should('not.exist')
    cy.contains('h2', 'Results').parent().contains('Round 1').should('be.visible')
    cy.contains('h2', 'Results').parent().contains('Round 6').scrollIntoView().should('be.visible')
  })

  it('allows the user to replay a finished tournament', () => {
    // Quickly fly through a whole tournament
    cy.setupTournament()
    cy.fastForwardToEnd()

    // Click Replay
    cy.contains('button', 'Replay Race').click()

    // Verify the game looped back to the running state correctly
    cy.contains('button', 'Skip All').should('be.visible')
    cy.contains('Awaiting race results...').should('be.visible')
  })
})
