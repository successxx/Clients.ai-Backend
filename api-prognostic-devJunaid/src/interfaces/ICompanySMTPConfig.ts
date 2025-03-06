export interface ICompanySMTPConfig {
    id?: number;
    companyId: number;
    smtpHost: string;
    smtpPort: number;
    smtpUser: string;
    smtpPassword: string;
    useSSL: boolean;
  }
  