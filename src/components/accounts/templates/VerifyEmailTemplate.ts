const verifyEmailTemplate = (otp: string) => `
Hello,

To validate your account, please use the following One-Time Password (OTP):

${otp}

Enter this OTP on the account verification page to complete the process.

If you didn't request this verification, please ignore this email.

Thank you,
[Your Company Name]
`;

export default verifyEmailTemplate;
