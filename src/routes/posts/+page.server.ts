import { error, type Actions } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';
import { adminDB } from '$lib/firebase-admin';
import { getEmbedding } from './embedding';
import { FieldValue } from 'firebase-admin/firestore';
import { dev } from '$app/environment';


export const load = (async () => {

    const data = await adminDB.collection('posts').get();

    // don't return actual vector, won't serialize
    const docs = data.docs.map((doc) => {
        const data = doc.data();
        return {
            id: doc.id,
            text: data['text']
        };
    });

    return {
        docs
    };

}) satisfies PageServerLoad;


export const actions = {

    addPost: async ({ request }) => {

        // disabling in production to prevent spam
        // comment out this line to work correctly
        if (!dev) {
            return;
        }

        const { text } = Object.fromEntries(
            await request.formData()
        );

        if (!text || typeof text !== 'string') {
            error(401, 'Invalid Text Input!');
        }

        const embeddings = await getEmbedding(text);

        // expire date for 10 minutes with TTL
        const expiredAt = new Date(new Date().getTime() + 10 * 60000);

        await adminDB.collection('posts').add({
            text,
            search: FieldValue.vector(embeddings),
            expiredAt
        });
    }

} satisfies Actions;
