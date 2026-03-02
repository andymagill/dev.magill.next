import { promises as fs } from 'fs';
import { ProjectsData } from './types';

/**
 * Service responsible for loading project data from JSON files
 */
export class ProjectService {
	private static cache = new Map<string, ProjectsData>();

	/**
	 * Load projects from a specified JSON file
	 * @param fileSuffix Optional suffix for the projects file name
	 * @returns Promise with the projects data
	 */
	static async loadProjects(fileSuffix: string = ''): Promise<ProjectsData> {
		// Return cached result if available
		if (this.cache.has(fileSuffix)) {
			return this.cache.get(fileSuffix)!;
		}

		try {
			// Read the JSON file
			const fileName =
				process.cwd() + '/content/projects' + fileSuffix + '.json';
			const fileContent = await fs.readFile(fileName, 'utf8');

			// Check if file content is empty
			if (!fileContent) {
				throw new Error(`File: "${fileName}" was not loaded.`);
			}

			// Parse JSON with dedicated error handling for malformed JSON
			let data: ProjectsData;
			try {
				data = JSON.parse(fileContent);
			} catch (parseError) {
				throw new Error(
					`Invalid JSON in "${fileName}": ${parseError instanceof Error ? parseError.message : 'Unknown parse error'}`
				);
			}

			// Check if projects array exists and is not empty
			if (!data.projects || data.projects.length === 0) {
				throw new Error('No projects found in the JSON file');
			}

			// Cache the result before returning
			this.cache.set(fileSuffix, data);
			return data;
		} catch (error) {
			console.error('Error loading projects:', error);
			throw error;
		}
	}
}
