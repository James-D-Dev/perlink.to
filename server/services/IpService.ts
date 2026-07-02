import type { H3Event, EventHandlerRequest } from 'h3'
import { GeoRepository } from '../repositories/geoRepository'

interface StandardizedIPResponse {
    city: string;
    country_code: string;
}

const ipAPIs = [
    "https://ipapi.co/{IP}/json/",
    "https://ipinfo.io/{IP}?token=81e1809a4979f5",
    "https://ipwho.is/{IP}",
    "https://api.ipgeolocation.io/ipgeo?apiKey=e059aed171d84ae89f54515cc9705c0f&ip={IP}",
    "https://api.ip2location.io/?key=5A285C07F96DD5D4C3564A83FE0206B4&ip={IP}"
];

function factoryResponse(data: any, provider: string): StandardizedIPResponse {
    switch (provider) {
        case 'ipapi.co':
            if (!data.country_code) throw new Error('Error');
            return {
                city: data.city || '',
                country_code: data.country_code || ''
            };
        case 'ipinfo.io':
            if (!data.country) throw new Error('Error');

            return {
                city: data.city || '',
                country_code: data.country || ''
            };
        case 'ipwho.is':
            if (!data.country_code) throw new Error('Error');
            return {
                city: data.city || '',
                country_code: data.country_code || ''
            };
        case 'api.ipgeolocation.io':
            if (!data.country_code2) throw new Error('Error');

            return {
                city: data.state_prov || '',
                country_code: data.country_code2 || ''
            };
        case 'api.ip2location.io':
            if (!data.country_code) throw new Error('Error');

            return {
                city: data.region_name || '',
                country_code: data.country_code || ''
            };
        default:
            return {
                city: '',
                country_code: ''
            };
    }
}

let apiIndex = 0;

export class IpService {
    static async getIPInfo(ip: string, event: H3Event<EventHandlerRequest>): Promise<any> {
        const geoRepo = new GeoRepository(event)

        const cached = await geoRepo.findByIp(ip)
        if (cached) return cached;

        let apiURL = ipAPIs[apiIndex]?.replace("{IP}", ip);
        if (!apiURL) {
            throw new Error('No IP API available');
        }
        apiIndex = (apiIndex + 1) % ipAPIs.length; // Chuyển API tiếp theo khi gọi
        const provider = new URL(apiURL).hostname;

        try {
            const response = await fetch(apiURL);
            const resdata = await response.json();

            const sdata = factoryResponse(resdata, provider);

            try {
                const data = await geoRepo.create({
                    ip,
                    country_code: sdata.country_code,
                    city: sdata.city
                })
                return data;
            } catch (error) {
                if (typeof console !== 'undefined' && console.error) {
                    console.error(`API lỗi: ${apiURL}, thử API tiếp theo...`);
                }
                return this.getIPInfo(ip, event); // Thử API tiếp theo nếu lỗi
            }
        } catch (error) {
            if (typeof console !== 'undefined' && console.error) {
                console.error(`API lỗi: ${apiURL}, thử API tiếp theo...`);
            }
            return this.getIPInfo(ip, event); // Thử API tiếp theo nếu lỗi
        }
    }
}