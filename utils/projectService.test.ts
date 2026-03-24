/// <reference types="vitest" />
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { promises as fs } from 'fs';
import { ProjectService } from './projectService';
import { ProjectsData } from './types';

describe('ProjectService', () => {
	const mockCwd = '/mock-cwd';

	// Sample project data for tests
	const mockProjectsData: ProjectsData = {
		projects: [
			{
				title: 'Test Project 1',
				summary: 'Test Summary 1',
				description: 'Test Description 1',
				image: 'test-image-1.jpg',
				tags: ['tag1', 'tag2'],
			},
			{
				title: 'Test Project 2',
				summary: 'Test Summary 2',
				description: 'Test Description 2',
				image: 'test-image-2.jpg',
				tags: ['tag2', 'tag3'],
			},
		],
	};

	beforeEach(() => {
		// Reset all mocks between tests
		vi.restoreAllMocks();

		// Clear the ProjectService cache to ensure test isolation
		(ProjectService as any)['cache']?.clear();

		// Mock fs.readFile using spyOn instead of module mocking
		vi.spyOn(fs, 'readFile').mockImplementation(async (path, options) => {
			return JSON.stringify(mockProjectsData);
		});

		// Mock process.cwd to return a fixed path
		vi.spyOn(process, 'cwd').mockReturnValue(mockCwd);

		// Suppress console.error output for tests (we'll assert on the mock where needed)
		vi.spyOn(console, 'error').mockImplementation(() => {});
	});

	describe('loadProjects', () => {
		it('should load projects successfully with default file suffix', async () => {
			// Call the method
			const result = await ProjectService.loadProjects();

			// Verify the results
			expect(fs.readFile).toHaveBeenCalledWith(
				`${mockCwd}/content/projects.json`,
				'utf8'
			);
			expect(result).toEqual(mockProjectsData);
		});

		it('should load projects successfully with custom file suffix', async () => {
			// Call with custom suffix
			const result = await ProjectService.loadProjects('-archive');

			// Verify
			expect(fs.readFile).toHaveBeenCalledWith(
				`${mockCwd}/content/projects-archive.json`,
				'utf8'
			);
			expect(result).toEqual(mockProjectsData);
		});

		it('should throw error if file content is empty', async () => {
			// Override default mock for this test only
			vi.spyOn(fs, 'readFile').mockResolvedValueOnce('');

			// Verify it throws the expected error
			await expect(ProjectService.loadProjects()).rejects.toThrow(
				`File: "${mockCwd}/content/projects.json" was not loaded.`
			);
		});

		it('should throw error if projects array is empty', async () => {
			// Setup mock to return data with empty projects array
			const emptyProjects = { projects: [] };
			vi.spyOn(fs, 'readFile').mockResolvedValueOnce(
				JSON.stringify(emptyProjects)
			);

			// Verify it throws the expected error
			await expect(ProjectService.loadProjects()).rejects.toThrow(
				'No projects found in the JSON file'
			);
		});

		it('should throw error if projects property is missing', async () => {
			// Setup mock to return data without projects property
			const invalidData = { otherData: 'value' };
			vi.spyOn(fs, 'readFile').mockResolvedValueOnce(
				JSON.stringify(invalidData)
			);

			// Verify it throws the expected error
			await expect(ProjectService.loadProjects()).rejects.toThrow(
				'No projects found in the JSON file'
			);
		});

		it('should throw error if file read fails', async () => {
			// Setup mock to simulate file read failure
			const fileError = new Error('File not found');
			vi.spyOn(fs, 'readFile').mockRejectedValueOnce(fileError);

			// Verify it throws the expected error
			await expect(ProjectService.loadProjects()).rejects.toThrow(
				'File not found'
			);
		});

		it('should throw SyntaxError if JSON parsing fails', async () => {
			// Setup mock to return invalid JSON
			vi.spyOn(fs, 'readFile').mockResolvedValueOnce('{ invalid JSON }');

			// Verify it throws an error with JSON parse error message
			// (The service wraps the SyntaxError in a custom Error with context)
			await expect(ProjectService.loadProjects()).rejects.toThrow(
				'Invalid JSON'
			);
		});

		it('should log error to console when exception occurs', async () => {
			// Setup mock to throw error
			const fileError = new Error('File not found');
			vi.spyOn(fs, 'readFile').mockRejectedValueOnce(fileError);

			// Call the method (expecting it to throw)
			await expect(ProjectService.loadProjects()).rejects.toThrow(
				'File not found'
			);

			// Verify console.error was called with the expected arguments
			expect(console.error as any).toHaveBeenCalledWith(
				'Error loading projects:',
				fileError
			);
		});
	});
});
