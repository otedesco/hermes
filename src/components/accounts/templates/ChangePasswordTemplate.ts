import { CLIENT_HOST } from '../../../configs/AppConfig';

const changePasswordTemplate = (token: string) => `some string ${token} ${CLIENT_HOST}`;

export default changePasswordTemplate;
