// GitHub raw URL configuration
export const GITHUB_RAW_BASE_URL = 'https://raw.githubusercontent.com/darwinyusef/darwinyusef/refs/heads/master/information';

// Helper function to get GitHub raw URL
export function getGithubRawUrl(filename: string): string {
  return `${GITHUB_RAW_BASE_URL}/${filename}`;
}
