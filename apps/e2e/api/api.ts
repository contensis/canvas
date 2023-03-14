import NodeFetch from 'node-fetch';
import { Client as DeliveryClient } from 'contensis-delivery-api';
import { Client as ManagementClient } from 'contensis-management-api';

const deliveryClient = DeliveryClient.create({
    rootUrl: 'https://cms-develop.cloud.contensis.com',
    accessToken: '4O5Jvs0gWpAqBdjGZzzlMLVqfU5QXhT5w4NRlPxjhGcr9Vl2',
    projectId: 'dan',
    language: 'en-GB',
    pageSize: 50
});

const managementClient = ManagementClient.create({
    clientType: 'client_credentials',
    clientDetails: {
        clientId: 'd2fcb7ab-1a2e-4f4a-b12f-ecfb72204535',
        clientSecret: 'bfe5863bc7a84bedb9b7da9061197306-15666c800fe3490288b825e296943632-691c32818d22401fb2febb9609473439',
    },
    projectId: 'dan',
    rootUrl: 'https://cms-develop.cloud.contensis.com'
}, NodeFetch as any);


export async function getSitemap() {
    try {
        let node: any = await deliveryClient.nodes.get({
            path: '/en-gb/blogs',
            depth: 1
        });
        return node;
    } catch (e) {
        console.log('ERROR.....');
        console.log(e);
        return null;
    }
}

export async function getEntry(id: string, language: string) {
    try {
        const entry = await managementClient.entries.get({ id, language });
        return entry;
    } catch (e) {
        console.log('ERROR.....');
        console.log(e);
        return null;
    }
}