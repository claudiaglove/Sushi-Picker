/** Turns a Supabase auth error into a message a person can act on. */
export function friendlyAuthMessage(error: {
  code?: string | undefined
  message: string
}): string {
  switch (error.code) {
    case 'invalid_credentials':
      return "That email and password don't match. Check them and try again."
    case 'email_not_confirmed':
      return 'Please confirm your email first. Check your inbox for the link we sent.'
    case 'user_already_exists':
    case 'email_exists':
      return 'An account with that email already exists. Try signing in instead.'
    case 'weak_password':
      return 'Please choose a stronger password (at least 6 characters).'
    case 'email_address_invalid':
    case 'validation_failed':
      return "That email address doesn't look right."
    case 'over_email_send_rate_limit':
    case 'over_request_rate_limit':
      return 'Too many attempts. Please wait a few minutes and try again.'
    case 'signup_disabled':
      return 'New sign-ups are turned off for this app right now.'
    default:
      return error.message || 'Something went wrong. Please try again.'
  }
}
