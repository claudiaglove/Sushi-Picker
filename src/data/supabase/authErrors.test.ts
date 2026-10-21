import { describe, expect, it } from 'vitest'
import { friendlyAuthMessage } from './authErrors'

describe('friendlyAuthMessage', () => {
  it('explains bad credentials without revealing which field was wrong', () => {
    expect(friendlyAuthMessage({ code: 'invalid_credentials', message: 'x' })).toMatch(
      /email and password don't match/i,
    )
  })

  it('handles unconfirmed email and duplicate accounts', () => {
    expect(friendlyAuthMessage({ code: 'email_not_confirmed', message: 'x' })).toMatch(
      /confirm your email/i,
    )
    expect(friendlyAuthMessage({ code: 'user_already_exists', message: 'x' })).toMatch(
      /already exists/i,
    )
  })

  it('falls back to the server message, then a generic one', () => {
    expect(
      friendlyAuthMessage({ code: 'something_new', message: 'Server says no' }),
    ).toBe('Server says no')
    expect(friendlyAuthMessage({ message: '' })).toMatch(/something went wrong/i)
  })
})
