import { PRIVATE_FIREBASE_ADMIN_CONFIG } from '$env/static/private';
import { adminAuth } from '$lib/firebase-admin';
import { PredictionServiceClient, helpers } from '@google-cloud/aiplatform';
import type { google } from '@google-cloud/aiplatform/build/protos/protos';


const model = 'text-embedding-004';
const task = 'SEMANTIC_SIMILARITY';
const location = 'us-central1';
const apiEndpoint = 'us-central1-aiplatform.googleapis.com';
const dimensionality = 768;

const firebase_admin_config = JSON.parse(PRIVATE_FIREBASE_ADMIN_CONFIG);


export const getEmbedding = async (content: string) => {

    const project = adminAuth.app.options.projectId;

    /*
const token = await adminAuth.app.options.credential!.getAccessToken();

    const url = `https://us-central1-aiplatform.googleapis.com/v1/projects/${project}/locations/us-central1/publishers/google/models/text-embedding-004:predict`;

    const r = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token.access_token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            instances: [
                {
                    "task_type": "RETRIEVAL_DOCUMENT",
                    "title": "document title",
                    "content": "I would like embeddings for this text!"
                },
            ],
            parameters: {
                outputDimensionality: dimensionality
            }
        })
    });

    if (!r.ok) {
        const error = await r.json();
        throw error;
    }

    const x = await r.json();

    console.log(x);

    */

    const client = new PredictionServiceClient({
        apiEndpoint,
        credentials: {
            client_email: firebase_admin_config.client_email,
            private_key: firebase_admin_config.private_key
        }
    });


    const [response] = await client.predict({
        endpoint: `projects/${project}/locations/${location}/publishers/google/models/${model}`,
        instances: [
            helpers.toValue({ content, task }) as google.protobuf.IValue
        ],
        parameters: helpers.toValue({
            outputDimensionality: dimensionality
        })
    });

    const predictions = response.predictions;

    if (!predictions) {
        throw 'No predictions!';
    }

    const embeddings = predictions.map(p => {
        const embeddingsProto = p.structValue!.fields!.embeddings;
        const valuesProto = embeddingsProto.structValue!.fields!.values;
        return valuesProto.listValue!.values!.map(v => v.numberValue);
    });

    return embeddings[0] as number[];
};