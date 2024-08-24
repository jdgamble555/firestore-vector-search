import { error, type Actions } from '@sveltejs/kit';
import { adminDB } from '$lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { getEmbedding } from './posts/embedding';


export const actions = {

    searchPosts: async ({ request }) => {

        const { text } = Object.fromEntries(
            await request.formData()
        );

        if (!text || typeof text !== 'string') {
            error(401, 'Invalid Text Input!');
        }

        const embeddings = await getEmbedding(text);

        const data = await adminDB
            .collection('posts')
            .findNearest(
                'search',
                FieldValue.vector(embeddings), {
                limit: 5,
                distanceMeasure: 'EUCLIDEAN'
            })
            .get();

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
    }

} satisfies Actions;