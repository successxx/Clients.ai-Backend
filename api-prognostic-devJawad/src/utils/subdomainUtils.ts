import CompanyDetail from "../models/CompanyDetail";

interface ExtendedRequest extends Request {
    info: {
      hostname: string;
    };
  }

  export function getSubdomainFromRequest(request: ExtendedRequest): string | null {
    const hostname =  request.info.hostname;
    if (!hostname) return null;
  
    const subdomain = hostname.split('.')[0];
    return subdomain || null;
  }

export async function getCompanyBySubdomain(subdomain: string) {
  const company = await CompanyDetail.findOne({ where: { subdomain } });
  return company;
}
