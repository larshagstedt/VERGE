

export interface MitreTechnique {
    id: string; // STIX ID
    mitreId: string; // T-Code (e.g. T1566)
    name: string;
    description: string;
    url: string;
    platforms: string[];
}

let cachedTechniques: MitreTechnique[] | null = null;
let fetchPromise: Promise<MitreTechnique[]> | null = null;

export const fetchMitreTechniques = async (): Promise<MitreTechnique[]> => {
    if (cachedTechniques) return cachedTechniques;
    if (fetchPromise) return fetchPromise;

    fetchPromise = (async () => {
        try {
            const response = await fetch('/data/enterprise-attack.json');
            if (!response.ok) {
                console.error('Failed to fetch MITRE data:', response.statusText);
                return [];
            }
            const data = await response.json();
            
            // Parse STIX 2.1
            const techniques = data.objects
                .filter((obj: any) => 
                    obj.type === 'attack-pattern' && 
                    !obj.revoked && 
                    !obj.x_mitre_deprecated
                )
                .map((obj: any) => {
                    const externalRef = obj.external_references?.find((ref: any) => ref.source_name === 'mitre-attack');
                    return {
                        id: obj.id,
                        mitreId: externalRef?.external_id || 'Unknown',
                        name: obj.name,
                        description: obj.description || '',
                        url: externalRef?.url || '',
                        platforms: obj.x_mitre_platforms || []
                    };
                })
                .sort((a: MitreTechnique, b: MitreTechnique) => a.mitreId.localeCompare(b.mitreId));

            cachedTechniques = techniques;
            return techniques;
        } catch (error) {
            console.error('Error loading MITRE ATT&CK data:', error);
            return [];
        } finally {
            fetchPromise = null;
        }
    })();

    return fetchPromise;
};
