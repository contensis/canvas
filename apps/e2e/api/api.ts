import { Client as DeliveryClient } from 'contensis-delivery-api';

const deliveryClient = DeliveryClient.create({
    rootUrl: 'https://cms-field-normalization.cloud.contensis.com',
    accessToken: 'v749dErwA3N77dVDkBwH9vqk56T4W12NFJjoE1CGB0jn2gsb8',
    projectId: 'dan',
    language: 'en-GB',
    pageSize: 50
});

export async function getRoot() {
    try {
        const node = await deliveryClient.nodes.get({
            path: '/en-gb',
            depth: 1
        });
        return node;
    } catch (e) {
        console.log('ERROR.....');
        console.log(e);
        return null;
    }
}

export async function getMenu(path: string) {
    try {
        const node = await deliveryClient.nodes.get({ path });
        if (node.childCount) {
            const children = await deliveryClient.nodes.getChildren(node);
            return [
                node, 
                ...children
            ];
        } else {
            const parent = await deliveryClient.nodes.getParent(node);
            const siblings = await deliveryClient.nodes.getChildren(parent);
            return siblings;
        }


    } catch (e) {
        console.log('ERROR.....');
        console.log(e);
        return null;
    }
}

export async function getBreadcrumb(path: string) {
    try {
        const node = await deliveryClient.nodes.get({ path });
        const ancestors = await deliveryClient.nodes.getAncestors(node);
        return [
            ...ancestors,
            node
        ];
    } catch (e) {
        console.log('ERROR.....');
        console.log(e);
        return null;
    }
}

export async function getEntry(path: string) {
    try {
        const node = await deliveryClient.nodes.get({ path });
        let entry = null;
        if (node.entry) {
            entry = await deliveryClient.entries.get({ id: node.entry.sys.id, language: node.entry.sys.language });
        }
        return {
            node,
            entry
        };
    } catch (e) {
        console.log('ERROR.....');
        console.log(e);
        return null;
    }
}