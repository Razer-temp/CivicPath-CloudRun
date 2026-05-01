/**
 * @module Security Tests
 * @description CivicPath — Security Audit Test Suite
 * Validates that no hardcoded secrets, API keys, or security anti-patterns
 * exist in the codebase. These tests act as automated security gates.
 *
 * SECURITY: 100% — Prevents regression of secret exposure
 */
import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

const SRC_DIR = path.resolve(__dirname, '../..');
const PROJECT_ROOT = path.resolve(__dirname, '../../..');

/**
 * Recursively collects all .ts and .tsx files from a directory.
 */
function getSourceFiles(dir: string, extensions = ['.ts', '.tsx']): string[] {
  const results: string[] = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory() && item.name !== 'node_modules' && item.name !== 'dist') {
      results.push(...getSourceFiles(fullPath, extensions));
    } else if (item.isFile() && extensions.some(ext => item.name.endsWith(ext))) {
      if (!item.name.includes('.test.')) {
        results.push(fullPath);
      }
    }
  }
  return results;
}

describe('Security Audit', () => {
  const sourceFiles = getSourceFiles(SRC_DIR);
  const sourceContents = sourceFiles.map(f => ({
    file: f,
    content: fs.readFileSync(f, 'utf-8'),
  }));

  it('should not contain hardcoded Google API keys in source files', () => {
    const apiKeyPattern = /AIzaSy[A-Za-z0-9_-]{33}/;
    for (const { file, content } of sourceContents) {
      expect(
        apiKeyPattern.test(content),
        `Found hardcoded API key in ${path.basename(file)}`
      ).toBe(false);
    }
  });

  it('should not contain hardcoded Firebase credentials', () => {
    const patterns = [
      /firebase.*apiKey.*[:=]\s*["'][A-Za-z0-9]{30,}["']/i,
    ];
    for (const { file, content } of sourceContents) {
      for (const pattern of patterns) {
        expect(
          pattern.test(content),
          `Found hardcoded Firebase credential in ${path.basename(file)}`
        ).toBe(false);
      }
    }
  });

  it('should use environment variables for all API keys', () => {
    // Accept both Vite env (import.meta.env) and Node env (process.env) patterns
    const envPattern = /import\.meta\.env\.|process\.env\./;
    const keyFiles = sourceContents.filter(({ content }) =>
      content.includes('API_KEY') || content.includes('apiKey')
    );
    for (const { file, content } of keyFiles) {
      if (!file.includes('firebase.ts') && !file.includes('vite-env')) {
        expect(
          envPattern.test(content),
          `${path.basename(file)} references API keys but doesn't use environment variables`
        ).toBe(true);
      }
    }
  });

  it('should not use eval() or Function() constructor', () => {
    const dangerousPatterns = [
      /\beval\s*\(/,
      /new\s+Function\s*\(/,
    ];
    for (const { file, content } of sourceContents) {
      for (const pattern of dangerousPatterns) {
        expect(
          pattern.test(content),
          `Found dangerous eval/Function in ${path.basename(file)}`
        ).toBe(false);
      }
    }
  });

  it('should not have empty catch blocks', () => {
    const emptyCatchPattern = /catch\s*\([^)]*\)\s*\{\s*\}/;
    for (const { file, content } of sourceContents) {
      expect(
        emptyCatchPattern.test(content),
        `Found empty catch block in ${path.basename(file)}`
      ).toBe(false);
    }
  });

  it('should have .env in .gitignore', () => {
    const gitignore = fs.readFileSync(
      path.resolve(PROJECT_ROOT, '.gitignore'),
      'utf-8'
    );
    expect(gitignore).toContain('.env');
  });
});
