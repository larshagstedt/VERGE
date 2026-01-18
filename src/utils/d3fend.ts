export interface D3FendTechnique {
    id: string;      // The IRI or ID (e.g., http://d3fend.mitre.org/ontologies/d3fend.owl#CredentialHardening)
    d3fendId: string; // The specific D3F ID (e.g., D3-CH)
    name: string;    // Human readable label
    definition: string;
    url: string;
}

let cachedTechniques: D3FendTechnique[] | null = null;
let fetchPromise: Promise<D3FendTechnique[]> | null = null;

export const fetchD3FendTechniques = async (): Promise<D3FendTechnique[]> => {
    if (cachedTechniques) return cachedTechniques;
    if (fetchPromise) return fetchPromise;

    fetchPromise = (async () => {
        try {
            const response = await fetch('/data/d3fend.json');
            if (!response.ok) {
                console.error('Failed to fetch D3FEND data:', response.statusText);
                return [];
            }
            const data = await response.json();
            const graph = data['@graph'];

            if (!Array.isArray(graph)) {
                console.error('Invalid D3FEND JSON format: missing @graph array');
                return [];
            }

            const techniques: D3FendTechnique[] = [];

            graph.forEach((node: any) => {
                // Heuristic: Check if it is a class and has a d3f:d3fend-id property
                // Accessing properties safely even if they are namespaced
                const id = node['@id'];
                const type = node['@type'];
                const d3fId = node['d3f:d3fend-id'] || node['http://d3fend.mitre.org/ontologies/d3fend.owl#d3fend-id'];
                const label = node['rdfs:label'] || node['http://www.w3.org/2000/01/rdf-schema#label'];
                const comment = node['rdfs:comment'] || node['http://www.w3.org/2000/01/rdf-schema#comment'];
                
                // We verify it has a D3FEND ID to confirm it's a technique/artifact we care about
                if (d3fId && label) {
                     // Normalize ID
                     const simpleId = Array.isArray(d3fId) ? d3fId[0]['@value'] : (d3fId['@value'] || d3fId);
                     const name = Array.isArray(label) ? label[0]['@value'] : (label['@value'] || label);
                     const def = comment ? (Array.isArray(comment) ? comment[0]['@value'] : (comment['@value'] || comment)) : '';
                     
                     techniques.push({
                         id: id,
                         d3fendId: simpleId,
                         name: name,
                         definition: def,
                         url: `https://d3fend.mitre.org/technique/${simpleId}`
                     });
                }
            });

            // Sort by ID
            techniques.sort((a, b) => a.d3fendId.localeCompare(b.d3fendId));

            cachedTechniques = techniques;
            return techniques;
        } catch (error) {
            console.error('Error loading D3FEND data:', error);
            return [];
        } finally {
            fetchPromise = null;
        }
    })();

    return fetchPromise;
};
