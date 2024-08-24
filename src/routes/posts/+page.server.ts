import { error, type Actions } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';
import { adminDB } from '$lib/firebase-admin';
import { getEmbedding } from './embedding';
import { FieldValue } from 'firebase-admin/firestore';


export const load = (async () => {

    const data = await adminDB.collection('posts').get();

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

        const { text } = Object.fromEntries(
            await request.formData()
        );

        if (!text || typeof text !== 'string') {
            error(401, 'Invalid Text Input!');
        }

        const embeddings = await getEmbedding(text);

        await adminDB.collection('posts').add({
            text,
            search: FieldValue.vector(embeddings)
        });
    }

} satisfies Actions;
