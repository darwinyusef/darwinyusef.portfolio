// GitHub raw URL configuration
export const GITHUB_RAW_BASE_URL = 'https://raw.githubusercontent.com/darwinyusef/darwinyusef.portfolio/refs/heads/main/information';

// Helper function to get GitHub raw URL
export function getGithubRawUrl(filename: string): string {
  return `${GITHUB_RAW_BASE_URL}/${filename}`;
}
