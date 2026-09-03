import verifyEmailTemplate from '../src/components/accounts/templates/VerifyEmailTemplate';

describe('verifyEmailTemplate', () => {
  it('includes the one-time password in the verification message', () => {
    const message = verifyEmailTemplate('123456');

    expect(message).toContain('123456');
    expect(message).toContain('One-Time Password');
  });
});
